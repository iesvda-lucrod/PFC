import './RoomPage.css';
import { useRoomContext } from "../../../contexts/RoomContext/RoomContext";
import RoomBar from "../../components/RoomBar/RoomBar";
import RoomWorkspace from "../../components/RoomWorkspace/RoomWorkspace";
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoomSidePanel from '../../components/RoomSidePanel/RoomSidePanel';
import useAuth from '../../../models/useAuth';
import { useUserContext } from '../../../contexts/UserContext/UserContext';

export default function RoomPage() {
    const params = useParams();
    const navigate = useNavigate();

    const { token, checkLoggedStatus } = useAuth();
    const { saveUserInContext } = useUserContext();
    
    const {
        loadRoomInfo,
        room: {roomInfo, roomModel},
        section: {sections},
        sidePanel: { resetPanel },
        webSocket: {initWebSocket, sendJsonMesage}
    } = useRoomContext(params.id, token);

    const hasRunRef = useRef(false);
    useEffect(() => {
        if (hasRunRef.current) return; //React Fast Refresh (only on dev mode) calls the function twice, this prevents it from happening for visual clarity
        hasRunRef.current = true;

        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        saveUserInContext(storedUserInfo);
        
        const isUserPartOfRoom = async () => {   
            console.log("Checking user is a member of the room...") 
            const response = await roomModel.getRoomMembers(params.id);
            const memberIds = response.data.map((member) => (member.id));
            return memberIds.includes(storedUserInfo.id);
        }

        (async () => {
            console.log("Checking user authorization to room...");
            if (!(await checkLoggedStatus() && await isUserPartOfRoom())) {
                navigate('/auth');
            } else {
                console.log("Fetching room information...");
                await loadRoomInfo(params.id);
                
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