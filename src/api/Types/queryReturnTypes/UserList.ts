type UserList = {
    user_guid: string 
    user_login: string | undefined
    user_name: string
    user_email: string
    role_name: string
    is_user_active: boolean
    is_user_confirm: boolean
    role_is_admin: boolean
}

export default UserList;
