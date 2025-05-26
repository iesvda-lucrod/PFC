import "./AuthPage.css";
import { useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../models/useAuth";

export default function AuthPage() {
    const { checkLoggedStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {if ((await checkLoggedStatus())) navigate('/dashboard');})();
    }, [checkLoggedStatus, navigate]);

    return (
        <div className="AuthPage page">
            <AuthForm></AuthForm>
        </div>
    );
}