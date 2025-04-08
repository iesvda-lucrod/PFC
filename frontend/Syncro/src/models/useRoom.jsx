import useDatabase  from "./useDatabase";

export default function useRoom() {
    const model = useDatabase('room.php');

    const getUserRooms = async () => {
        return await model.get({action: 'getUserRooms'});
    }

    const getRoomUsers = async () => {
        return await model.get({action: 'getRoomUsers'});
    }

    return {getUserRooms, getRoomUsers, ...model}
}