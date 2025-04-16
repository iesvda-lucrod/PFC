import { useState } from 'react';
import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../contexts/RoomContext';
import Modal from '../Modal/Modal';
import TaskForm from '../TaskForm/TaskForm';

export default function Section({ sectionInfo, tasks, onClose}) {
    const [mockTask] = useState([
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
        {id: 3, name: 'C'},
    ]);
    const {task: {taskModel}} = useRoomContext();
    const [ openTaskForm, setOpenTaskForm ] = useState(false);

    const addTask = () => {
        setOpenTaskForm(true);
    }


    return (
        <div className="Section">
            <div className='header'>
                Section id: {sectionInfo.id}
                Section name: {sectionInfo.name}
                <button onClick={() => {addTask()}}>+ task</button>
                <button onClick={onClose}>X</button>
            </div>

            <Modal isOpen={openTaskForm} setIsOpen={setOpenTaskForm}>
                <TaskForm sectionId={sectionInfo.id} submitAction={() => setOpenTaskForm(false)}></TaskForm>
            </Modal>
            
            
            <div>
                {tasks.map((task) => {
                    return <Task key={task.id} taskInfo={task}></Task>
                })}
            </div>
        </div>
    );
}