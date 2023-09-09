export type FormName = 'login' | 'register' | 'verification' | 'password' | "phone"
export interface SetForm {
    type: "SET_FORM",
    payload: FormName
 }
export interface SetShowTimeModalType {
    type: "SET_SHOW_TIME_MODAL",
    payload: boolean
 }