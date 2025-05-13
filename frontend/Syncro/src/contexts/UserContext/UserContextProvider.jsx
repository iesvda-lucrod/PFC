import { useState } from "react";
import { UserContext } from "./UserContext";


export function UserContextProvider(props) {
    const { children } = props;
    const [ user, setUser ] = useState(() => {
        //console.log("CONTEXT: setting userinfo to:", localStorage.getItem('userInfo'));
        return JSON.parse(localStorage.getItem('userInfo'));
    });

    const saveUserInfo = (userInfo) => {
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