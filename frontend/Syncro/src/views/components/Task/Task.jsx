import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import './Task.css';
import TaskForm from '../TaskForm/TaskForm';
import { useState } from 'react';

export default function Task({ taskInfo }) {
    const {
        task: { taskModel },
        sidePanel: { setPanel, resetPanel , setPanelOpen}
    } = useRoomContext();
    const { dragStyle, dragMethods} = useDrag(taskModel);

    const triggerPanel = () => {
        setPanel({
            header: taskInfo.title,
            content: [taskInfo.description],
            actions: [{key:'toggleDone', name:(taskInfo.done ? 'Not done': 'Done'), function:toggleDone}, {key:'editTask',name:"Edit", function:editTask}, {key:'deleteTask',name: "Delete", function:removeTask}],
        });
    }

    const toggleDone = async () => {
        let response = await taskModel.updateTask({sectionId:taskInfo.section_id, ...taskInfo, done:(taskInfo.done ? 0 : 1)});
        resetPanel();
    }

    const removeTask = async () => {
        let response = await taskModel.deleteTask(taskInfo);
        resetPanel();
    }

    const editTask = async () => {
        const newPanelData = {
            header: "Editing task",
            content: [<TaskForm key='taskForm' sectionId={taskInfo.section_id} taskData={taskInfo} editMode={true} submitAction={() => resetPanel()}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:() => triggerPanel()}]
        }
        console.log("DMS", dragMethods);
        setPanel(newPanelData);
    }

    return (
        <div className={"Task "+dragStyle} onClick={() => triggerPanel()}
        draggable={true}
            onDragStart={(e) => dragMethods.handleDragStart(e, taskInfo)}
            
            onDragOver={(e) => dragMethods.handleDragOver(e, taskInfo)}
            onDragLeave={(e) => dragMethods.handleDragLeave(e)}

            onDragEnd={(e) => dragMethods.handleDragEnd(e)}

            onDrop={(e) => dragMethods.handleDrop(e, taskInfo)}

        >
            <div className={'taskContent' +(taskInfo.done ? ' done': '')}>
                <span className='title'>{taskInfo.title}</span>
            </div>
        </div>
    );
}


const useDrag = (taskModel) => {
    const  [style, setStyle ] = useState('');

    const handleDragStart = (e, taskInfo) => {
        const data = JSON.stringify(taskInfo);
        console.log(data);
        e.dataTransfer.setData("text/plain", data);
        e.dataTransfer.dropEffect = "move";
        console.log("DRAG START");
        
        setStyle('dragStart');
    }
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStyle("draggingOver");

        var rect = e.target.getBoundingClientRect();
        var y = e.clientY - rect.top;  //y position within the element.

        if (y < rect.height / 2) setStyle('draggingOverTop');
        else setStyle("draggingOverBottom");
    }
    const handleDragLeave = (e) => {setStyle('');}

    const handleDrop = async (e, taskInfo) => {
        e.preventDefault();
        e.stopPropagation();
        //console.log("dropping ", e.dataTransfer, "current", e.currentTarget);
        
        const currentTask = JSON.parse(e.dataTransfer.getData('text/plain'));
        const droppedTask = taskInfo;
        if (currentTask.id === droppedTask.id) return;

        var rect = e.target.getBoundingClientRect();
        var y = e.clientY - rect.top;

        let under;
        if (y < rect.height / 2) under = false;
        else under = true;

        let result = await taskModel.reorderTask(currentTask, droppedTask, under);

        setStyle('');
        
    }
    
    const handleDragEnd = (e) => {
        setStyle('');
    }
    
    return {dragStyle:style, dragMethods:{handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd}};
}