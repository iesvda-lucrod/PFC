import UserModel from "../models/UserModel";
import { createContext } from "react";

export default class ControllerTemplate {
    
    model = null;
    constructor() {
    }

    //Need to define a switch for routing action
    execute(action, data) {
        throw new Error('message receiver switch must be implemented');

        //Function template (remove error above when copying)
        switch (action) {
            //Cases here
            default:
                this.default(action, data);
                break;
        }
    }

    //Unified default error case
    default(action, data) {
        console.err('action not defined:', action, '\n  with associated data:', data);
    }

    //Define controller functionality
}