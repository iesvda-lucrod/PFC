import { useEffect, useContext } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

export default function AuthPage() {
    console.log('inauth');
    const { userInfo, isLogged } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('inauthEFF',isLogged);

        if (isLogged) {
            console.log('redirecting cause: ', userInfo.id);
            navigate('/dashboard');
        }
    }, [isLogged]);
    
    return (
        <div className="AuthPage">
            <AuthForm></AuthForm>
        </div>
    );
}