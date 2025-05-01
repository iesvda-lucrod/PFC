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
    
    const [ roomInfo, setRoomInfo ] = useState(null);

    const loadRoomInfo = async (id) => {
        const roomData = await roomModel.getRoomInfo(id);
        setRoomInfo(roomData);
    }

    return (
        <RoomContext.Provider 
            value={{
                loadRoomInfo,
                room: {roomInfo, roomModel},
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