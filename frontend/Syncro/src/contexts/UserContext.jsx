import { createContext, useContext, useState } from "react";

export const UserContext = createContext({email: '',
    username: '',
    JWT: '',});

export function UserContextProvider(props) {
    const { children } = props;
    const [ user, setUser ] = useState({
        email: '',
        username: '',
        JWT: '',
    });

    const isLogged = () => {
        return user.email === '' ? false : true;
    }

    return (
        <UserContext.Provider value={{userInfo:user, setUserInfo:setUser, isLogged:isLogged()}}>
            {children}
        </UserContext.Provider>
    );
}