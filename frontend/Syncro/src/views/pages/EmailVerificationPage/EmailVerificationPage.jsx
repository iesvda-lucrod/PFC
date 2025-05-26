import "./EmailVerificationPage.css";
import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";


export default function EmailVerificationPage() {
    const { isLoading, token, sendVerificationEmail, verifyEmailCode } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [ verificationResult, setVerificationResult ] = useState(false);
  
    const email = queryParams.get('email');
    const code = queryParams.get('code');

    useEffect(() => {
        (async () => {
            let response = await verifyEmailCode(email, code);
            setVerificationResult(response.valid);
        })()
    },[]);


    return (
        <div className="EmailVerificationPage">
            <div>
            {
                isLoading ? (
                <LoadingSpinner />
                ) : (
                    verificationResult ? (
                        <p>Email verified successfully!</p>
                    ) : (
                        <p>Verification failed</p>
                    )
                )

            }
            </div>
        </div>
    );
}