import { useState } from "react";
import FormInput from "../FormInput/FormInput";
import "./InviteForm.css";
import useAuth from "../../../models/useAuth";
import { useUserContext } from "../../../contexts/UserContext/UserContext";

export default function InviteForm({ roomInfo }) {
    const { sendInvitationEmail } = useAuth();
    const { userInfo } = useUserContext();

    const [ formData, setFormData ] = useState({
        email: '',
    });
    const [ validationErrors, setValidationErrors ] = useState({...formData});

    const handleChange = (event) => {
        console.log("change", event.target.name, event.target.value);
        const field = event.target;
        setFormData({...formData, [field.name]: field.value});
        setValidationErrors({...validationErrors, [field.name]: ''});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending invite");
        let valErrors = validateData();
        if (Object.keys(valErrors).length > 0) {
            setValidationErrors(valErrors);
            return;
        }
        sendInvitationEmail(userInfo, formData.email, roomInfo);
    }

    const validateData = () => {
        let errors = {};
        if (formData.email === '') {
            errors.email = 'This field is required';
        } else if (!formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            errors.email = 'Invalid email address format';
        }
        return errors;
    }


    return (
        <form id='InviteForm' onSubmit={(e) => {handleSubmit(e)}}>
            <FormInput label='Email' name='email' type="email" placeholder="Enter user's email" onChange={handleChange} value={formData.email}></FormInput>
        </form>
    );
}