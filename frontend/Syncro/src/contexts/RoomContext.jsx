import { createContext, useContext, useEffect, useState } from "react";
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
        setRoomInfo(roomResponse.data);
        console.log("Fething room sections...");
        const sectionResponse = await sectionModel.getRoomSections(roomId);
        setSections(sectionResponse.data);

        const sectionIds = sectionResponse.data.map((section) => section.id);
        const taskResponse = await taskModel.getSectionTasks(sectionIds);
        //let orderedTasks = taskResponse.data.map+(map) => {}

        console.log("Room information:", roomResponse.data, "Sections:",sectionResponse.data, "Tasks:", taskResponse.data);
    }

    return (
        <RoomContext.Provider
            value={{
                loadRoomInfo,
                room: {roomIsLoading, roomInfo, roomModel},
                section: {sectionIsLoading, sections, sectionModel},
                task: {taskIsLoading, tasks, taskModel}
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