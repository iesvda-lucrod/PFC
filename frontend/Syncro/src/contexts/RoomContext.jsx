import { createContext, useContext, useState } from "react";
import useSection from "../models/useSection";
import useRoom from "../models/useRoom";
import useTask from "../models/useTask";
import useAuth from "../models/useAuth";

export const RoomContext = createContext(null);

export function RoomContextProvider(props) {
    const { children } = props;
    const { token } = useAuth();

    const { isLoading:roomIsLoading, model:roomModel }          = useRoom(token);
    const { isLoading:sectionIsLoading, model:sectionModel }    = useSection(token);
    const { isLoading:taskIsLoading, model:taskModel }          = useTask(token);
    
    const [ roomInfo, setRoomInfo ] = useState(null);
    const [ sections, setSections ] = useState(null);
    const [ tasks, setTasks ]       = useState(null);

    const loadRoomInfo = async (roomId) => {
        console.log("Fetching room info...");
        const roomResponse = await roomModel.getRoomInfo(roomId);

        console.log("Fething room sections...");
        const sectionResponse = await sectionModel.getRoomSections(roomId);
        let sectionMap = new Map();
        sectionResponse.data.forEach(section => {
            sectionMap.set(section.id, section);
        });

        console.log("Fetching room tasks...");
        const sectionIds = sectionResponse.data.map((section) => section.id);
        const taskResponse = await taskModel.getSectionTasks(sectionIds);

        console.log("Organizing tasks...");
        let orderedTasks = new Map();
        taskResponse.data.forEach((task) => {
            if (!orderedTasks.has(task.section_id)) orderedTasks.set(task.section_id, []);
            orderedTasks.get(task.section_id).push(task);
        });

        console.log("Assigning tasks to sections...");
        sectionMap.forEach((value) => {
            value.tasks = orderedTasks.get(value.id) || [];
        });

        setRoomInfo(roomResponse.data);
        setSections(sectionMap);
        setTasks(orderedTasks); //TODO Needed?

        console.log("Room information:", roomResponse.data, "Sections:",sectionMap, "Tasks:", taskResponse.data);
    }

    return (
        <RoomContext.Provider
            value={{
                loadRoomInfo,
                room: {roomIsLoading, roomInfo, setRoomInfo, roomModel},
                section: {sectionIsLoading, sections, setSections, sectionModel},
                task: {taskIsLoading, tasks, setTasks, taskModel}
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}

export function useRoomContext(){
    const context = useContext(RoomContext);

    if (!context) {
        throw new Error("useRoomContext must be used within a RoomContextProvider");
    }
    return context;
}