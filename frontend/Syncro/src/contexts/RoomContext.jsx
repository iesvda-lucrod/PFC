import { createContext, useContext, useEffect, useState } from "react";
import useSection from "../models/useSection";
import useRoom from "../models/useRoom";
import useTask from "../models/useTask";
import useAuth from "../models/useAuth";

export const RoomContext = createContext(null);

export function RoomContextProvider(props) {
    const { children } = props;
    const {token} = useAuth();
    const roomModel = useRoom(token);
    const sectionModel = useSection(token);
    const taskModel = useTask(token);
    const [isRoomSelected, setIsRoomSelected] = useState(false);

    useEffect(() => {
        console.log("IN room context USEFF");
        if (isRoomSelected) {
            console.log("---> Loading data");
            loadRoomData();
        }
    }, [roomModel.room.id]);

    const setRoomId = (id) => {
        console.log("setting id")
        roomModel.setRoom({...roomModel.room, id: id});
        setIsRoomSelected(true);
    }

    const loadRoomData = async () => {
        let roomInfo = await roomModel.getRoomInfo(roomModel.room.id);
        console.log("RESULTING INFO ", roomInfo);
        let sections = await sectionModel.getRoomSections(roomInfo.id);
        roomModel.setRoom({...roomInfo});
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
                setRoomId,
                room: {roomModel, roomInfo:roomModel.room, setRoomInfo:roomModel.setRoom},
                section: {sectionModel, sections:sectionModel.roomSections, setSections:sectionModel.setRoomSections},
                task: {taskModel, }
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