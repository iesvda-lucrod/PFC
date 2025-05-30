import "./EmailVerificationPage.css";
import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";


export default function EmailVerificationPage() {
    const { isLoading, verifyEmailCode } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [ verificationResult, setVerificationResult ] = useState(false);
    const [ verificationMessage, setVerificationMessage ] = useState('');
  
    const email = queryParams.get('email');
    const code = queryParams.get('code');

    useEffect(() => {
        (async () => {
            let response = await verifyEmailCode(email, code);
            setVerificationResult(response.valid);

            if (!response.valid) setVerificationMessage(response.errors.code);
            else setVerificationMessage(response.data.code);
        })()
    },[]);


    return (
        <div className="EmailVerificationPage page">
            <div className="dataContainer">
            {
                !isLoading ? 
                (
                <>
                    <h1>{verificationResult ? 'Email verified successfully!' : 'Verification failed, try again'}</h1>
                    <p><b>{verificationMessage}</b></p>
                    <button onClick={() => navigate('/profile')}>Back to profile</button>
                </>
                ) : (
                <>
                    <h1>Verifying email...</h1>
                    <div className="spinnerContainer">
                        <LoadingSpinner />
                    </div>
                </>
                )
            }
            </div>
        </div>
    );
}