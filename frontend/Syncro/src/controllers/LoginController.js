import UserModel from "../models/UserModel";
import ControllerTemplate from "./ControllerTemplate";




/**
 * //TODO change login method:
 *      -User fills form and sends data to server
 *      -Server verifies data and sends a (JWT) token to user
 *      -Token is stored in session to identify user
 *      -Token is used in server data requests to verify access
 * This means we have to change the login methodology
 * and just add a token check in the backend
 */
export default class LoginController extends ControllerTemplate{
    
    constructor() {
        super();
        this.model = new UserModel();
    }

    async execute(action, data) {
        console.log("executing:", action, 'with data', data);
        let result;
        switch(action) {
            case 'register':
                console.log("ACTION REGISTER");

                result = this.validateLoginFormat(data);
                if (!result.valid) return result;
                console.log('result post format:', result);

                try {
                    result = await this.checkDuplicates(data);
                    if (!result.valid) return result;
                    console.log('result post duplicate check:', result);


                    //TODO SEND VERIFICATION EMAIL locked out for 24h lol

                    let insertResult = await this.model.insert(data); //This either works or triggers try-catch
                    console.log("INSERT RESULT:",insertResult); //This should always log 1
                    //result = await this.registerNewUser(data);
                    //if (!result.valid) return result;

                    //return result; //Valid: true
                    result = this.execute('login', data);
                    return result;
                } catch (e) {
                    console.log(e);
                    return {valid: false, server: 'There was a communication error with the server, please try again later'}
                }
                break;
            case 'login':
                console.log("ACTION LOGIN");
                result = this.validateLoginFormat(data);
                if (!result.valid) return result;
                console.log('result post format:', result);


                try {
                    //TODO this is not secure
                    result = await this.checkCredentials(data);
                    console.log('result post check :', result);
                    return result;
                }
                catch (e) {
                    console.log(e);
                    return {valid: false, server: 'There was a communication error with the server, please try again later'}
                }
                break;
            default:
                this.default(action, data);
                break;
        }
    }

    validateLoginFormat(formData) {
        console.log("VALIDATING", formData);
        let result = {valid: true}
        
        const email = formData.email;
        const password = formData.password;

        if (!email) {
            result.valid = false;
            result.email = 'This field is required';
        } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            result.valid = false;
            result.email = 'Invalid email format';
        }

        if (!password) {
            result.valid = false;
            result.password = 'This field is required';
        }

        if (formData.confirmPassword !== undefined) {
            const confirmPassword = formData.confirmPassword;
            if (!confirmPassword) {
                result.valid = false;
                result.confirmPassword = 'This field is required';
            } else if (confirmPassword !== password) {
                result.valid = false;
                result.confirmPassword = 'Passwords do not match';
            }
        }

        if (formData.username !== null) {
            const username = formData.username;
            if (!username) {
                result.valid = false;
                result.username = 'This field is required';
            }else if (!username.match(/^[\p{L} ]+$/u)) {
                result.valid = false;
                result.username = 'Only letters and spaces allowed in the username';
            }
        }
        console.log("VALIDATION RESULT:", result);
        return result;
    }

    /**
     * Gets a user from the database filtering by email
     * @param {*} formData 
     * @returns The user data or null if not found
     */
    async getUser(formData) {
        let result = await this.model.getByField({email: formData.email});
        if (result.length === 0) {return null;}
        if (result.length > 1) { //TODO
            console.error('Multiple accounts have been found, this shouldnt ever happen');
            return null;
        }
        return result[0];
        //return result.length > 0 ? result : null;
    }

    async checkDuplicates(formData) {
        let result = {valid: true};
        let duplicates = await this.getUser(formData);
        if (duplicates !== null) {
            result.valid = false;
            result.email = 'This email is already in use';
        }
        return result;
    }
    async checkCredentials(formData) {
        let result = {valid: true};
        let credentials = await this.getUser(formData);
        if (credentials === null) {
            result.valid = false;
            result.email = 'This email is not registered';
        } else if (formData.password !== credentials.password) {
            result.valid = false;
            result.password = 'The password is incorrect';
        }
        console.log("credential check result:", result);
        return result;
    }
}