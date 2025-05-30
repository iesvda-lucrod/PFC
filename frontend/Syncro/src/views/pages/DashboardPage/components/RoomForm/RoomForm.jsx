import { useState } from 'react';
import { useUserContext } from '../../../../../contexts/UserContext/UserContext';
import './RoomForm.css';
import Room from '../../../../../classes/Room';
import useRoom from '../../../../../models/useRoom';
import useAuth from '../../../../../models/useAuth';
import FormInput from '../../../../components/FormInput/FormInput';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

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
        const value = field.value;
        const name = field.name;

        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (name === 'name') newErrors.name = value.length > 50 ? 'Max. 50 characters' : '';
            if (name === 'description') newErrors.description = value.length > 400 ? 'Max. 400 characters' : '';
            return newErrors;
        });
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