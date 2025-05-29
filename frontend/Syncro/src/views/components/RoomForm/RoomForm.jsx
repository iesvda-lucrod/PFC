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
        description: roomInfo.description || '',
    });
    const [ validationErrors, setValidationErrors ] = useState({
        name: '',
        description: '',
    });

    

    const validateRoomInfo = () => {
        setValidationErrors({name:'',description:''});
        if (!formData.name) {
            setValidationErrors(prev => ({...prev, name:'This field is required'}));
            return;
        }
        console.log("Formdatanamelengyt", formData.name.length);
        if (formData.name.length > 50) {
            setValidationErrors(prev => ({...prev, name:'Max 50 characters'}));
            return;
        }
        if (/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/.test(formData.name)) {
            setValidationErrors(prev => ({...prev, name:"Can only contain letters, spaces and numbers"}));
            return;
        }

        if (userInfo.ownRooms.map((room) => room.name).includes(formData.name)) {
            setValidationErrors(prev => ({...prev, name:"Room with the same name already exists"}));
            return false;
        };
        return true;
    }

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
        else await roomModel.createRoom(userInfo.id, new Room(formData));

        let response = await roomModel.getUserRooms(userInfo.id);
        saveUserInContext({...userInfo, ...response.data});
        if (submitAction) submitAction();
    }

    return (
        <div className="RoomForm">
            <form onSubmit={handleSubmit}>
                <FormInput label={'Room name'} name={'name'} type='text' 
                value={formData.name}
                onChange={(e) => handleChange(e)}
                validationErrorMessage={validationErrors.name}
                ></FormInput>

                <FormInput label={'Room description'} name={'description'} type='text' 
                value={formData.description}
                onChange={(e) => handleChange(e)}
                validationErrorMessage={validationErrors.description}
                ></FormInput>

                <button type="submit">{isLoading ? <LoadingSpinner /> : 'Create Room'}</button>            
            </form>
        </div>
    );
}