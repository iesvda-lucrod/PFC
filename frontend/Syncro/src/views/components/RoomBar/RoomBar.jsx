import { useState } from 'react';
import './RoomBar.css';
import Modal from '../Modal/Modal';
import SectionForm from '../SectionForm/SectionForm';

export default function RoomBar({roomInfo}) {
    const [ openSectionForm, setOpenSectionForm ] = useState(false);

    return (
        <div className="RoomBar">
            <h2>{roomInfo.name}</h2>
            <button onClick={() => {setOpenSectionForm(true)}}>+ Section</button>
            <Modal isOpen={openSectionForm} setIsOpen={setOpenSectionForm}>
                <SectionForm sectionData={{room_id: roomInfo.id}}/>
            </Modal>
            

            <button>Options</button>
            <div>Users</div>
        </div>
    );
}