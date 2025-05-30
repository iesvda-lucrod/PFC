import './Section.css'
import Task from '../Task/Task';
import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';
import TaskForm from '../TaskForm/TaskForm';
import { useEffect, useRef, useState } from 'react';
import SectionForm from '../SectionForm/SectionForm';
import { Icon_check, Icon_cross, Icon_plus } from '../../../../../assets/icons';
import Modal from '../../../../components/Modal/Modal';

export default function Section({ sectionInfo }) {
    const {
        section: { sectionModel },
        task: { taskModel },
        sidePanel: { setPanel, resetPanel, setPanelOpen }
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
        if (sectionInfo.tasks.length > 0) {
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
            actions: [
                {key:'confirmSection', className:'confirmButton', icon:<Icon_check/>, name:"Confirm", targetForm:'SectionForm'},
                {key:'cancelTask', className:'cancelButton', icon:<Icon_cross/>, name:'Cancel', function:triggerPanel}]
        }
        setPanel(newPanelData);
    }

    const showTaskForm = (e) => {
        e.stopPropagation();
        setPanel({
            header:"Create a task on "+sectionInfo.name,
            content: [<TaskForm key='taskForm' sectionId={sectionInfo.id} editMode={false} submitAction={() => setPanelOpen(false)}/>],
            actions: [
                {key:'confirmTask', className:'confirmButton', icon:<Icon_check/>, name:"Confirm", targetForm:'TaskForm'},
                {key:'cancelTask', className:'cancelButton', icon:<Icon_cross/>, name:'Cancel', function:triggerPanel}
            ]
        });
    }

    const handleDragOver = (e) =>  {
        e.preventDefault();
        setDragStyle('draggingOver');
    }
    const handleDragLeave = (e) =>  {
        setDragStyle('');
    }
    const handleDrop = async (e) =>  {
        e.preventDefault();
        e.stopPropagation();
        console.log("Dropping in section");
        
        const movedTask = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetSection = sectionInfo;

        let result = await taskModel.changeSection(movedTask, targetSection);
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