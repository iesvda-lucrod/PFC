import { useEffect, useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import "./ContactPage.css";
import useAuth from "../../../models/useAuth";
import { useUserContext } from "../../../contexts/UserContext/UserContext";
import { Icon_arrow_left } from "../../../assets/icons";


export default function ContactPage() {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [ errors, setErrors ] = useState({...formData});
    const { isLoading, sendContactEmail, checkLoggedStatus } = useAuth();
    const [ emailSent, setEmailSent ] = useState(false);
    const { userInfo } =  useUserContext();

    useEffect(() => {

        const autoComplete = () => {
            if (userInfo) {
                formData.name = userInfo.username;
                formData.email = userInfo.email;
            }
        }

        (async () => {
            console.log("Checking user logged status...");
            if ((await checkLoggedStatus())) autoComplete();
        })();
    },[]);

    const validate = () => {
        let errors = {};

        if (formData.name === '' ) {
            errors.name = 'This field is required';
        } else if (!formData.name.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)) {
            errors.name = 'Username only accepts letters and spaces';
        }

        if (formData.email === '') {
            errors.email = 'This field is required';
        } else if (!formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            errors.email = 'Invalid email address format';
        }

        if (formData.subject === '') {
            errors.subject = 'This field is required';
        }
        if (formData.message === '') {
            errors.message = 'This field is required';
        }
        return errors;
    }

    const handleChange = (event) => {
        const field = event.target;
        setFormData({...formData, [field.name]: field.value});
        setErrors({...errors, [field.name]: ''});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const response = await sendContactEmail(formData.name, formData.email, formData.subject, formData.message);
        if (!response.valid) {setErrors({...errors, ...response.data});return;}
        setEmailSent(true);
    }


    return (
        <div className="ContactPage page">
            {!userInfo && 
                <Link ><Icon_arrow_left/> back to homepage</Link>
            }

            <div className="contactFormContainer">
                <form action="" className="contactForm" onSubmit={(e) => handleSubmit(e)}>
                    <h2>Contact</h2>

                    <div className="formContent">

                        <FormInput label={'Name'} name={'subject'} type="text" placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleChange(e)}
                        validationErrorMessage={errors.name}
                        />

                        <FormInput label={'Email'} name={'email'} type="email" placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleChange(e)}
                        validationErrorMessage={errors.email}
                        />

                        <FormInput label={'Subject'} name={'subject'} type="text" placeholder="Why are you contacting us?"
                        value={formData.subject}
                        onChange={(e) => handleChange(e)}
                        validationErrorMessage={errors.subject}
                        />

                        <div className="FormInput">
                            <div className='inputContainer'>
                                <label htmlFor='message'>Message:</label>
                                <textarea id='message' name='message'
                                placeholder="Explain in detail the reason for contact"
                                value={formData.message} 
                                onChange={(e) => handleChange(e)}/>
                            </div>
                            <span className="errorMessage"> {errors.message}</span>
                        </div>
                    </div>

                    <button type="submit">Send email</button>
                    
                    <span className="errorMessage">{errors.server}</span>
                    <span className="successMessage">{emailSent && 'Email sent!'}</span>
                </form>
            </div>
        </div>
    );
}