export interface SetAuth {
   type: "SET_IS_AUTHORIZED",
   payload: boolean
}

export interface RefetchUserData {
   type: "REFETCH_USER_DATA",
   payload: boolean
}