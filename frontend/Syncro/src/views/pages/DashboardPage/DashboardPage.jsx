import { useEffect, useState } from "react";
import { UserContext, useUserContext } from "../../../contexts/UserContext/UserContext";

import RoomForm from "../../components/RoomForm/RoomForm";
import Modal from "../../components/Modal/Modal";
import useRoom from "../../../models/useRoom";
import RoomCard from "../../components/RoomCard/RoomCard";

import './DashboardPage.css';
import useAuth from "../../../models/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    
    const { token, checkLoggedStatus } = useAuth();
    const { userInfo, saveUserInContext } = useUserContext();
    const { isLoading, model:roomModel } = useRoom(token);
    const [ openRoomForm, setOpenRoomForm ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserRooms = async () => {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log("Fetching user rooms...");
            let response = await roomModel.getUserRooms(storedUserInfo.id);
            saveUserInContext({...storedUserInfo, rooms: response.data});
        };

        (async () => {
            console.log("Checking user logged status...");
            if (!(await checkLoggedStatus())) navigate('/auth');
            else loadUserRooms();
        })();
    }, [navigate]);

    const deleteRoom = async (id) => {
        let result = await roomModel.deleteRoom(id);
        if (result) {
            let newRoomList = userInfo.rooms.filter((room) => room.id !== id);
            saveUserInContext({...userInfo, rooms: newRoomList});
            console.log("deleted correctly");
        };
    }

    return (
        <div className="DashboardPage">
        <h2>My Rooms</h2>
        <div className="roomList">
            {
                (userInfo && userInfo.rooms) && console.log("UINF RENDER",userInfo)
            }
            {
                (userInfo && userInfo.rooms) && userInfo.rooms.map((room) => 
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