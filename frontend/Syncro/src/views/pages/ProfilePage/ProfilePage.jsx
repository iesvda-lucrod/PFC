import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext/UserContext";
import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import useUser from "../../../models/useUser";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import FormInput from "../../components/FormInput/FormInput";
import "./ProfilePage.css";

export default function ProfilePage() {
    const { token, isLoading:isLoadingAuth, checkLoggedStatus, sendVerificationEmail,  checkEmailVerified} = useAuth();
    const { model:userModel } = useUser(token);

    const { userInfo } = useUserContext();
    const [ fullUserInfo, setFullUserInfo ] = useState(null);
    const [ tempUserInfo, setTempUserInfo ] = useState(null);

    const [ editMode, setEditMode ] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const loadUserInfo = async () => {
            const response = await userModel.getUserInfo(userInfo);
            const isVerified = await checkEmailVerified(userInfo.email);
            console.log("userdata fetched: ", response.data)
            setFullUserInfo({...response.data, verified: isVerified});
            setTempUserInfo({...response.data, verified: isVerified});
        }

        (async () => {
            console.log("Checking user logged status...");
            if (!(await checkLoggedStatus())) navigate('/auth');
            else loadUserInfo();
        })();
    }, []);

    return (
        <div className="ProfilePage">
            <div className="ProfileCard">
            {
                fullUserInfo ? 
                <div>
                    <p>Username: {fullUserInfo.username}</p>
                    <p>Email: {fullUserInfo.email}</p>

                    {
                        !fullUserInfo.verified &&
                        <div className="emailNotVerifiedWarning">
                            <span>This email is not verified, email verification is needed for collaborative rooms</span>
                            <button>Send verification email</button>
                        </div>
                    }

                    <button>Change password</button>

                </div>
                :
                <LoadingSpinner /> 
            }
            </div>
        </div>
    );
}