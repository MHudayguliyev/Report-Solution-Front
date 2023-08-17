export interface Dispatch {dispatch: any}
export interface DashboardSetterType extends Dispatch{
    task: 'load' | 'emptify' | 'both' 
    state?: boolean | any
}
export interface ResponseType {
    cred: {
       name?: string | string[]
       type_id?: number | null | undefined
       roomName?:string
    },
    data: any
}