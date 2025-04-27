import useDatabase  from "./useDatabase";
import Room from "../classes/Room";

export default function useRoom(token) {
    const {model, isLoading} = useDatabase('room.php', token);

    const getRoomInfo = async (roomId) => {
        return await model.get({id: roomId});
    }

    const getUserRooms = async (userId) => {
        return await model.get({action: 'getUserRooms', user_id: userId});
    }

    const getRoomUsers = async () => {
        return await model.get({action: 'getRoomUsers'});
    }

    const createRoom = async (userId, newRoom) => {
        if (!(newRoom instanceof Room)) throw new Error("The information must be sent as Room object");
        return await model.post({user_id:userId, room:newRoom});
    }

    const deleteRoom = async (room_id) => {
        return await model.delete({id: room_id});
    }

    const updateRoom = async (roomInfo) => {
        const payload = new Room(roomInfo);
        let result = await model.put(payload);
        return result;
    }

    return {isLoading, model:{getRoomInfo, getUserRooms, getRoomUsers, createRoom, deleteRoom, updateRoom}}
}