import { useRoomContext } from '../../../../../contexts/RoomContext/RoomContext';
import Section from '../Section/Section';
import './RoomWorkspace.css'

export default function RoomWorkspace() {
    const {
        section: { sections }
    } = useRoomContext();

    return (
        <div className='RoomWorkspace'>
        {
            sections.map((section, index) => {
                return <Section key={index} sectionInfo={section}/>
            })
        }
        </div>
    );
}