import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useUserContext } from "../contexts/UserContext";
import LoginController from "../../controllers/LoginController";
import RoutingController from "../../controllers/RoutingController";

export default function LoginPage() {
    const loginController = new LoginController();
    const routingController = new RoutingController();
    const { user, setUser } = useUserContext();
    const [ newUser, setNewUser ] = useState(false);
    const [ formData, setFormData ] = useState(
        {
            email: null,
            password: null,
            confirmPassword: null,
            username: null,
        }
    );
    const [ validationErrors, setValidationErrors ] = useState({...formData});
    

    useEffect(() => {
        let newFormData = {...formData};
        newFormData.confirmPassword = null;
        newFormData.username= null;
        setFormData(newFormData)
    }, [newUser]);

    const handleChange = () => {
        let targetInput = event.target;
        let newFormData = {...formData};
        newFormData[targetInput.id] = targetInput.value;
        setFormData(newFormData);

        let newValidationErrors = {...validationErrors};
        newValidationErrors[targetInput.id] = null;
        setValidationErrors(newValidationErrors);
    }

    const handleSubmit = () => {
        
        let data = {...formData};
        delete data.confirmPassword;

        loginController.execute(newUser ? 'register': 'login', data)
        .then((response) => {
            console.log("IN PAGE:", response);
            if (!response.valid) {
                delete response.valid;
                setValidationErrors(response);
            }
            else {
                console.log("-----------Everything checks, setting data:", data)
                delete data.password;
                setUser(data); //Only email and username should remain
                routingController.execute('goto', '/');
            }
        });
    }
    
    return (
        <>
            <div className="loginContainer">
                <form>
                    <label htmlFor="Email">E-mail</label>
                    <input id="email" type="text" onChange={handleChange}></input>
                    <p>{validationErrors.email}</p>

                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={handleChange}></input>
                    <p>{validationErrors.password}</p>

                    { //New account registers need a username
                    newUser ? 
                    <>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input id="confirmPassword" type="password" onChange={handleChange}></input>
                    <p>{validationErrors.confirmPassword}</p>

                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" onChange={handleChange}></input>
                    <p>{validationErrors.username}</p>
                    </> :
                    <></>
                    }
                    <Button action={handleSubmit}>{newUser ? 'Register' : 'Login'}</Button>
                    <p>{validationErrors.server}</p>
                </form>

                <Button action={() => {setNewUser(!newUser)}}>{newUser ? 'Already got an account?' : 'Not registered yet?'}</Button>
                
            </div>
        </>
    );
}