import DatabaseModel, { useDatabase } from "./DatabaseModel";

export default class RoomModel extends DatabaseModel{
    constructor() {
        super('room.php');
    };

    async getUserRooms(userId) {
        return await this.get({action: 'getUserRooms', user_id: userId});
    }

    async createSection(data) {
        return await this.post({action: 'createSection', data});
    }
}

export function useRoom() {
    const model = useDatabase('room.php');

    const getUserRooms = async () => {
        model.get({action: 'getUserRooms'});
    }
    const getRoomUsers = async () => {
        model.get({action: 'getRoomUsers'});
    }

    const createSection = async () => {
        model.post({action: 'createSection'});
    }
}