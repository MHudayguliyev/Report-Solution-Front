export type AdminFirms = {
    backend_guid: string
    firm_name:string
    firm_fullname: string
    firm_tel_num1:string | number
    firm_address: string
}
export interface AdminUsers {
    user_guid:string
    user_name:string
    user_login:string | number
    role_name:string
}
export interface AllAdminUsers extends AdminUsers {
    role_guid:string
    user_email:string
    user_balance:string|number
    is_user_active:boolean
    is_user_confirm:boolean
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
export type PostUsers = {
    to: string
    users: string[]
    firms: string[]
}
export type PostUserBalanceType = {
    operationAmount: string | number
    optTypeGuid:string
    users: {
      userGuid: string
      phoneNumber:string | number | any
    }[]
}
export interface AdminSubscriptions {
    subsc_guid:string
    subsc_name:string
    subsc_desc:string | number | undefined
    subsc_valid_in_days:number
    subsc_price_value:string | number | undefined
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