import useFetch from "./useFetch";

export default function useUser(token) {
    const {isLoading, model, requestResource, ENDPOINT_URL} = useFetch('user.php', token);

    const getUserInfo = async(userData) => {
        let result = await model.get({email: userData.email});
        return result;
    }
    const isEmailTaken = async (email) => {
        let result = await model.get({action: 'isEmailTaken', email:email});
        return result;
    }
    const updateUser = async (userInfo) => {
        let result = await model.put(userInfo);
        return result;
    }

    const changePassword = async (userinfo, oldPassword, newPassword) => {
        let result = await model.put({action: 'changePassword', ...userinfo, oldPassword:oldPassword, newPassword:newPassword});
        return result;
    }

    const changeProfilePicture = async (formData) => {
        formData.append('action', 'changeProfilePicture');
        let response = await requestResource('POST', formData, token, 'application/x-www-form-urlencoded');
        return response;
    }

    const deleteAccount = async (userInfo) => {
        let result = await model.delete({user:userInfo});
        return result;
    }

    return {isLoading, model: { getUserInfo, updateUser, isEmailTaken, changeProfilePicture, changePassword, deleteAccount}}
}