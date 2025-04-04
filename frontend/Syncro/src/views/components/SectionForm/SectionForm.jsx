import { useContext, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './SectionForm.css';
import { RoomContext } from '../../../contexts/RoomContext';

export default function SectionForm({ sectionData = {}, mode = 'create' }) {
    const room_id = sectionData;
    const [ formData, setFormData ] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted", formData);
    }

    return (
        <div className='SectionForm'>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput name={'name'} placeholder='Section name...' onChange={(e) => {handleChange(e)}}></FormInput>
            </form>
        </div>
    );
}