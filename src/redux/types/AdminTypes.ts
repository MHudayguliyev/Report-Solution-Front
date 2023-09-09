import { Scalars } from "."

export type ExpiredValues = 'expired' | 'notExpired' | 'all'

export type InitialState = {
   /** @default expired */
    expiredValue: ExpiredValues
    userGuid:Scalars['String']
    forceUpdateUserGuid: Scalars['Boolean']
    refetchState: Scalars['Boolean']
}

export interface SetExpiredValue {
    type: 'SET_EXPIRED_VALUE', 
    payload: ExpiredValues
}
export interface SetUserGuid {
    type: 'SET_USER_GUID', 
    payload: Scalars['String']
}
export interface ForceUpdateUserGuid {
    type: 'FORCE_UPDATE_USER_GUID', 
    payload: Scalars['Boolean']
}
export interface SetRefetchState {
    type: 'SET_REFETCH_STATE', 
    payload: Scalars['Boolean']
}