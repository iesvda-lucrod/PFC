import { useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";

export default function AuthForm() {
    const userModel = new UserModel();
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

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const handleSubmit = (event) => {
        event.preventDefault();
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

    const loginUser = () => {
        console.log("logging user");
        let valErrors = validateData();
        if (Object.keys(valErrors).length > 0) {
            setValidationErrors(valErrors);
        } else {

        } 
    };
    const registerUser = async () => {
        console.log("registering user");
        let valErrors = validateRegisterData();
        if (Object.keys(valErrors).length > 0) {
            setValidationErrors(valErrors);
        } else {
            let requestPayload = {...formData}; delete requestPayload.confirmPassword;
            let result = await userModel.post(requestPayload);
            
            console.log("request result:", result);
            if (!result.valid) {
                setValidationErrors({...validationErrors, email: result.cause});
            }
        }
    };

    return (
        <div>
            <form onSubmit={() => {handleSubmit(event)}}>
                <div className="inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="text" placeholder="Enter email" onChange={() => {handleChange(event)}}/>
                    <span className="errorMessage">{validationErrors.email}</span>
                </div>

                <div className="inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" placeholder="Enter pass" onChange={() => {handleChange(event)}}/>
                    <span className="errorMessage">{validationErrors.password}</span>
                    </div>

                {isRegistering ? (
                <>
                <div className="inputGroup">
                    <label htmlFor="confirmPassword">Confirm password:</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" onChange={() => {handleChange(event)}}/>
                    <span className="errorMessage">{validationErrors.confirmPassword}</span>
                </div>
                <div className="inputGroup">
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" type="text" placeholder="Choose username" onChange={() => {handleChange(event)}}/>
                    <span className="errorMessage">{validationErrors.username}</span>
                </div>
                </>
                ) : <></>}
                <button type="submit"></button>
            </form>

            <button onClick={() => {setIsRegistering(!isRegistering)}}>{isRegistering ? 'Already have an account?':"Don't have an account yet?"}</button>
            
        </div>
    );
}