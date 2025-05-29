import { useState } from "react";
import useFetch from "./useFetch";

export default function useAuth() {
    const [ token, setToken ] = useState(() => {
        return localStorage.getItem('token');
    });
    const { isLoading, model } = useFetch('auth.php', token);

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
            if (!response.valid) {
                logout();
                return null;
            }
            return response.data.token;
        } catch (e) {
            console.error('Error decoding token:', e);
            localStorage.removeItem('token');
            logout();
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

    const sendInvitationEmail = async (sender, receiverEmail, room) => {
        let result = await model.post({action: 'sendInvitationEmail', senderData:sender, receiverEmail:receiverEmail, roomData:room});
        return result;
    }
    const acceptInvitation = async (userId, roomId, code) => {
        let result = await model.post({action: 'acceptInvitation', user_id:userId, room_id:roomId, code:code});
        return result;
    }

    const sendPasswordChangeEmail = async (email) => {
        let result = await model.post({action: 'forgotPassword', email:email});
        return result;
    }
    const verifyPasswordChangeRequest = async (userId, code) => {
        let result = await model.post({action: 'verifyPasswordChangeRequest', user_id:userId, code:code});
        return result;
    }
    const changePassword = async (newPassword, code) => {
        let result = await model.post({action:'changePassword', newPassword:newPassword, code:code});
        return result;
    }

    const sendContactEmail = async (name, email, subject, message) => {
        return await model.post({action: 'sendContactEmail', name:name, email:email, subject:subject, message:message});
    }


    return {
        isLoading,

        register:registerUser,
        login:loginUser,
        logout,

        sendVerificationEmail,
        verifyEmailCode,

        sendInvitationEmail,
        acceptInvitation,

        checkLoggedStatus,
        checkEmailVerified,

        sendPasswordChangeEmail,
        verifyPasswordChangeRequest,
        changePassword,

        sendContactEmail,

        token
    }
}