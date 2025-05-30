import { useEffect, useState } from "react";
import useAuth from "../../../models/useAuth";
import "./ForgotPasswordPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import FormInput from "../../components/FormInput/FormInput";

export default function ForgotPasswordPage() {
    const { isLoading, verifyPasswordChangeRequest, changePassword } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        password:'',
        confirmPassword:'',
    });
    const [ validationErrors, setValidationErrors ] = useState({...formData});

    const queryParams = new URLSearchParams(location.search);
    const [ verificationResult, setVerificationResult ] = useState(false);
    const [ verificationError, setVerificationError ] = useState({});
    const [ passwordChanged, setPasswordChanged ] = useState(false);
  
    const userId = queryParams.get('user');
    const code = queryParams.get('code');

    useEffect(() => {
        (async () => {
            let response = await verifyPasswordChangeRequest(userId, code);
            if (!response.valid) {setVerificationError(response.errors)}
            setVerificationResult(response.valid);
        })()
    },[]);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]:e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submitted");
        let errors = validateForm();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        
        let response = await changePassword(formData.password, code);
        
        
        if (!response.valid) {setValidationErrors({...response.errors}); return;};

        setPasswordChanged(true);
    }
    const validateForm = () => {
        let errors = {};
        if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$/)) errors.password = 'Password must be at least 8 characters long and include letters, numbers and symbols';
        if (formData.password != formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        return errors;
    }


    return (
        <div className="ForgotPasswordPage page">
            <div className="dataContainer">
            {
                isLoading ? (
                <LoadingSpinner />
                ) : (
                    verificationResult ? (
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <FormInput label={'New password'} name={'password'} placeholder="Enter your new password" type="password"
                            onChange={(e) => handleChange(e)}
                            value={formData.password}
                            validationErrorMessage={validationErrors.password}
                            ></FormInput>

                            <FormInput label={'Confirm password'} name={'confirmPassword'} placeholder="Enter again your new password" type="password"
                            onChange={(e) => handleChange(e)}
                            value={formData.confirmPassword}
                            validationErrorMessage={validationErrors.confirmPassword}
                            ></FormInput>

                            <button type="submit">Change password</button>
                            {
                            passwordChanged && <span className="successMessage">Password changed successfully!</span>
                            }
                            <button onClick={() => {navigate('/auth')}}>Back to login</button>

                        </form>
                        
                    ) : (
                        <p>Verification failed: {verificationError.code}</p>
                    )
                )

            }
            </div>
        </div>
    );
}