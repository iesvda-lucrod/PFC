import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

import RoomForm from "../../components/RoomForm/RoomForm";
import Modal from "../../components/Modal/Modal";
import useRoom from "../../../models/useRoom";
import RoomCard from "../../components/RoomCard/RoomCard";

import './DashboardPage.css';

export default function DashboardPage() {
    const [ openRoomForm, setOpenRoomForm ] = useState(false);
    const { userInfo, setUserInfo, isLogged } = useContext(UserContext);
    const roomModel = useRoom();

    useEffect(() => {
        if (!isLogged) {
            return;
        }
        const loadData = async () => {
            let response = await roomModel.getUserRooms(userInfo.id);
            setUserInfo({...userInfo, rooms: response});
            console.log("userInfo", {...userInfo, rooms: response});
        };
        loadData();
    }, []);

    const deleteRoom = async (id) => {
        let result = await roomModel.delete({id: id});
        if (result) {
            let newRoomList = userInfo.rooms.filter((room) => room.id !== id);
            setUserInfo({...userInfo, rooms: newRoomList});
            console.log("deleted correctly");
        };
    }

    return (
        <div className="DashboardPage">
        <h2>My Rooms</h2>
        <div className="roomList">
            {
                userInfo.rooms.map((room) => 
                    <RoomCard key={room.id} roomInfo={room} onClose={() => {deleteRoom(room.id)}}/>
                )
            }
        </div>
        
        <button onClick={() => setOpenRoomForm(true)}>New</button>
        {
            openRoomForm ?
            <Modal isOpen={openRoomForm} setIsOpen={setOpenRoomForm}>
                <RoomForm submitAction={() => {setOpenRoomForm(false)}}></RoomForm>
            </Modal>
            : <></>
        }
        
        <h2>Rooms I'm a memeber of</h2>
        
        </div>
    );
}