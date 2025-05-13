import "./ProfileForm.css"
import { useState } from 'react';
import FormInput from '../../../../components/FormInput/FormInput';
import useAuth from "../../../../../models/useAuth";

export default function ProfileForm({ userData, editMode }) {
    const [ formData, setFormData ] = useState({

    });
    const [ validationErrors, setValidationErrors ] = useState({
        username: '',
        email: '',
    });
    const { sendVerificationEmail } = useAuth();

    const handleChange = (event) => {
        const field = event.target;
        setFormData({...formData, [field.name]: field.value});
        setValidationErrors({...validationErrors, [field.name]: ''});
    }

    const sendVerification = () => {
        console.log("verification email sent");
        sendVerificationEmail(userData);
    }

    return (
        <div className="ProfileForm">
            { editMode ? 
                <form action="">
                    <FormInput name={'Username'} type='text' placeholder='Username' value={userData.username} onChange={(e) => handleChange(e)} validationErrorMessage={validationErrors.username}/>
                    <FormInput name={'Email'} type='email' placeholder='Email' value={userData.email} onChange={(e) => handleChange(e)}  validationErrorMessage={validationErrors.email}/>
                </form>
                :
                <div className='userInformation'>
                    <p><b>Username:</b> {userData.username}</p>
                    <p><b>Email:</b> {userData.email}</p>
                    { !(userData.verified) && 
                        <div>
                            <p>Your email is not verified, with an unverified email you won't be able to be invited to rooms</p>
                            <button onClick={sendVerification}>Send verification email</button>
                            <span>Email sent!</span>
                        </div>
                    }
                </div>
            }
            
        </div>
    );
}