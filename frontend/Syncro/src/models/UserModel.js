import MainModel from "./MainModel";

export default class UserModel extends MainModel {
    userData;
    constructor() {
        super('users');
    }

    getUsernameFromEmail() {}

    /**
     * Returns all ROOMS that belong to a USER identified by its id
     * @param {*} userId 
     */
    getUserRooms(userId) {
        this.table = 'users_rooms';
        this.getById(userId);
        this.table = 'users';
    }
}