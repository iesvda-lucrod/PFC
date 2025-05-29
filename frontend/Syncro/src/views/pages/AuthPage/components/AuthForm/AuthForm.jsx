import "./AuthForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../models/useAuth";
import { useUserContext } from "../../../../../contexts/UserContext/UserContext";
import FormInput from "../../../../components/FormInput/FormInput";
import ForgotPassword from "../../../../components/ForgotPassword/ForgotPassword";

export default function AuthForm() {
    const { userInfo, saveUserInContext } = useUserContext();
    const { register, login } = useAuth();
    let navigate = useNavigate();

    const [ isRegistering, setIsRegistering ] = useState(false);
    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [ validationErrors, setValidationErrors ] = useState({...formData});

    const handleChange = (event) => {
        const field = event.target;
        setFormData({...formData, [field.name]: field.value});
        setValidationErrors({...validationErrors, [field.name]: ''});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        {isRegistering ? registerUser() : loginUser()}
    }
    const validateData = () => {
        let errors = {};

        if (formData.email === '') {
            errors.email = 'This field is required';
        } else if (!formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            errors.email = 'Invalid email address format';
        }

        if (formData.password === '') {
            errors.password = 'This field is required';
        }
        return errors;
    }
    const validateRegisterData = () => {
        let errors = validateData();

        if (!formData.password.match(/^(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$/)) {
            errors.password = 'Minimum 8 characters, a letter, a number and a symbol';
        }
        
        if (formData.confirmPassword === '') {
            errors.confirmPassword = 'This field is required';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.username === '' ) {
            errors.username = 'This field is required';
        } else if (!formData.username.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)) {
            errors.username = 'Username only accepts letters and spaces';
        }
        return errors;
    }

    const registerUser = async () => {
        console.log("fd", formData);
        let valErrors = validateRegisterData();
        if (Object.keys(valErrors).length > 0) {
            setValidationErrors(valErrors);
            return;
        }

        console.log("Registering user...");
        let response = await register({email:formData.email, password:formData.password, username:formData.username});
        if (!response.valid) {
            setValidationErrors({...validationErrors, ...response.errors});
            return;
        }
        loginUser();
    }
    const loginUser = async () => {
        let valErrors = validateData();
        if (Object.keys(valErrors).length > 0) {
            setValidationErrors(valErrors);
            return;
        }

        console.log("Logging in...");
        let response = await login({email: formData.email, password: formData.password});
        if (!response.valid) {
            setValidationErrors({...validationErrors, ...response.errors});
            return;
        }

        
        const userData = {...userInfo, ...response.data.user, JWT:response.data.JWT}
        saveUserInContext(userData);
        navigate('/dashboard');
    };


    return (
        <div className="AuthForm">
            <h2>{isRegistering ? "Register" : "Log in"}</h2>

            <form onSubmit={(e) => {handleSubmit(e)}}>

                <FormInput label="Email" name="email" type="text" placeholder="Enter email" onChange={(e) => handleChange(e)} validationErrorMessage={validationErrors.email}/>
                <FormInput label="Password" name="password" type="password" placeholder="Enter password" onChange={(e) => handleChange(e)} validationErrorMessage={validationErrors.password}/>

                {isRegistering && 
                <>
                <FormInput label='Confirm password' name="confirmPassword" type="password" placeholder="Confirm password" onChange={(e) => handleChange(e)} validationErrorMessage={validationErrors.confirmPassword}/>
                <FormInput label='Username' name="username" type="text" placeholder="Choose username" onChange={(e) => handleChange(e)} validationErrorMessage={validationErrors.username}/>
                </>
                }
                
                <button type="submit">{isRegistering ? 'Register' : 'Log in'}</button>
            </form>
                <hr/>
            <div className="additionalActions">
                <ForgotPassword />
                <button onClick={() => {setValidationErrors({email: '', password: '', confirmPassword: '', username: ''});setIsRegistering(!isRegistering)}}>{isRegistering ? "Already have an account?" : "Don't have an account yet?"}</button>
            </div>
        </div>
    );
}