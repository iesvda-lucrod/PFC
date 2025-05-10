import './RoomBar.css';
import SectionForm from '../SectionForm/SectionForm';
import { useRoomContext } from '../../../contexts/RoomContext/RoomContext';

export default function RoomBar({roomInfo}) {
    const {
        sidePanel: { setPanel, resetPanel }
    } = useRoomContext();

    const showSectionForm = () => {
            setPanel({
                header:"Create a section",
                content: [<SectionForm key='sectionForm' editMode={false}/>],
                actions: [{key:'confirmSection', name:"Confirm", targetForm:'SectionForm'},{key:'cancelSection',name:'Cancel', function:resetPanel}]
            });
        }

    return (
        <div className="RoomBar">
            <h2>{roomInfo.name}</h2>
            <button onClick={showSectionForm}>+ Section</button>

            <button>Options</button>
            <div>Users</div>
        </div>
    );
}