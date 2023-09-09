export type UserSubscStatus = {
    subsc_name: string, 
    subsc_desc: string,
    user_balance: string | number,
    // remain_date: {
    //     years?: number | any,
    //     months?: number| any,
    //     days?: number| any,
    //     hours?: number| any,
    //     minutes?: number| any,
    // }[]
    remain_date: any
}