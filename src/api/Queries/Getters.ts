import { api } from "@app/api/service/api_helper"
import { UserList} from "../Types/queryReturnTypes";

import { UserRoleTypes } from "../Types/queryReturnTypes/UserRoles";
import { UserFirms } from "../Types/queryReturnTypes/UserFirms";
import { UserSubscStatus } from "../Types/queryReturnTypes/UserSubscStatus";
import UserAction from "../Types/queryReturnTypes/UserAction";
import { AdminFirms, AdminOperationTypes, AdminSubscribedUsers, AdminSubscriptions, AdminUsers, AllAdminUsers } from "../Types/queryReturnTypes/Admin";
import { ExpiredValues } from "@app/redux/types/AdminTypes";


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
export const GetUserAvatar = async (userGuid:string): Promise<string> => {
    return api.getPrivate({url:`/user/get-user-avatar?user_guid=${userGuid}`, withCredentials:true})
}
export const DeleteAvatar = async (userGuid:string): Promise<string> => {
    return api.getPrivate({url: `user/remove-user-avatar?user_guid=${userGuid}`, withCredentials:true})
}
export const GetAdminFirms = async (): Promise<AdminFirms[]> => {
    return api.getPrivate<AdminFirms[]>({url: 'admin/get-firms', withCredentials: true})
}
export const GetAdminUsers = async ({backendGuid, assigned}: {backendGuid:string, assigned:boolean}): Promise<AdminUsers[]> => {
    return api.getPrivate<AdminUsers[]>({url: `admin/get-users-of-firms?backend_guid=${backendGuid}${assigned ? '&assigned' : ""}`, withCredentials: true})
}
export const GetAdminSubscribedUsers = async ({subscGuid, filterBy, assigned = false}:{subscGuid:string, filterBy:ExpiredValues, assigned?:boolean}): Promise<AdminSubscribedUsers[]> => {
    return api.getPrivate<AdminSubscribedUsers[]>({url: `admin/get-users-of-subscriptions?subsc_guid=${subscGuid}&assigned=${assigned}&filter=${filterBy}`, withCredentials:true})
}
export const GetAllAdminUsers = async (): Promise<AllAdminUsers[]> => {
    return api.getPrivate<AllAdminUsers[]>({url: `user/get-users`, withCredentials: true})
}
export const GetSubscriptions = async (): Promise<AdminSubscriptions[]> => {
    return api.getPrivate<AdminSubscriptions[]>({url: 'general/get-subscriptions', withCredentials:true})
}
export const GetOperationTypes = async (): Promise<AdminOperationTypes[]> => {
    return api.getPrivate<AdminOperationTypes[]>({url: 'general/get-operation-types', withCredentials:true})
}

