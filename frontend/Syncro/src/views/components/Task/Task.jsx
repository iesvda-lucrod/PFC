import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import './Task.css';
import TaskForm from '../TaskForm/TaskForm';

export default function Task({ taskInfo }) {
    const {
        task: { taskModel },
        sidePanel: { setPanel, resetPanel }
    } = useRoomContext();

    const panelData = {
        header: taskInfo.title,
        content: taskInfo.description,
        actions: [{key:'editTask',name:"Edit", function:editTask}, {key:'deleteTask',name: "Delete", function:deleteTask}]
    };

    const triggerPanel = () => {
        setPanel(panelData);
    }

    async function deleteTask () {
        let response = await taskModel.deleteTask(taskInfo);
        resetPanel();
    }

    async function editTask () {
        const newPanelData = {
            header: "Editing task",
            content: [<TaskForm key='taskForm' sectionId={taskInfo.section_id} taskData={taskInfo} editMode={true}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:triggerPanel}]
        }
        setPanel(newPanelData);
    }

    return (
        <div className="Task" onClick={triggerPanel}>
            <span>ID: {taskInfo.id}</span>
            <span>Title: {taskInfo.title}</span>
        </div>
    );
}