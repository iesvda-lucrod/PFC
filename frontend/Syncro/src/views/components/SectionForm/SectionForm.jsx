import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './SectionForm.css';
import { useRoomContext } from '../../../contexts/RoomContext';
import Section from '../../../classes/Section';

export default function SectionForm({ sectionData = {}, editMode = false , submitAction}) {
    const {
        room:{roomInfo},
        section: {sectionModel, sections, setSections}
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
        if (editMode) await sectionModel.updateSection({id: roomInfo.id, ...formData});
        else {
            let response = await sectionModel.createSection(new Section(roomInfo.id, formData.name));
            let createdSection = {...response.data, tasks: []};
            setSections(prev => {
                let newMap = new Map(prev);
                newMap.set(createdSection.id, createdSection)
                return newMap;
            });
        }

        if (submitAction) submitAction();
    }

    return (
        <div className='SectionForm'>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput name={'name'} placeholder='Section name...' onChange={(e) => {handleChange(e)}}></FormInput>
                <button type='submit'>Done</button>
            </form>
        </div>
    );
}