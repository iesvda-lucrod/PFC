import "./ForgotPassword.css";
import { useState } from "react";
import Modal from "../Modal/Modal";
import FormInput from "../FormInput/FormInput";
import useAuth from "../../../models/useAuth";

export default function ForgotPassword ({ userEmail = '' }) { 
    const { isLoading, sendPasswordChangeEmail } = useAuth();
    const [ openModal, setOpenModal ] = useState(false);
    const [ formData, setFormData ] = useState({
        email: userEmail,
    });
    const [ validationErrors, setValidationErrors ] = useState({});
    const [ emailSent, setEmailSent ] = useState(false);

    const handleChange = (e) => {
        setValidationErrors(prev => ({...prev, [e.target.name]:''}));
        setFormData(prev => ({...prev, [e.target.name]:e.target.value}));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = await sendPasswordChangeEmail(formData.email);

        if (!response.valid) {setValidationErrors(prev => ({...prev, ...response.errors})); return;}

        setEmailSent(true);
    }

    return (
        <div>
            <p className="link" onClick={() => setOpenModal(true)}>Forgot your password?</p>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)} >
                <form onSubmit={handleSubmit}>
                    <FormInput label={'Email'} name={'email'} type="email" placeholder="Enter your account's email"
                    value={formData.email}
                    onChange={handleChange}
                    validationErrorMessage={validationErrors.email}
                    />
                    <button type="submit">Send email</button>
                </form>
                { emailSent && <span className="successMessage">Email sent</span> }
            </Modal>
        </div>
    );
}
