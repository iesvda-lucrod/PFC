import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import './RoomForm.css';

export default function RoomForm({submitAction = console.err("Form submitted, no action provided")}) {
    const { userInfo } = useContext(UserContext);
    const [ roomInfo, setRoomInfo ] = useState({
        name: '',
    });
    const [ validationErrors, setValidationErrors ] = useState('');

    const handleChange = (e) => {
        const field = e.target;
        setRoomInfo({...roomInfo, [field.name]: field.value});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateRoomInfo()) {
            return false;
        }
        submitAction();
    }

    const validateRoomInfo = () => {
        //console.log("This users room names",userInfo.rooms.map((room) => room.name))

        if (/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/.test(roomInfo.name)) {
            setValidationErrors("Room name can only contain letters, spaces and numbers");
            return;
        }

        if (userInfo.rooms.map((room) => room.name).includes(roomInfo.name)) {
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