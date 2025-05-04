import { useRoomContext } from '../../../contexts/RoomContext';
import Section from '../Section/Section';
import './RoomWorkspace.css'
export default function RoomWorkspace() {
    const {
        section: {sections, setSections, sectionModel}
    } = useRoomContext();

    const removeSection = async (target) => {
        await sectionModel.deleteSection(target);
        setSections(prev => {
            let newSections = new Map(prev);
            newSections.delete(target.id);
            return newSections;
        });
    }

    return (
        <div className='RoomWorkspace'>
        {
            Array.from(sections.values()).map((section) => {
                console.log("CREATING SECTION: ", section);
                return <Section key={section.id} sectionInfo={section} onClose={() => {removeSection(section)}}/>
            })
        }
        </div>
    );
}