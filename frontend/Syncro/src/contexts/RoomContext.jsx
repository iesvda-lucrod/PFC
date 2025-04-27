import { createContext, useContext, useEffect, useState } from "react";
import useSection from "../models/useSection";
import useRoom from "../models/useRoom";
import useTask from "../models/useTask";
import useAuth from "../models/useAuth";

export const RoomContext = createContext(null);

export function RoomContextProvider(props) {
    const { children } = props;
    const { token } = useAuth();
    const { isLoading:roomIsLoading, model:roomModel } = useRoom(token);
    //const sectionModel = useSection(token);
    //const taskModel = useTask(token);
    const [ roomInfo, setRoomInfo ] = useState(null);
    const [ isRoomSelected, setIsRoomSelected ] = useState(false);

    useEffect(() => {
        const loadRoomData = async () => {
            console.log("Fetching room info... (WIP)");
            setIsRoomSelected(true);
        }

        if (isRoomSelected) {
            loadRoomData();
        }
    }, [isRoomSelected]);

    const setRoomId = (id) => {
        console.log("setting id")
        roomModel.setRoom({...roomModel.room, id: id});
        setIsRoomSelected(true);
    }

    

    return (
        <RoomContext.Provider 
            value={{
                setRoomId,
                room: {roomModel, roomInfo:roomModel, setRoomInfo:roomModel},
                //section: {sectionModel, sections:sectionModel.roomSections, setSections:sectionModel.setRoomSections},
                //task: {taskModel, }
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