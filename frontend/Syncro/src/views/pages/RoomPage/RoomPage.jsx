import './RoomPage.css';
import { useRoomContext } from "../../../contexts/RoomContext/RoomContext";
import RoomBar from "./components/RoomBar/RoomBar";
import RoomWorkspace from "./components/RoomWorkspace/RoomWorkspace";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomSidePanel from './components/RoomSidePanel/RoomSidePanel';
import useAuth from '../../../models/useAuth';
import { useUserContext } from '../../../contexts/UserContext/UserContext';
import Modal from "../../components/Modal/Modal";

export default function RoomPage({ roomId }) {
    const navigate = useNavigate();

    const { token, checkLoggedStatus } = useAuth();
    const { userInfo, saveUserInContext, removeUserFromContext } = useUserContext();
    
    const {
        loadRoom,
        room: { roomInfo, roomModel },
        section: {sections},
        sidePanel: { resetPanel },
        webSocket
    } = useRoomContext(roomId, token);

    const [ role, setRole ] = useState(null);
    const [ connectionLost, setConnectionLost ] = useState(webSocket.isOpen);

    const hasRunRef = useRef(false);
    useEffect(() => {
        if (hasRunRef.current) return; //React Fast Refresh (only on dev mode) calls the function twice, this prevents it from happening for visual clarity
        hasRunRef.current = true;

        const isUserPartOfRoom = async () => {   
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            saveUserInContext(storedUserInfo);

            console.log("Checking user is a member of the room...");
            const response = await roomModel.getRoomMembers(roomId);
            const found = response.data.find((member) => member.id === storedUserInfo.id)

            if (found === undefined) {return false};
            setRole(found.role);
            return true;
        }

        (async () => {
            console.log("Checking user authorization to room...");
            if (!(await checkLoggedStatus())) {
                removeUserFromContext();
                navigate('/auth');
            } else if (!(await isUserPartOfRoom())) {
                navigate('/dashboard');
            } else {
                console.log("Fetching room information...");
                await loadRoom();
                webSocket.joinRoom(userInfo, roomId);
            }
        })();
    }, []);

    const connectionEstablished = useRef(false);
    useEffect(() => {
        console.log("WS change", webSocket.isOpen);
        if (webSocket.isOpen) connectionEstablished.current = true;
        if (!webSocket.isOpen && connectionEstablished.current) setConnectionLost(true);
    }, [webSocket.isOpen]);

    const hasLoaded = useRef(false);
    useEffect(() => {
        if (roomInfo && !hasLoaded.current) {
            resetPanel();
            hasLoaded.current = true;
        }
    }, [roomInfo, resetPanel]);
    

    return (
        <div className="page RoomPage">
            {
                roomInfo && <RoomBar roomInfo={roomInfo} role={role}/>
            }
            
            <div className='roomContent'>
                {
                    sections && <RoomWorkspace sections={sections} role={role}/>
                }
                <RoomSidePanel></RoomSidePanel>
            </div>
            
            <Modal isOpen={connectionLost} onClose={() => navigate('/dashboard')}>
                Connection lost, you will be redirected to your dashboard
            </Modal>
        </div>
    );
}