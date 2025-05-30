import "./RoomInvitationPage.css";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../../models/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";


export default function RoomInvitationPage() {
    const { isLoading, token, acceptInvitation } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [ invitationResult, setInvitationResult ] = useState(false);
    const [ invitationError, setInvitationError ] = useState('');
  
    const userId = queryParams.get('user');
    const roomId = queryParams.get('room');
    const code = queryParams.get('code');

    const didRun = useRef(false);
    useEffect(() => {

        const triggerInvitation = async () => {
            setInvitationResult(false);
            setInvitationError('');
            let response = await acceptInvitation(userId, roomId, code);
            setInvitationResult(response.valid);
            if (!response.valid) setInvitationError(response.errors.invitation);
        }

        if (!didRun.current) //React safe dev is running the call twice, this prevents it
            triggerInvitation();

        didRun.current = true;
    },[]);


    return (
         <div className="RoomInvitationPage page">
            <div className="dataContainer">
            {
                !isLoading ? 
                (
                <>
                    {invitationResult ? (
                    <>
                        <h1>Invitation accepted!</h1>
                        <button onClick={() => navigate('/dashboard/'+roomId)}>Enter the room</button>
                    </>
                    ) : (
                    <>
                        <h1>The invitation failed</h1>
                        <p><b>{invitationError}</b></p>
                        <button onClick={() => navigate('/dashboard')}>Back to dashboard</button>
                    </>
                    )}
                    
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