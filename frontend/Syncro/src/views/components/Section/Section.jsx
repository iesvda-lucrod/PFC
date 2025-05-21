import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import TaskForm from '../TaskForm/TaskForm';
import { useEffect, useRef, useState } from 'react';
import SectionForm from '../SectionForm/SectionForm';

export default function Section({ sectionInfo }) {
    const {
        section: { sectionModel },
        sidePanel: { setPanel, setPanelOpen, resetPanel }
        
    }  = useRoomContext();
    const [ showConfirmationModal, setShowConfirmationModal] = useState();

    const triggerPanel = () => {
        setPanel({
            header: sectionInfo.name,
            content: sectionInfo.description,
            actions: [{key:'editSection',name:"Edit", function:editSection}],
        });
    }

    const removeSection = async (e) => {
        e.stopPropagation();
        if (sectionInfo.tasks.length > 0) { //TODO confirmation modal
            setShowConfirmationModal(true);
        }
        const response = await sectionModel.deleteSection(sectionInfo);
        resetPanel();
    }

    async function editSection () {
        const newPanelData = {
            header: "Editing section",
            content: [<SectionForm key='sectionForm' sectionData={sectionInfo} editMode={true} submitAction={() => resetPanel()}/>],
            actions: [{key:'confirmsECTION', name:"Confirm", targetForm:'SectionForm'},{key:'cancelTask',name:'Cancel', function:triggerPanel}]
        }
        setPanel(newPanelData);
    }

    const showTaskForm = (e) => {
        e.stopPropagation();
        setPanel({
            header:"Create a task",
            content: [<TaskForm key='taskForm' sectionId={sectionInfo.id} editMode={false}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:triggerPanel}]
        });
    }

    return (
        <div className="Section">
            <div className='header' onClick={triggerPanel}>
                <h4>{sectionInfo.name}</h4>
                <button type='button' aria-label="Add task"     onClick={(e) => showTaskForm(e)}>+</button>
                <button type='button' aria-label="Delete task"  onClick={(e) => removeSection(e)}>X</button>
            </div>

            <div>
            {sectionInfo.tasks.length > 0 ? (
                sectionInfo.tasks.map((task) => {
                    return <Task key={task.id} taskInfo={task}></Task>
                })
                ) : (
                    <p>No tasks yet</p>
                )
            }
            </div>
        </div>
    );
}