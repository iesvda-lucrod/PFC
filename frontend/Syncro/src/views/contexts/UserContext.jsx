import { createContext, useState, useContext, useEffect } from "react";

//Create context and custom hook to encapsulate functionality
const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

//Define the provider's data and manipulation methods to share
export default function UserContextProvider(props) {
    const { children } = props;
    //Relevant data to store in state
    const [ user, setUser ] = useState(null);

    //Functions to handle this context's data
    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    useEffect(() => {
      console.log('CONTEXT USER CHANGED', user);
    }, [user]);

    //Offer the context with predetermined value
    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
          {children}
        </UserContext.Provider>
      );
}

//TODO use session to store user context? (persist between reloads)