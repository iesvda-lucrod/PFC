import { useState } from 'react';
import { useUserContext } from '../../../contexts/UserContext';
import './RoomForm.css';
import { useRoomContext } from '../../../contexts/RoomContext';
import Section from '../../../classes/Section';
import Room from '../../../classes/Room';
import useRoom from '../../../models/useRoom';

export default function RoomForm({editMode = false, roomInfo = {}, submitAction = console.err("Form submitted, no action provided")}) {
    const { userInfo, setUserInfo } = useUserContext();
    const [ formData, setFormData ] = useState({
        name: roomInfo.name || '',
    });
    const roomModel = useRoom();
    const [ validationErrors, setValidationErrors ] = useState('');

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
        console.log("FORMDATA: ", {...formData, [field.name]: field.value});
    }
    const handleSubmit =  async (e) => {
        e.preventDefault();
        if (!validateRoomInfo()) {
            return false;
        }
        console.log(roomInfo.name);
        if (editMode) await roomModel.updateRoom({...formData});
        else await roomModel.createRoom(userInfo.id, new Room(formData.name));

        let response = await roomModel.getUserRooms(userInfo.id);
        setUserInfo({...userInfo, rooms: response});
        if (submitAction) submitAction();
    }

    const validateRoomInfo = () => {
        //console.log("This users room names",userInfo.rooms.map((room) => room.name))

        if (/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/.test(formData.name)) {
            setValidationErrors("Room name can only contain letters, spaces and numbers");
            return;
        }

        if (userInfo.rooms.map((room) => room.name).includes(formData.name)) {
            setValidationErrors("Room with the same name already exists");
            return false;
        };
        console.log("No dupes");
        return true;
    }

    return (
        <div className="RoomForm">
            <form onSubmit={handleSubmit}>
                <div className="inputGroup">
                    <label>Room Name:</label>
                    <input id="name" name="name" type="text" onChange={() => {handleChange(event)}}/>
                    <span>{validationErrors}</span>
                </div>
            <button type="submit">Create Room</button>
            </form>
        </div>
    );
}