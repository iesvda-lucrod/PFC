import { useState } from "react";
import useDatabase from "./useDatabase";
import User from "./User";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

export default function useAuth() {
    //populate from ls?
    const [ token, setToken ] = useState(null);
    const { isLoading, model } = useDatabase(token);
    const navigate = useNavigate();

    const registerUser = async (userData) => {
        if (!(userData instanceof User)) {throw new Error('Please use an instance of User to ensure correct format')};
        let result = await model.post({action: 'register'});
        return result;
    }
    const loginUser = async (userData) => {
        let result = await model.post({action: 'register', user: {...userData}});
        localStorage.setItem('token', JSON.stringify(result.data.JWT));
        setToken(result.data.JWT);
        return result;
    }

    const isLogged = async (redirectUrl = null) => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            if (redirectUrl) navigate(redirectUrl); 
            return false;
        }
        setToken(storedToken);

        try {
            const decodedToken = jwtDecode(storedToken);
            if ((decodedToken.exp * 1000) < Date.now()) { //Client side validation
                localStorage.removeItem('token');
                return false;
            }
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