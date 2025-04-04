import { createContext, useState } from "react";

export const RoomContext = createContext({id: '',
    name: ''});

export function RoomContextProvider(props) {
    const { children } = props;
    const [ room, setRoom ] = useState({
        id: '',
        name: '',
        users: [],
        sections: [],
        tasks: [],
    });

    return (
        <RoomContext.Provider value={{roomInfo:room, setRoomInfo:setRoom}}>
            {children}
        </RoomContext.Provider>
    );
}