import "./AuthPage.css";
import { useEffect } from "react";
import AuthForm from "./components/AuthForm/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../models/useAuth";
import { Icon_arrow_back } from "../../../assets/icons";

export default function AuthPage() {
    const { checkLoggedStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {if ((await checkLoggedStatus())) navigate('/dashboard');})();
    }, [checkLoggedStatus, navigate]);

    return (
        <div className="AuthPage page">
            <Link className="backLink" to={"/"}><Icon_arrow_back/> back to homepage</Link>                        
            <AuthForm></AuthForm>
        </div>
    );
}