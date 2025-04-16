import './RoomPage.css';
import { useRoomContext } from "../../../contexts/RoomContext";
import RoomBar from "../../components/RoomBar/RoomBar";
import RoomWorkspace from "../../components/RoomWorkspace/RoomWorkspace";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoomDetailsPanel from '../../components/RoomDetailsPanel/RoomDetailsPanel';

export default function RoomPage() {
    const params = useParams();
    const {
        setRoomId,
        room: {roomInfo},
        section: {sections},
    } = useRoomContext(params.id);

    useEffect(() => {
        setRoomId(params.id);
        //TODO check if room from useparams is from user, redirect if not
    }, []);
    

    return (
        <div className="page RoomPage">
            <div></div>
            <RoomBar roomInfo={roomInfo}/>
            <div className='roomContent'>
                <RoomWorkspace sections={sections}/>
                <RoomDetailsPanel></RoomDetailsPanel>
            </div>
            
        </div>
    );
}