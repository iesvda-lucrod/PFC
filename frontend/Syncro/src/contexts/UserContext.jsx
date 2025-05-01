import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function UserContextProvider(props) {
    const { children } = props;
    const [ user, setUser ] = useState(() => {console.log("CONTEXT: setting userinfo to:", localStorage.getItem('userInfo')); return JSON.parse(localStorage.getItem('userInfo')) || null});

    const saveUserInfo = (userInfo) => {
        //console.log("Saving to localstorage:", userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        if (!userInfo.rooms) userInfo.rooms = [];
        setUser({...userInfo});
    }

    const clearUserInfo = () => { //Return to initial value
        localStorage.clear('userInfo');
        setUser(null);
    }

    return (
        <UserContext.Provider value={{userInfo:user, removeUserFromContext:clearUserInfo, saveUserInContext:saveUserInfo}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
}

