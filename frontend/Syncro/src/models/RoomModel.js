import MainModel from "./MainModel";

export default class UserModel extends MainModel {
    userData;
    constructor() {
        super('rooms');
    }

    /**
     * Returns all USERS that belong to a ROOM identified by its id
     * @param {*} roomId 
     */
    getRoomUsers(roomId) {
        this.table = 'users_rooms';
        this.getById(roomId);
        this.table = 'rooms';
    }
}