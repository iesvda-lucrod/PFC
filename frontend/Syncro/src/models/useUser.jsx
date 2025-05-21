import useDatabase from "./useDatabase";

export default function useUser(token) {
    const {isLoading, model} = useDatabase('user.php', token);

    const getUserInfo = async(userData) => {
        let result = await model.get({email: userData.email});
        return result;
    }

    return {isLoading, model: { getUserInfo }}
}