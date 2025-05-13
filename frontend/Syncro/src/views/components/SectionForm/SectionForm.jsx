import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './SectionForm.css';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import Section from '../../../classes/Section';

export default function SectionForm({sectionData = {}, editMode = false, submitAction}) {
    const {
        room:{roomInfo},
        section: { sectionModel }
    } = useRoomContext();

    const [ formData, setFormData ] = useState({
        name: sectionData.name || '',
    });

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode){
            console.log("updating, taskData", sectionData, "formdata", formData, "result", {...sectionData, ...formData});
            await sectionModel.updateSection({...sectionData, ...formData});
        }
        else {
            await sectionModel.createSection(new Section({room_id: roomInfo.id, ...formData}));
        }

        if (submitAction) submitAction();
    }

    return (
        <form id='SectionForm' onSubmit={(e) => {handleSubmit(e)}}>
            <FormInput label='Name' name={'name'} placeholder='Section name...' value={formData.name} onChange={(e) => {handleChange(e)}}/>
        </form>
    );
}