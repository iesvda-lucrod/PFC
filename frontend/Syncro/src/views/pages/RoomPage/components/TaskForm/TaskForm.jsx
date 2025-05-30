import { useState } from 'react';
import FormInput from '../../../../components/FormInput/FormInput';
import './TaskForm.css';
import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';
import Task from '../../../../../classes/Task';

export default function TaskForm({ sectionId, taskData = {}, editMode = false , submitAction}) {
    const {
        task: {taskModel},
    } = useRoomContext();

    const [ formData, setFormData ] = useState({
        title: taskData.title || '',
        description: taskData.description || '',
    });
    const [ validationErrors, setValidationErrors  ] = useState({
        title:'',
    });

    const handleChange = (e) => {
        const field = e.target;
        const value = field.value;
        const name = field.name;

        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (name === 'title') newErrors.title = value.length > 50 ? 'Max. 50 characters' : '';
            if (name === 'description') newErrors.description = value.length > 400 ? 'Max. 400 characters' : '';
            return newErrors;
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            setValidationErrors(prev => ({...prev, title:'This field is required'}));
            return;
        }

        console.log("subbmitting, formdata: ", formData);
        if (editMode) {
            console.log("updating, taskData", taskData, "formdata", formData, "result", {...taskData, ...formData});
            await taskModel.updateTask({sectionId:sectionId, ...taskData, ...formData});
        }
        else {
            console.log("subbmitting, formdata: ", new Task({sectionId: sectionId, ...formData}));
            await taskModel.createTask({sectionId: sectionId, ...formData});
        }

        if (submitAction) submitAction();

        setFormData({title: '', description: ''});
    }

    return (
        <form id='TaskForm' onSubmit={(e) => {handleSubmit(e)}}>
            <FormInput label='Title' name='title' placeholder='Task title...'
            value={formData.title}
            validationErrorMessage={validationErrors.title}
            onChange={(e) => {handleChange(e)}} ></FormInput>
            <FormInput label='Description' name='description' placeholder='Task description...'
            value={formData.description}
            validationErrorMessage={validationErrors.description}
            onChange={(e) => {handleChange(e)}}></FormInput>
        </form>
    )
}