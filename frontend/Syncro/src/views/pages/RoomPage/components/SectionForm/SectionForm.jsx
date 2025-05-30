import { useState } from 'react';
import FormInput from '../../../../components/FormInput/FormInput';
import './SectionForm.css';
import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';
import Section from '../../../../../classes/Section';

export default function SectionForm({sectionData = {}, editMode = false, submitAction}) {
    const {
        room:{roomInfo},
        section: { sectionModel }
    } = useRoomContext();

    const [ formData, setFormData ] = useState({
        name: sectionData.name || '',
        description: sectionData.description || '',
    });
    const [ validationErrors, setValidationErrors  ] = useState({
        name:'',
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            setValidationErrors(prev => ({...prev, name:'This field is required'}));
            return;
        }

        if (editMode){
            console.log("updating, taskData", sectionData, "formdata", formData, "result", {...sectionData, ...formData});
            await sectionModel.updateSection({...sectionData, ...formData});
        }
        else {
            await sectionModel.createSection(new Section({room_id: roomInfo.id, ...formData}));
        }

        if (submitAction) submitAction();

        setFormData({name: '', description: ''});
    }

    return (
        <form id='SectionForm' onSubmit={(e) => {handleSubmit(e)}}>
            <FormInput label='Name' name={'name'} placeholder='Section name...' 
            value={formData.name}
            validationErrorMessage={validationErrors.name}
            onChange={(e) => {handleChange(e)}}/>
            <FormInput label='Description' name={'description'} placeholder='Section description...'
            value={formData.description}
            validationErrorMessage={validationErrors.description}
            onChange={(e) => {handleChange(e)}}/>
        </form>
    );
}