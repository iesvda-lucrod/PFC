import { createContext, useContext, useEffect, useState } from "react";
import useSection from "../models/useSection";
import useRoom from "../models/useRoom";
import { useParams } from "react-router-dom";
import useTask from "../models/useTask";

export const RoomContext = createContext(null);

export function RoomContextProvider(props) {
    const params = useParams();
    const { children } = props;
    const [ room, setRoom ] = useState({
        id: '',
        name: '',
        users: [],
    });
    

    const roomModel = useRoom();
    const sectionModel = useSection();
    const taskModel = useTask();

    useEffect(() => {
        loadRoomData();
    }, []);
    const loadRoomData = async () => {
        let roomInfo = await roomModel.get({id: params.id})
        let sections = await sectionModel.getRoomSections(roomInfo.id);
        setRoom({...roomInfo});
        sectionModel.setRoomSections([...sections]);
        console.log("Result: ", roomInfo, sections);

        sections.forEach(async (section) => {
            let tasks = await taskModel.getSectionTasks(section.id);
            section.tasks = tasks;
        });

        sectionModel.setRoomSections([...sections]);
        console.log("Result: ", roomInfo, sections);
    }

    return (
        <RoomContext.Provider 
            value={{
                room: {roomModel, roomInfo:room, setRoomInfo:setRoom},
                section: {sectionModel, sections:sectionModel.roomSections, setSections:sectionModel.setRoomSections},
                task: {taskModel}
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