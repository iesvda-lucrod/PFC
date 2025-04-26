import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

export function UserContextProvider(props) {
    const { children } = props;
    const redirect = useNavigate();
    const [ user, setUser ] = useState({
        id: '',
        email: '',
        username: '',
        JWT: '',
        rooms: []
    });
    const [ isLogged, setIsLogged ] = useState(false);

    const loadData = () => {
        try {
            const localUser = JSON.parse(localStorage.getItem("userInfo"));
            if (localUser) {
                logIn(localUser);
            } else {
                logOut();
            }
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            logOut();
        }
    };
    
    useEffect(() => {
        if (!user.id) {
            console.log("USERCONTEXT --- Context not populated, loading from localstorage...");
            loadData();
        }
    }, []);

    useEffect(() => {
        if (user.id !== "") { //Only update if userinfo is already present
            console.log("USERCONTEXT --- setting userinfo to ", user);
            localStorage.setItem('userInfo', JSON.stringify(user));
        }
    }, [user]);

    const logOut = () => { //Return to initial value
        setIsLogged(false);
        setUser({
            id: '',
            email: '',
            username: '',
            JWT: '',
            rooms: []
        });
        redirect("/auth");
    }

    const logIn = (userInfo) => {
        console.log("USERCONTEXT --- Localstorage contains user info:", userInfo);
        setIsLogged(true);
        setUser(prev => ({ ...prev, ...userInfo }));
    }

    return (
        <UserContext.Provider value={{userInfo:user, setUserInfo:setUser, isLogged:isLogged, logOut:logOut, logIn:logIn}}>
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

