import { useContext, useEffect, useState } from "react";
import RoomForm from "../components/RoomForm/RoomForm";
import Modal from "../components/Modal/Modal";
import { UserContext } from "../../contexts/UserContext";
import RoomModel from "../../models/RoomModel";

export default function DashboardPage() {
    const [ openRoomForm, setOpenRoomForm ] = useState(false);
    const { userInfo, setUserInfo, isLogged } = useContext(UserContext);
    console.log(userInfo);
    const roomModel = new RoomModel();

    useEffect(() => {
        roomModel.get({id: userInfo.id})
        .then((userRooms) => {
            console.log(userRooms);
            setUserInfo({...userInfo, rooms: [...userRooms]});
            
        });
    }, []);

    return (
        <>
        <h2>My Rooms</h2>
        <button onClick={() => setOpenRoomForm(true)}>New</button>
        <Modal isOpen={openRoomForm} setIsOpen={setOpenRoomForm}>
            <RoomForm></RoomForm>
        </Modal>
        <h2>Rooms I'm a memeber of</h2>
        
        </>
    );
}