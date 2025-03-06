import MainModel from "./MainModel";

export default class UserModel extends MainModel {
    userData;
    constructor() {
        super('users');
        this.userData = {};
    }

    
}