import ControllerTemplate from "./ControllerTemplate";
import RoomModel from "../models/RoomModel";

export default class RoomController extends ControllerTemplate {
    constructor() {
        super();
        this.model = new RoomModel();
    }

    execute(action, data) {

        switch (action) {
            case 'createRoom':
                
                break;
            default:
                this.default(action, data);
                break;
        }
    }
}