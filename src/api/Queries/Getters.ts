import { api } from "@app/api/service/api_helper"
import { UserList} from "../Types/queryReturnTypes";

import { UserRoleTypes } from "../Types/queryReturnTypes/UserRoles";
import { UserFirms } from "../Types/queryReturnTypes/UserFirms";
import { UserSubscStatus } from "../Types/queryReturnTypes/UserSubscStatus";
import UserAction from "../Types/queryReturnTypes/UserAction";


export const GetUser = async (userGuid: string): Promise<UserList[] | any> => {
    return api.getPrivate({url: `user/get-user/${userGuid}`, withCredentials: true})
}
export const GetUserRoles = async (): Promise<UserRoleTypes[]> => {
    return api.get<UserRoleTypes[]>({url: 'general/roles'})
}
export const GetUserFirms = async (userGuid: string): Promise<UserFirms<string>[] | any> => {
    return api.getPrivate<UserFirms<string>[]>({url: `user/get-firms-of-user/${userGuid}`, withCredentials: true})
}
export const GetUserSubcsStatus = async (userGuid: string): Promise<UserSubscStatus> => {
    return api.getPrivate<UserSubscStatus>({url: `user/get-user-subscription-status?user_guid=${userGuid}`, withCredentials: true})
}
export const GetUserActions = async (userGuid: string): Promise<UserAction[]| any> => {
    return api.getPrivate<UserAction[]>({url: `user/get-user-actions/${userGuid}`, withCredentials:true})
}