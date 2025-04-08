import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './TaskForm.css';
import { RoomContext, useRoomContext } from '../../../contexts/RoomContext';
import Section from '../../../classes/Section';
import Task from '../../../classes/Task';

export default function TaskForm({ sectionId, sectionData: taskData = {}, editMode = false , submitAction}) {
    const { taskModel, sections, setSections} = useRoomContext();

    //Selecting current section
    const section = sections[sectionId];
    const setSection = () => {setSections([...sections, sections[sectionId] = section])};


    const [ formData, setFormData ] = useState({
        name: taskData.name || '',
        description: taskData.description || '',
    });

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) await taskModel.updateSection({id: sectionId, ...formData});
        else await taskModel.createSection(new Task(sectionId, ...formData));

        let response = await taskModel.getRoomSections(sectionId);
        console.log(response);
        setSection();
        if (submitAction) submitAction();
    }

    return (
        <div className='TaskForm'>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <FormInput name={'name'} placeholder='Task name...' onChange={(e) => {handleChange(e)}}></FormInput>
                <button type='submit'>Done</button>
            </form>
        </div>
    );
}