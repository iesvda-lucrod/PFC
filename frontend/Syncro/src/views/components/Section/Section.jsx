import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import TaskForm from '../TaskForm/TaskForm';

export default function Section({ sectionInfo }) {
    const {
        section: { sectionModel },
        sidePanel: { setPanel, setPanelOpen, resetPanel }
        
    }  = useRoomContext();

    const panelInfo = {
        header: sectionInfo.name,
        content: [],
        actions: [],
    }
    const triggerPanel = () => {
        setPanel(panelInfo);
    }

    const removeSection = async (e) => {
        e.stopPropagation();
        console.log("truger delet", sectionInfo);
        const response = await sectionModel.deleteSection(sectionInfo);
        resetPanel();
    }

    const showTaskForm = (e) => {
        e.stopPropagation();
        setPanel({
            header:"Create a task",
            content: [<TaskForm key='taskForm' sectionId={sectionInfo.id} editMode={false}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:() => {setPanelOpen(false)}}]
        });
    }

    return (
        <div className="Section">
            <div className='header' onClick={triggerPanel}>
                <h4>{sectionInfo.name}</h4>
                <button onClick={(e) => showTaskForm(e)}>+</button>
                <button onClick={(e) => removeSection(e)}>X</button>
            </div>

            <div>
            {
                sectionInfo.tasks.map((task) => {
                    return <Task key={task.id} taskInfo={task}></Task>
                })
            }
            </div>
        </div>
    );
}