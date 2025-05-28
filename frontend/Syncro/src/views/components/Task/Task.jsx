import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import './Task.css';
import TaskForm from '../TaskForm/TaskForm';
import { useState } from 'react';

export default function Task({ taskInfo }) {
    const {
        task: { taskModel },
        sidePanel: { setPanel, resetPanel , setPanelOpen}
    } = useRoomContext();
    const { dragStyle, dragMethods} = useDrag();

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
            onDragStart={(e) => dragMethods.handleDragStart(e)}
            
            onDragEnter={(e) => dragMethods.handleDragEnter(e)}
            onDragOver={(e) => dragMethods.handleDragOver(e, taskInfo)}
            onDragLeave={(e) => dragMethods.handleDragLeave(e)}

            onDragEnd={(e) => dragMethods.handleDragEnd(e)}

            onDrop={(e) => dragMethods.handleDrop(e)}

        >
            <div className={'taskContent' +(taskInfo.done ? ' done': '')}>
                <span className='title'>{taskInfo.title}</span>
            </div>
        </div>
    );
}


const useDrag = () => {
    const  [style, setStyle ] = useState('');

    const handleDragStart = (e) => {
        e.dataTransfer.setData("Text", e.target.id);
        e.dataTransfer.dropEffect = "move";
        console.log("DRAG START");
        
        setStyle('dragStart');
    }
    const handleDragEnter = (e) => {
        console.log(" ENTER");
     
    }
    const handleDragOver = (e, taskInfo) => {
        e.preventDefault();
        e.stopPropagation();
        //if (taskInfo.id == e.dataTransfer)
        console.log("E", e, "datatransfer", e.dataTransfer);

        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        //console.log("Left? : " + x + " ; Top? : " + y + ". --> drop top", (y < rect.height / 2));

        if (y < rect.height / 2) setStyle('draggingOverTop');
        else setStyle("draggingOverBottom");
    }
    const handleDragLeave = (e) => {
        console.log("Drag exit");
        setStyle('');
    }

    const handleDrop = () => {
        console.log("drop");
        setStyle('');
    }
    const handleDragEnd = (e) => {
        setStyle('');
    }
    
    return {dragStyle:style, dragMethods:{handleDragStart, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, handleDragEnd}};
}