import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import './RoomForm.css';
import RoomModel from '../../../models/RoomModel';

export default function RoomForm() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const roomModel = new RoomModel();
    const [ roomInfo, setRoomInfo ] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const field = event.target;
        setRoomInfo({...roomInfo, [field.name]: field.value});
    }

    const createRoom = async () => {
        console.log("userinfo",userInfo.rooms);
        userInfo.rooms.map(({roomId, roomName}) => {
            console.log("id", roomId, "name", roomName);
        });

        //Check duplicates
        if (!validateRoomInfo()) {
            return false;
        }
        console.log("Create room triggered");
        let result = await roomModel.post({...roomInfo, user_id:userInfo.id});
        console.log(result);
        let newRoomList = await roomModel.get({id: userInfo.id});
        console.log("NRL",newRoomList);
        setUserInfo({...userInfo, rooms: [...newRoomList]});
    }

    const validateRoomInfo = () => {
        console.log("This users room names",userInfo.rooms.map((room) => room.name))
        if (userInfo.rooms.map((room) => room.name).includes(roomInfo.name)) {
            console.log("Duplicate room found");
            return false;
        };
        console.log("No dupes");
        return true;
    }

    return (
        <div className="RoomForm">
            <form>
                <div className="inputGroup">
                    <label>Room Name:</label>
                    <input id="roomName" name="roomName" type="text" onChange={() => {handleChange(event)}}/>
                    <span>Room name can only contain letters, spaces and numbers</span>
                </div>
            </form>
            <button type="submit" onClick={createRoom}>Create Room</button>
        </div>
        
    );
}