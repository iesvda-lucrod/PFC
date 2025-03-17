import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import './RoomForm.css';

export default function RoomForm() {
    const { userInfo } = useContext(UserContext);

    const createRoom = () => {
        //userinfo is a object rooms is an array of objects
        console.log(userInfo);
        userInfo.rooms.map(({roomId, roomName}) => {
            console.log("id", roomId, "name", roomName);
        });

        //Check duplicates
        console.log("Create room triggered");
    }

    return (
        <div className="RoomForm">
            <form>
                <div className="inputGroup">
                    <label>Room Name:</label>
                    <input id="roomname" type="text" />
                    <span>Room name can only contain letters, spaces and numbers</span>
                </div>
            </form>
            <button type="submit" onClick={createRoom}>Create Room</button>
        </div>
        
    );
}