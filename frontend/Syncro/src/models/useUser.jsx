import useDatabase from "./useDatabase";

export function useUser() {
    const model = useDatabase('user.php');

    const getUserRooms = async (user_id) => {
        return await model.get({action: 'getUserRooms', user_id});
    }

    return {getUserRooms, ...model}
}