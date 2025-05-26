import { useParams } from "react-router-dom";
import { RoomContextProvider } from "../../../../contexts/RoomContext/RoomContextProvider";
import RoomPage from "../RoomPage";

export default function RoomPageWrapper() {
    const params = useParams();

    return (
        <RoomContextProvider roomId={params.id}><RoomPage roomId={params.id}/></RoomContextProvider>
    );
}