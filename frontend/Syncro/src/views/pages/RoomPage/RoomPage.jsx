import './RoomPage.css';
import { useRoomContext } from "../../../contexts/RoomContext";
import RoomBar from "../../components/RoomBar/RoomBar";
import RoomWorkspace from "../../components/RoomWorkspace/RoomWorkspace";

export default function RoomPage() {
    const {
        room: {roomInfo},
        section: {sections},
    } = useRoomContext();

    return (
        <div className="page RoomPage">
            <RoomBar roomInfo={roomInfo}/>
            <RoomWorkspace sections={sections}/>
            <div className="infoSection">

            </div>
        </div>
    );
}