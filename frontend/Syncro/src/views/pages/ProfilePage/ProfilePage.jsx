import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext/UserContext";
import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import useUser from "../../../models/useUser";
import ProfileForm from "./components/ProfileForm/ProfileForm";

export default function ProfilePage() {
    const { token, checkLoggedStatus } = useAuth();
    const { model:userModel } = useUser(token);

    const { userInfo } = useUserContext();
    const [ fullUserInfo, setFullUserInfo ] = useState(null);
    const [ tempUserInfo, setTempUserInfo ] = useState({...fullUserInfo});

    const [ editMode, setEditMode ] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const loadUserInfo = async () => {
            const response = await userModel.getUserInfo(userInfo);
            setFullUserInfo(response.data);
        }

        (async () => {
            console.log("Checking user logged status...");
            if (!(await checkLoggedStatus())) navigate('/auth');
            else loadUserInfo();
        })();
    }, []);

    const applyChanges = () => {
        console.log("aaaa");
    }

    return (
        <div className="ProfilePage">
            <h3>Profile information</h3>
            {
                fullUserInfo && 
                <>
                <ProfileForm userData={fullUserInfo} editMode={editMode}></ProfileForm>
                {
                    editMode ?
                    <>
                    <button onClick={applyChanges}>Confirm changes</button>
                    <button onClick={() => setEditMode(false)}>Cancel changes</button>
                    </>
                    :
                    <button onClick={() => setEditMode(true)}>Edit</button>
                }
                </>
                
            }
        </div>
    );
}