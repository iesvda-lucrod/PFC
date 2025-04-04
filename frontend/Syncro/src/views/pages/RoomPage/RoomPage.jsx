import { useParams } from "react-router-dom";
import './RoomPage.css';
import { useContext, useEffect } from "react";
import RoomModel from "../../../models/RoomModel";
import { RoomContext, RoomContextProvider } from "../../../contexts/RoomContext";
import RoomBar from "../../components/RoomBar/RoomBar";
import { UserContext } from "../../../contexts/UserContext";
import RoomWorkspace from "../../components/RoomWorkspace/RoomWorkspace";
import SectionForm from "../../components/SectionForm/SectionForm";

export default function RoomPage() {
    const params = useParams();
    
    const { roomInfo, setRoomInfo } = useContext(RoomContext);
    
    const roomModel = new RoomModel();

    useEffect(() => {
        roomModel.get({id: params.id})
        .then((result) => {
            console.log("Room info on load:", result);
            setRoomInfo({...result});
        });
    }, []);

    return (
        <div className="page RoomPage">
            <RoomBar roomInfo={roomInfo}/>
            <RoomWorkspace />
            <div className="infoSection">

            </div>
        </div>
    );
}