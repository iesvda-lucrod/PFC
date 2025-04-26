import { useEffect, useContext } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

export default function AuthPage() {
    console.log('inauth');
    const { isLogged } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogged) {
            console.log('User is already logged, redirecting...');
            navigate('/dashboard');
        }
    }, [isLogged]);
    
    return (
        <div className="AuthPage">
            <AuthForm></AuthForm>
        </div>
    );
}