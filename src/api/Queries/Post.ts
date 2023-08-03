import { api } from '@api/service/api_helper';

export const updateUser = async ({id, data}: {id:string, data: {userName:string,userEmail:string,phoneNumber:string|number}}) => {
    return api.putPrivate({url: `user/update-user-data/${id}`, data, withCredentials: true})
}