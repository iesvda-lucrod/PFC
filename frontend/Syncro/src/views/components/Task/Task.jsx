import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import './Task.css';
import TaskForm from '../TaskForm/TaskForm';
import { useEffect, useRef } from 'react';

export default function Task({ taskInfo }) {
    const {
        task: { taskModel },
        sidePanel: { setPanel, resetPanel , setPanelOpen}
    } = useRoomContext();

    const triggerPanel = (header = null, content = null) => {
        console.log("triggerpanel with : ", header, content);
        setPanel({
            header:  header || taskInfo.title,
            content: content || [taskInfo.description],
            actions: [{key:'editTask',name:"Edit", function:editTask}, {key:'deleteTask',name: "Delete", function:removeTask}],
        });
    }

    async function removeTask () {
        let response = await taskModel.deleteTask(taskInfo);
        resetPanel();
    }

    async function editTask () {
        const newPanelData = {
            header: "Editing task",
            content: [<TaskForm key='taskForm' sectionId={taskInfo.section_id} taskData={taskInfo} editMode={true} submitAction={() => resetPanel()}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:() => triggerPanel()}]
        }
        setPanel(newPanelData);
    }

    return (
        <div className="Task" onClick={() => triggerPanel()}>
            <span className='title'>{taskInfo.title}</span>
        </div>
    );
}