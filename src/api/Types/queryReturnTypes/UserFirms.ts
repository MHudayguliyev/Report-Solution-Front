import { UsualType } from "@app/redux/types/TopnavbarTypes"

export type UserFirms<T> = {
    user_guid: T,
    backend_guid: T,
    firm_name: T,
    firm_fullname: T,
    firm_tel_num1: T,
    firm_tel_num2: T,
    firm_address: T,
    connected: boolean,
    connected_at: Date | T | any,
    firm_crt_mdf_dt: Date | T
}

export interface UserFirmsList<T> extends UsualType {
    user_guid: T,
    firm_fullname: T,
    firm_tel_num1: T,
    firm_tel_num2: T,
    firm_address: T,
    connected_at: Date | T | any,
    firm_crt_mdf_dt: Date | T,
}