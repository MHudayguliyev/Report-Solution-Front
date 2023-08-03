type UserList = {
    user_guid: string 
    user_login: string | any
    user_name: string
    user_email: string
    role_name: string
    role_guid: string,
    is_user_active: boolean
    is_user_confirm: boolean
    role_is_admin: boolean
}

export default UserList;
