import { Moment } from "moment"

export type AdminFirms = {
    backend_guid: string
    firm_name:string
    firm_fullname: string
    firm_tel_num1:string | number
    firm_address: string
    is_connected: boolean
    last_conn_dt: Date | string
}
export interface AdminUsers {
    user_guid:string
    user_name:string
    user_login:string | number
    role_name:string
}
export interface AllAdminUsers extends AdminUsers {
    // role_guid:string
    user_email:string
    user_balance:string
    balance_sum:string | number
    is_user_active:boolean
    is_user_confirm:boolean
    is_subsc_expired: boolean
    subsc_name:string
    subsc_start_date:string
    subsc_end_date:string
    user_firms: {
        backend_guid:string
        firm_name:string
        firm_fullname:string 
        firm_tel_num1:string | number
        firm_tel_num2:string | number
        firm_address:string | number | undefined
    }[]
} 
export interface MtrlTableAllAdminUsers extends AdminUsers {
    user_balance:string 
    balance_sum: string | number
    red_target: boolean
}
export type PostUsers = {
    to: string
    users: string[]
    firms: string[]
}
export type PostUserBalanceType = {
    optTypeGuid:string
    operationAmount: string | number
    users: {
      userGuid: string
      userBalance:number
      phoneNumber:string | number | any
      resultOperationAmount: string | number
    }[]
}
export type PostUserSubscriptions = { ////////////////
    user_guids: string[]
    subsc_guid: string
    subsc_start_date:string 
    subsc_end_date:string
    subsc_purch_price:string | number | undefined
}
export interface AdminSubscriptions {
    subsc_guid:string
    subsc_name:string
    subsc_desc:string | number | undefined
    subsc_valid_in_days:number
    subsc_price_value:string 
    is_subsc_active:boolean
}
export interface AdminSubscribedUsers {
    user_guid:string
    user_login:string 
    user_name:string | number | undefined
    subsc_purch_price:string | number
    role_name:string
    is_subsc_expired:boolean
    is_subsc_canceled: boolean
}
export interface AdminOperationTypes {
    operation_type_guid:string
    operation_type_name:string
    operation_increase:boolean
}