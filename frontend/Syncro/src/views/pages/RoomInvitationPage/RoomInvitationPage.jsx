import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";


export default function RoomInvitationPage() {
    const { isLoading, token, acceptInvitation } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [ invitationResult, setInvitationResult ] = useState(false);
  
    const userId = queryParams.get('user');
    const roomId = queryParams.get('room');
    const code = queryParams.get('code');

    useEffect(() => {
        (async () => {
            let response = await acceptInvitation(userId, roomId, code);
            setInvitationResult(response.valid);
        })()
    },[]);


    return (
        <div className="RoomInvitationPage">
            <div>
            {
                isLoading ? (
                    <LoadingSpinner />
                ) : (
                    invitationResult ? (
                        //navigate('/dashboard/'+roomId)
                        console.log("SUCCEWSS")
                    ) : (
                        <p>Verification failed</p>
                    )
                )

            }
            </div>
        </div>
    );
}