import { api } from '@api/service/api_helper';
import { AdminSubscriptions, PostUserBalanceType, PostUsers } from '../Types/queryReturnTypes/Admin';

export const updateUser = async ({id, data}: {id:string, data: {userName:string,userEmail:string}}) => {
    return api.putPrivate({url: `user/update-user-data/${id}`, data, withCredentials: true})
}
export const updateSubscription = async (data: AdminSubscriptions) => {
    return api.putPrivate({url: 'admin/change-subscription', data, withCredentials:true})
}
export const uploadUsrAvatar = async (formData: FormData,userGuid:string) => {
    return api.postPrivate({
        url: `user/user-avatar-upload?user_guid=${userGuid}`, 
        data: formData, contentType: 'multipart/form-data', 
        withCredentials: true})
}
export const assignUsersToFirm = async (data: PostUsers):Promise<string> => {
    return api.postPrivate({url: 'admin/assign-users-to-firms', data, withCredentials: true})
}
export const unsetFromFirm = async (userGuids: string[], backendGuid:string) => {
    return api.deletePrivate({url: `admin/remove-assigned-users?user_guids=${userGuids}&backend_guid=${backendGuid}`, withCredentials:true})
}
export const changeUserBalance = async(data: PostUserBalanceType) => {
    return api.postPrivate({url: 'user/balance-operations', data,  withCredentials:true})
}
