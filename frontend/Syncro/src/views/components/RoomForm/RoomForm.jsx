import { useState } from 'react';
import { useUserContext } from '../../../contexts/UserContext';
import './RoomForm.css';
import Section from '../../../classes/Section';
import Room from '../../../classes/Room';
import useRoom from '../../../models/useRoom';
import useAuth from '../../../models/useAuth';

export default function RoomForm({editMode = false, roomInfo = {}, submitAction = console.err("Form submitted, no action provided")}) {
    const { userInfo, saveUserInContext } = useUserContext();
    const {token} = useAuth();
    const { isLoading, model:roomModel } = useRoom(token);
    const [ formData, setFormData ] = useState({
        name: roomInfo.name || '',
    });
    const [ validationErrors, setValidationErrors ] = useState('');

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
        //console.log("FORMDATA: ", {...formData, [field.name]: field.value});
    }
    const handleSubmit =  async (e) => {
        e.preventDefault();
        if (!validateRoomInfo()) {
            return;
        }
        if (editMode) await roomModel.updateRoom({...formData});
        else await roomModel.createRoom(userInfo.id, new Room(formData.name));

        let response = await roomModel.getUserRooms(userInfo.id);
        saveUserInContext({...userInfo, rooms: response.data});
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