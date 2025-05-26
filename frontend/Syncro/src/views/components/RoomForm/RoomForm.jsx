import { useState } from 'react';
import { useUserContext } from '../../../contexts/UserContext/UserContext';
import './RoomForm.css';
import Room from '../../../classes/Room';
import useRoom from '../../../models/useRoom';
import useAuth from '../../../models/useAuth';
import FormInput from '../FormInput/FormInput';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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
    }
    const handleSubmit =  async (e) => {
        e.preventDefault();
        if (!validateRoomInfo()) {
            return;
        }
        if (editMode) await roomModel.updateRoom({...formData});
        else await roomModel.createRoom(userInfo.id, new Room(formData.name));

        let response = await roomModel.getUserRooms(userInfo.id);
        saveUserInContext({...userInfo, ...response.data});
        if (submitAction) submitAction();
    }

    const validateRoomInfo = () => {
        if (!formData.name) {
            setValidationErrors("Field required");
            return;
        }
        if (/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/.test(formData.name)) {
            setValidationErrors("Can only contain letters, spaces and numbers");
            return;
        }

        if (userInfo.ownRooms.map((room) => room.name).includes(formData.name)) {
            setValidationErrors("Room with the same name already exists");
            return false;
        };
        console.log("No dupes");
        return true;
    }

    return (
        <div className="RoomForm">
            <form onSubmit={handleSubmit}>
                <FormInput label={'Room name'} name={'name'} type='text' 
                value={formData.name}
                onChange={(e) => handleChange(e)}
                validationErrorMessage={validationErrors}
                ></FormInput>
            <button type="submit">{isLoading ? <LoadingSpinner /> : 'Create Room'}</button>
            
            </form>
        </div>
    );
}