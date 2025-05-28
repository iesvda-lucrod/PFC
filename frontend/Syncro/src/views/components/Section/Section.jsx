import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';
import TaskForm from '../TaskForm/TaskForm';
import { useEffect, useRef, useState } from 'react';
import SectionForm from '../SectionForm/SectionForm';
import { Icon_cross, Icon_plus } from '../../../assets/icons';
import Modal from '../Modal/Modal';

export default function Section({ sectionInfo }) {
    const {
        section: { sectionModel },
        sidePanel: { setPanel, setPanelOpen, resetPanel }
        
    }  = useRoomContext();
    const [ showConfirmationModal, setShowConfirmationModal] = useState();

    const [ dragStyle, setDragStyle ] = useState('');

    const triggerPanel = () => {
        setPanel({
            header: sectionInfo.name,
            content: [sectionInfo.description, <>Tasks: {sectionInfo.tasks.length}</>],
            actions: [{key:'editSection',name:"Edit", function:editSection}],
        });
    }

    const removeSection = async (e) => {
        e.stopPropagation();
        if (sectionInfo.tasks.length > 0) { //TODO confirmation modal
            setShowConfirmationModal(true);
            return;
        }
        await deleteSection();
    }
    const deleteSection = async () => {
        setShowConfirmationModal(false);
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
            header:"Create a task on "+sectionInfo.name,
            content: [<TaskForm key='taskForm' sectionId={sectionInfo.id} editMode={false}/>],
            actions: [{key:'confirmTask', name:"Confirm", targetForm:'TaskForm'},{key:'cancelTask',name:'Cancel', function:triggerPanel}]
        });
    }

    const handleDragOver = () =>  {
        console.log("DRAGGING OVER SERCTION");
        setDragStyle('draggingOver');
    }
    const handleDragLeave = () =>  {
        setDragStyle('');
        
    }
    const handleDrop = () =>  {
        setDragStyle('');
    }
    

    return (
        <div className="Section">
            <div className='header' onClick={triggerPanel}>
                <h4>{sectionInfo.name}</h4>
                <div className='headerButtons'>
                    <button type='button' aria-label="Add task"     onClick={(e) => showTaskForm(e)}><Icon_plus/></button>
                    <button type='button' aria-label="Delete task"  onClick={(e) => removeSection(e)}><Icon_cross/></button>
                </div>
            </div>

            <div className={'content '+dragStyle} onDragOver={(e) => handleDragOver(e)}  onDragLeave={(e) => handleDragLeave(e)} onDrop={(e) => handleDrop(e)}>
            {sectionInfo.tasks.length > 0 ? (
                sectionInfo.tasks.map((task) => {
                    return <Task key={task.id} taskInfo={task}></Task>
                })
                ) : (
                    <div className='contentWhenEmpty'>
                        <p>No tasks yet</p>
                    </div>
                )
            }
            </div>


            <Modal isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
                <p>This section still contains tasks, are you sure you want to delete the section?</p>
                <button onClick={deleteSection}>Yes, delete the section</button>
            </Modal>
        </div>
    );
}