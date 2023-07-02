import { Get, GetPrivate } from "@app/api/service/api_helper"
import { UserList} from "../Types/queryReturnTypes";

import { UserRoleTypes } from "../Types/queryReturnTypes/UserRoles";
import { UserFirms } from "../Types/queryReturnTypes/UserFirms";
import { UserSubscStatus } from "../Types/queryReturnTypes/UserSubscStatus";
import { axiosInstance } from "../axiosInstance";
import UserAction from "../Types/queryReturnTypes/UserAction";

export const GetUser = async (token:string, userGuid: string): Promise<UserList[] | any> => {
    return axiosInstance.get(`user/get-user/${userGuid}`, {headers: {Authorization: `Bearer ${token}`}}).then(response => response.data)
}
export const GetUserRoles = async (): Promise<UserRoleTypes[]> => {
    return Get<UserRoleTypes[]>('general/roles')
}
export const GetUserFirms = async (token: string, userGuid: string): Promise<UserFirms<string>[] | any> => {
    return axiosInstance.get(`user/get-firms-of-user/${userGuid}`, {headers: {Authorization: `Bearer ${token}`}}).then(response => response.data)
}
export const GetUserSubcsStatus = async (token: string, userGuid: string): Promise<UserSubscStatus> => {
    return axiosInstance.get(`user/get-user-subscription-status?user_guid=${userGuid}`, {headers: {Authorization: `Bearer ${token}`}}).then(response => response.data)

}
export const GetUserActions = async (userGuid: string): Promise<UserAction> => {
    return GetPrivate(`user/get-user-actions/${userGuid}`)
}