import { useState } from "react";
import useDatabase from "./useDatabase";

export default function useAuth() {
    const [ token, setToken ] = useState(() => {
        return localStorage.getItem('token');
    });
    const { isLoading, model } = useDatabase('auth.php', token);

    const checkLoggedStatus = async () => {
        console.log("Checking user logged status...");
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            console.log("Token not found in LS...");
            return null;
        }
        setToken(storedToken);

        try {
            const response = await model.post({action: 'verifyToken'}, storedToken); //Server side validation
            console.log('Token verification result: ', response.valid);
            return response.valid ? response.data.token : null;
        } catch (e) {
            console.error('Error decoding token:', e);
            localStorage.removeItem('token');
            return null;
        }
    }

    const registerUser = async (userData) => {
        let result = await model.post({action: 'register', user: {...userData}});
        return result;
    }
    const loginUser = async (userData) => {
        let result = await model.post({action: 'login', user: {...userData}});
        if (result.valid) {
            localStorage.setItem('token', result.data.JWT);
            setToken(result.data.JWT);
        }
        return result;
    }
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    const sendVerificationEmail = async (userData) => {
        let result = await model.post({action: 'sendVerificationEmail', user: {...userData}});
        return result;
    }

    const verifyEmailCode = async (email, code) => {
        let result = await model.post({action: 'verifyEmailCode', email: email, code: code});
        return result;
    }

    const checkEmailVerified = async (userEmail) => {
        let result = await model.post({action: 'isEmailVerified', email: userEmail});
        return result.valid;
    }

    return {
        isLoading,

        register:registerUser,
        login:loginUser,
        logout,

        sendVerificationEmail,
        verifyEmailCode,

        checkLoggedStatus,
        checkEmailVerified,

        token
    }
}