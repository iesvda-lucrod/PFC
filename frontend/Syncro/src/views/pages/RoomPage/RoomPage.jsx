import './RoomPage.css';
import { useRoomContext } from "../../../contexts/RoomContext/RoomContext";
import RoomBar from "../../components/RoomBar/RoomBar";
import RoomWorkspace from "../../components/RoomWorkspace/RoomWorkspace";
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomSidePanel from '../../components/RoomSidePanel/RoomSidePanel';
import useAuth from '../../../models/useAuth';
import { useUserContext } from '../../../contexts/UserContext/UserContext';

export default function RoomPage({ roomId }) {
    const navigate = useNavigate();

    const { token, checkLoggedStatus } = useAuth();
    const { userInfo, saveUserInContext } = useUserContext();
    
    const {
        loadRoom,
        room: {roomInfo, roomModel},
        section: {sections},
        sidePanel: { resetPanel },
        webSocket
    } = useRoomContext(roomId, token);

    const hasRunRef = useRef(false);
    useEffect(() => {
        if (hasRunRef.current) return; //React Fast Refresh (only on dev mode) calls the function twice, this prevents it from happening for visual clarity
        hasRunRef.current = true;

        const isUserPartOfRoom = async () => {   
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            saveUserInContext(storedUserInfo);

            console.log("Checking user is a member of the room...");
            const response = await roomModel.getRoomMembers(roomId);
            const memberIds = response.data.map((member) => (member.id));
            return memberIds.includes(storedUserInfo.id);
        }

        (async () => {
            console.log("Checking user authorization to room...");
            if (!(await checkLoggedStatus() && await isUserPartOfRoom())) {
                navigate('/auth');
            } else {
                console.log("Fetching room information...");
                await loadRoom();

                console.log("Broadcasting");
                webSocket.joinRoom(userInfo, roomId);
            }
        })();
    }, []);

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
                roomInfo && <RoomBar roomInfo={roomInfo}/>
            }
            
            <div className='roomContent'>
                {
                    sections && <RoomWorkspace sections={sections}/>
                }
                <RoomSidePanel></RoomSidePanel>
            </div>
            
        </div>
    );
}