import { useState } from 'react';
import './Section.css'
import Task from '../Task/Task';
import Modal from '../Modal/Modal';
import TaskForm from '../TaskForm/TaskForm';

export default function Section({ sectionInfo, onClose }) {
    const [ openTaskForm, setOpenTaskForm ] = useState(false);

    return (
        <div className="Section">
            <div className='header'>
                <span>Section id: {sectionInfo.id}</span>
                <span>____Section name: {sectionInfo.name}</span>
                <button onClick={() => setOpenTaskForm(true)}>+ task</button>
                <button onClick={onClose}>X</button>
            </div>

            <Modal isOpen={openTaskForm} setIsOpen={setOpenTaskForm}>
                <TaskForm sectionId={sectionInfo.id} submitAction={() => setOpenTaskForm(false)}></TaskForm>
            </Modal>
            
            
            <div>
            {
                sectionInfo.tasks.map((task) => {
                    console.log("Creating task with ", task);
                    return <Task key={task.id} taskInfo={task}></Task>
                })
            }
            </div>
            
            
        </div>
    );
}