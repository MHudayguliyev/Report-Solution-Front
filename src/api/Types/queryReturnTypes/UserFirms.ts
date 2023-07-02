export type UserFirms<T> = {
    user_guid: T,
    backend_guid: T,
    firm_name: T,
    firm_fullname: T,
    firm_tel_num1: T,
    firm_tel_num2: T,
    firm_address: T,
    connected: boolean,
    firm_crt_mdf_dt: Date | T
}