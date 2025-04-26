import { useState } from "react";
import useDatabase from "./useDatabase";
import User from "../classes/User";

export default function useAuth() {
    //populate from ls?
    const [ token, setToken ] = useState(null);
    const { isLoading, model } = useDatabase('auth.php', token);

    const registerUser = async (userData) => {
        let result = await model.post({action: 'register', user: {...userData}});
        return result;
    }
    const loginUser = async (userData) => {
        let result = await model.post({action: 'login', user: {...userData}});
        localStorage.setItem('token', JSON.stringify(result.data.JWT));
        setToken(result.data.JWT);
        return result;
    }

    const isLogged = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            return false;
        }
        setToken(storedToken);

        try {
            const isValid = model.post({action: 'verifyToken'}); //Server side validation
            return isValid;
        } catch (e) {
            console.error('Error decoding token:', e);
            localStorage.removeItem('token');
            return false;
        }
    }
    
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    return {isLoading, register:registerUser, login:loginUser, isLogged, logout}
}