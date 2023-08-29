import { AnyAction } from "redux";
import { InitialState } from "../types/AdminTypes";

const initialState: InitialState = {
    expiredValue: 'notExpired',
    userGuid: "", 
    refetchState: false, 
    forceUpdateUserGuid: false, 
}

const AdminReducer = (state=initialState, action:AnyAction) => {
    switch(action.type){
        case 'SET_USER_GUID': 
            return {
                ...state, 
                userGuid: action.payload
            } 
        case 'FORCE_UPDATE_USER_GUID': 
            return {
                ...state, 
                forceUpdateUserGuid: action.payload
            } 
        case 'SET_REFETCH_STATE': 
            return {
                ...state, 
                refetchState: action.payload
            } 
        default: 
            return state
    }
}

export default AdminReducer