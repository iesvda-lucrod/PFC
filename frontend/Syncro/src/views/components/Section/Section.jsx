import { useState } from 'react';
import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../contexts/RoomContext';

export default function Section({ sectionInfo, tasks, onClose}) {
    const [mockTask] = useState([
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
        {id: 3, name: 'C'},
    ]);
    const {task: {createTask}} = useRoomContext();

    const addTask = () => {
        console.log(createTask);
    }


    return (
        <div className="Section">
            <div className='header'>
            Section id: {sectionInfo.id}
            Section name: {sectionInfo.name}
            <button onClick={() => {addTask()}}>+ task</button>
            <button onClick={onClose}>X</button>
            </div>

            
            
            <div>
                {mockTask.map((task) => {
                    return <Task key={task.id} taskInfo={task}></Task>
                })}
            </div>
        </div>
    );
}