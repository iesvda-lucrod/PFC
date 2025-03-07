import ControllerTemplate from "./ControllerTemplate";
import UserModel from "../models/UserModel";
import RoomModel from "../models/RoomModel";

export default class UserDataController extends ControllerTemplate{
    
    constructor() {
        super();
        this.userModel = new UserModel();
        this.roomModel = new RoomModel();
    }

    async execute(action, data) {

        let result;
        switch (action) {
            case "getUserInfo":
                console.log("Fetching user's info");
                
                //TODO check session for data
                

                
                break;
            default:
                this.default(action, data);
                break;
        }
    }
}