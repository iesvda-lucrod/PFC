import Section from "../classes/Section";
import useDatabase from "./useDatabase";

export default function useSection(token) {
    const { isLoading, model } = useDatabase('section.php', token);

    const getRoomSections = async (roomId) => {
        console.log("fetching room sections: ", {room_id: roomId});
        const result = await model.get({room_id: roomId});
        return result;
    }

    const createSection = async (newSection) => {
        if (!(newSection  instanceof Section)) throw new Error("The information must be sent as Section object");
        let result = await model.post({...newSection});
        return result;
    }
    const deleteSection = async (section) => {
        let result = await model.delete(section);
        return result;
    }
    const updateSection = async (sectionInfo) => {
        const payload = new Section(sectionInfo);
        let result = await model.put(payload);
        return result;
    }

    return {isLoading, model:{getRoomSections, createSection, deleteSection, updateSection}}
}