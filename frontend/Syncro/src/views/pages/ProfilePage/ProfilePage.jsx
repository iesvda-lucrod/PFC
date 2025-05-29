import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContext/UserContext";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../../models/useAuth";
import useUser from "../../../models/useUser";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./ProfilePage.css";
import EditableField from "./components/EditableField/EditableField";
import Modal from "../../components/Modal/Modal";
import FormInput from "../../components/FormInput/FormInput";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import { PROFILE_PICTURES_DIRECTORY } from "../../../models/globalVariables";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import { Icon_edit } from "../../../assets/icons";

export default function ProfilePage() {
    const { token, isLoading:isLoadingAuth, checkLoggedStatus, sendVerificationEmail,  checkEmailVerified, logout} = useAuth();
    const { model:userModel } = useUser(token);

    const { userInfo, saveUserInContext, removeUserFromContext } = useUserContext();
    const [ fullUserInfo, setFullUserInfo ] = useState(null);

    const fileInput = useRef(null);
    const [ selectedImage, setSelectedImage ] = useState(null);
    const [ openPFPModal, setOpenPFPModal ] = useState(false);

    const [ editingInfo, setEditingInfo ] = useState(false);
    const [ editingEmail, setEditingEmail ] = useState(false);
    const [ validationErrors, setValidationErrors ] = useState({});

    const [ openPasswordModal, setOpenPasswordModal ] = useState(false);
    const [ oldPassword, setOldPassword ] = useState(''); 
    const [ newPassword, setNewPassword ] = useState('');
    const [ passwordChanged, setPasswordChanged ] = useState(false);

    const [ openConfirmDeleteModal, setOpenConfirmDeleteModal ] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {

        const loadUserInfo = async () => {
            const response = await userModel.getUserInfo(userInfo);
            const isVerified = await checkEmailVerified(userInfo.email);
            console.log("userdata fetched: ", response.data)
            setFullUserInfo({...response.data, verified: isVerified});
        }

        (async () => {
            console.log("Checking user logged status...");
            if (!(await checkLoggedStatus())) {
                removeUserFromContext();
                navigate('/auth');
            }
            else loadUserInfo();
        })();
    }, []);

    const updateUser = async(newUserInfo) => {
        const response = await userModel.updateUser(newUserInfo);
        if (!response.valid) {setValidationErrors({...validationErrors, server:'There was a problem with the server, please try again later'}); return;}

        setFullUserInfo({...fullUserInfo, ...newUserInfo});
    }

    const updateUsername = (newValue) => {
        setValidationErrors({...validationErrors, username:''});
        if (newValue === '') {setValidationErrors({...validationErrors, username:'This field is required'}); return;}
        else if (!newValue.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)) {setValidationErrors({...validationErrors, username:'Username only accepts letters and spaces'}); return;}
        
        updateUser({...fullUserInfo, username:newValue});
        setEditingInfo(false);
    }
    const updateEmail = async (newValue) => {
        console.log("newValue,", newValue);
        setValidationErrors({...validationErrors, email:''});
        if (newValue === '') {setValidationErrors({...validationErrors, email:'This field is required'}); return;}
        else if (!newValue.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setValidationErrors({...validationErrors, email:'Invalid email format'}); return; 
        }
        
        console.log("hello");
        let response = await userModel.isEmailTaken(newValue);
        if (response.data.result) {setValidationErrors({...validationErrors, email:'This email is not available'}); return;}
        console.log("gbye");

        updateUser({...fullUserInfo, email:newValue});
        setEditingEmail(false);
    }
    const updatePassword = async (e) => {
        e.preventDefault();
        setPasswordChanged(false);
        let response = await userModel.changePassword(fullUserInfo, oldPassword, newPassword);

        if (!response.valid) {
            setValidationErrors({...validationErrors, ...response.errors});
            return;
        }

        setPasswordChanged(true);
    }

    const deleteAccount = async () => {
        const response = await userModel.deleteAccount(userInfo);
        if (!response.valid) {console.error("There was a problem deleting the account");} 
        removeUserFromContext();
        logout();
        navigate('/');
    }

    const handlePFPChange = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', selectedImage);
        formData.append('userInfo', JSON.stringify(fullUserInfo));

        console.log("SENDING", formData);

        let response = await userModel.changeProfilePicture(formData);
        if (!response.valid) {console.error("teher was a problem uploading the image");}

        setFullUserInfo(prev => ({...prev, profile_picture:response.data.profile_picture}));
        console.log("   ENW USER INFO ", {fullUserInfo, profile_picture:response.data.profile_picture});
        saveUserInContext(fullUserInfo);
    }

    return (
        <div className="ProfilePage page">
            <div className="ProfileCard">
            {
                fullUserInfo ? 
                <>
                    <div className="cardHeader">
                        <h2>Profile</h2>
                        <div className="profilePictureContainer" onClick={() => setOpenPFPModal(true)/*() => {fileInput.current.click()}*/}>
                            <ProfilePicture pictureName={fullUserInfo.profile_picture} />
    
                            <div className="editPicture">
                                <Icon_edit className="iconEdit"/>
                                {
                                    //<input name="upload" type="file" ref={fileInput} hidden onChange={(e) => setSelectedImage(e.target.files[0])} accept="image/png, image/jpg, image/jpeg"/>
                                }
                            </div>
                        </div>

                        <Modal isOpen={openPFPModal} onClose={() => setOpenPFPModal(false)}>
                            <form onSubmit={(e) => handlePFPChange(e)} encType="multipart/form-data">
                                <input type="file" name="profile_picture" onChange={(e) => setSelectedImage(e.target.files[0])}/>
                                <button type="submit">Change profile picture</button>
                            </form>

                        </Modal>
                    </div>

                    <div className="userInfo">
                        <div >
                            <EditableField 
                            label='Username' name='username' value={fullUserInfo.username}
                            editing={editingInfo} setEditing={setEditingInfo}
                            confirmAction={(newValue) => updateUsername(newValue)}>
                            </EditableField>
                            <span className="error">{validationErrors.username}</span>
                        </div>
                        <div >
                            <EditableField 
                            label='Email' name='email' value={fullUserInfo.email}
                            editing={editingEmail} setEditing={setEditingEmail}
                            confirmAction={(newValue) => updateEmail(newValue)} >
                            </EditableField>
                            <span>{validationErrors.email}</span>
                        </div>

                        {
                        !fullUserInfo.verified &&
                        <div className="emailNotVerifiedWarning">
                            <span>This email is not verified, email verification is needed for collaborative rooms</span>
                            <button onClick={() => sendVerificationEmail(fullUserInfo)}>Send verification email</button>
                        </div>
                        }
                    </div>

                    <button onClick={() => setOpenPasswordModal(true)}>Change password</button>
                    <Modal isOpen={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                        
                        <form onSubmit={(e) => updatePassword(e)}>
                            <FormInput label='Old password' name={'oldPassword'} type="password" placeholder="Enter old password..."
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            validationErrorMessage={validationErrors.oldPassword} />

                            <FormInput label='New password' name={'newPassword'} type="password" placeholder="Enter new password..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            validationErrorMessage={validationErrors.newPassword} />

                            <button type="submit">Change password</button>
                            {
                                passwordChanged && <span>Password changed successfully!</span>
                            }
                        </form>

                        <ForgotPassword></ForgotPassword>

                    </Modal>

                    <button onClick={() => setOpenConfirmDeleteModal(true)}>Delete account</button> 

                    <Modal isOpen={openConfirmDeleteModal} onClose={() => setOpenConfirmDeleteModal(false)}>
                        <p>Are you sure you want to delete your account?</p>
                        <p>This action is irreversible</p>
                        <button className="deleteButton" onClick={deleteAccount}>Delete account</button>
                    </Modal>

                </>
                :
                <LoadingSpinner />
            }
            </div>
        </div>
    );
}