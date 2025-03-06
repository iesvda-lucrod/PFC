import UserModel from "../models/UserModel";
import ControllerTemplate from "./ControllerTemplate";

//TODO securely send password to server (SSL domain lets encrypt)
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
                result = this.validateLoginFormat(data);
                if (!result.valid) return result;

                try {
                    result = await this.checkDuplicates(data);
                    if (!result.valid) return result;

                    //TODO SEND VERIFICATION EMAIL locked out for 24h lol

                    let insertResult = await this.model.insert(data); //This either works or triggers try-catch
                    console.log("INSERT RESULT:",insertResult); //This should always log 1
                    //result = await this.registerNewUser(data);
                    //if (!result.valid) return result;

                    return result; //Valid: true
                } catch (e) {
                    console.log(e);
                    return {valid: false, server: 'There was a communication error with the server, please try again later'}
                }
                break;
            case 'login':
                result = this.validateLoginFormat(data);
                if (!result.valid) return result;

                try {
                    //TODO this is not secure
                    result = this.checkCredentials(data);
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

    async checkDuplicates(formData) {
        let result = {valid: true};
        let duplicates = await this.model.getByField({email: formData.email});
        if (duplicates.length > 0) {
            result.valid = false;
            result.email = 'This email is already in use';
        }
        return result;
    }
    async checkCredentials(formData) {
        let result = {valid: true};
        let credentials = await this.model.getByField({email: formData.email});
        if (formData.email === credentials.email ) {
            result.valid = false;
            result.email = 'This email is not registered';
        }
        if (formData.password === credentials.password) {
            result.valid = false;
            result.password = 'The password is incorrect';
        }
        return result;
    }

    //TODO this is not used
    async registerNewUser(formData) { 
        let result = {valid: true};
        if (!await this.model.insert(formData)){
            result.valid = false;
            result.server = 'Server error'; //Try catch behaviour
        }
        return result;
    }

    
}