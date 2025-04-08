import { useRoomContext } from '../../../contexts/RoomContext';
import Section from '../Section/Section';
import './RoomWorkspace.css'
export default function RoomWorkspace({ sections }) {
    const {
        section: {sectionModel, setSections}
    } = useRoomContext();

    const removeSection = async (section) => {
        let newSectionList = await sectionModel.deleteSection(section);
        console.log("setting to nwe ", newSectionList);
        setSections(newSectionList);
    }

    return (
        <div className='RoomWorkspace'>
        {
            sections.map((section) => {
                return <Section key={section.id} sectionInfo={section} onClose={() => {removeSection(section)}}/>
            })
        }
        </div>
    );
}