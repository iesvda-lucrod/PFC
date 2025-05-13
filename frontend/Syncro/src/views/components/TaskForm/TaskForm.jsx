import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './TaskForm.css';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import Task from '../../../classes/Task';

export default function TaskForm({ sectionId, taskData = {}, editMode = false , submitAction}) {
    const {
        task: {taskModel},
    } = useRoomContext();

    const [ formData, setFormData ] = useState({
        title: taskData.title || '',
        description: taskData.description || '',
    });

    const handleChange = (e) => {
        const field = e.target;
        setFormData({...formData, [field.name]: field.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("subbmitting, formdata: ", formData);
        if (editMode) {
            console.log("updating, taskData", taskData, "formdata", formData, "result", {...taskData, ...formData});
            await taskModel.updateTask({...taskData, ...formData});
        }
        else {
            await taskModel.createTask(new Task({sectionId: sectionId, ...formData}));
        }

        if (submitAction) submitAction();
    }

    return (
        <form id='TaskForm' onSubmit={(e) => {handleSubmit(e)}}>
            <FormInput label='Title' name='title' placeholder='Task title...' value={formData.title} onChange={(e) => {handleChange(e)}} ></FormInput>
            <FormInput label='Description' name='description' placeholder='Task description...' value={formData.description} onChange={(e) => {handleChange(e)}}></FormInput>
        </form>
    )
}