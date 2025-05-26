import { useEffect, useState } from "react";
import { UserContext, useUserContext } from "../../../contexts/UserContext/UserContext";

import RoomForm from "../../components/RoomForm/RoomForm";
import Modal from "../../components/Modal/Modal";
import useRoom from "../../../models/useRoom";
import RoomCard from "../../components/RoomCard/RoomCard";

import './DashboardPage.css';
import useAuth from "../../../models/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

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
            saveUserInContext({...storedUserInfo, ...response.data});
            console.log("resulting user info: ", {...storedUserInfo, ...response.data});
        };

        (async () => {
            console.log("Checking user logged status...");
            if (!(await checkLoggedStatus())) navigate('/auth');
            else loadUserRooms();
        })();
    }, [navigate]);

    const deleteRoom = async (id) => {
        let response = await roomModel.deleteRoom(id);

        //TODO error case control when entering a deleted room

        if (response) {
            let newRoomList = userInfo.ownRooms.filter((room) => room.id !== id);
            saveUserInContext({...userInfo, ownRooms: newRoomList});
            console.log("deleted correctly");
        };        
    }

    const leaveRoom = async (id) => {
        let response = await roomModel.leaveRoom(userInfo.id, id);

        if (response) {
            let newRoomList = userInfo.memberRooms.filter((room) => room.id !== id);
            saveUserInContext({...userInfo, memberRooms: newRoomList});
            console.log("deleted correctly");
        };   
    }

    return (
        <div className="DashboardPage page">
            
            <section className="roomListContainer">
                <div className="roomListHeader">
                    <h2>My Rooms</h2>
                </div>
                

                <div className="roomListContent">
                    <div className="roomList">
                    {
                        isLoading ? <LoadingSpinner /> :
                        (userInfo && userInfo.ownRooms) && userInfo.ownRooms.map((room) =>
                           <RoomCard key={room.id} roomInfo={room} onClose={() => {deleteRoom(room.id)}}/>
                        )
                    }
                    </div>
                    <button onClick={() => setOpenRoomForm(true)}>New room</button>
                </div>
            </section>

            <section className="roomListContainer">
                <div className="roomListHeader">
                    <h2>Rooms im a member of</h2>
                </div>
                

                <div className="roomListContent">
                    <div className="roomList">
                    {
                        isLoading ? <LoadingSpinner /> :
                        (userInfo && userInfo.memberRooms) && userInfo.memberRooms.map((room) =>
                           <RoomCard key={room.id} roomInfo={room} onClose={() => {leaveRoom(room.id)}}/>
                        )
                    }
                    </div>
                </div>
            </section>
            
            
            
            
            
            {
                openRoomForm ?
                <Modal isOpen={openRoomForm} setIsOpen={setOpenRoomForm}>
                    <RoomForm submitAction={() => {setOpenRoomForm(false)}}></RoomForm>
                </Modal>
                : <></>
            }
        
        </div>
    );
}