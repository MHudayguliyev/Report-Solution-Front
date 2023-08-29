import { Localization } from "@mui/material/locale"

export interface Dispatch {dispatch: any}
export interface DashboardSetterType extends Dispatch{
    task: 'load' | 'emptify' | 'both' 
    state?: boolean | any
}

export interface authStorageKeyTypes {
    accessTokenExpirationDate: string
    access_token:string
    role_name:string
    user_guid:string
    user_name:string | undefined
    user_phone:string | number
}
export interface ResponseType {
    cred: {
       name?: string | string[]
       type_id?: number | null | undefined
       roomName?:string
    },
    data: any
}
export interface TableNameType {
    value:string, 
    label:string
}
export interface AdminFilterOptions extends Localization {
    value:string
}
  