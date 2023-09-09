import { ExpiredValues, ForceUpdateUserGuid, SetExpiredValue, SetRefetchState, SetUserGuid } from "../types/AdminTypes"

const setExpiredValue = (value: ExpiredValues): SetExpiredValue => {
    return {
        type: 'SET_EXPIRED_VALUE', 
        payload: value
    }
}
const setUserGuid = (userGuid:string): SetUserGuid => {
    return {
        type: 'SET_USER_GUID', 
        payload: userGuid
    }
}
const forceUpdateUserGuid = (state: boolean): ForceUpdateUserGuid => {
    return {
        type: 'FORCE_UPDATE_USER_GUID', 
        payload: state
    }
}
const setRefetchState = (state: boolean): SetRefetchState => {
    return {
        type: 'SET_REFETCH_STATE', 
        payload: state
    }
}

const exportDefault = {
    setExpiredValue,forceUpdateUserGuid, 
    setUserGuid, setRefetchState
}

export default exportDefault