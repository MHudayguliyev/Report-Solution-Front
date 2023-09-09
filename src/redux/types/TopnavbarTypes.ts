import { UserFirmsList, UserFirms } from "@app/api/Types/queryReturnTypes/UserFirms"
import { DateType, Scalars } from "."

export type UsualType = {
    label: Scalars['String'], 
    value: Scalars['String'], 
    connected: boolean,
}

export type DisconnectedType = {
    room: Scalars['String']
    connected: Scalars['Boolean']
    last_conn_dt: DateType
}
export type ReconnectedType = {
    room: Scalars['String']
    state: Scalars['Boolean']
}
export type ExternalQuestType = 'dashboard' | 'report' | 'forecast'

export type InitialState = {
    receiver: UsualType
    dashboardDate: string,
    dashboardCompareDate: string,
    reportStartDate: string, 
    reportEndDate: string,
    switched: Scalars['Boolean'],
    compareSwitch: Scalars['Boolean']
    autoRefreshActivated: Scalars['Boolean'],
    firmsList: UserFirmsList<string>[],
    timeToRefetch: Scalars['String' | "Number"],
    scrollY: Scalars['Number'],
    layoutScrollRunner:{
        run: Scalars['Boolean']
        position: Scalars['Number']
    },
    renewDashboard: Scalars['Boolean'], 
    renewReport: Scalars['Boolean'],
    externalQuest: {
        dashboard: Scalars['Boolean']
        report: Scalars['Boolean']
        forecast: Scalars['Boolean']
    }
}


export type SetFirmsList = {
    type: 'SET_FIRMS_LIST'
    payload: UserFirms<string>[]
}
export type UpdateFirmsList = {
    type: 'UPDATE_FIRMS_LIST',
    payload: {
        disconnected_client: DisconnectedType, 
        translation: Scalars['Any']
    }
}
export type SetReceiver = {
    type: 'SET_RECEIVER', 
    payload: UsualType
}
export type SetDashboardDate = {
    type: 'SET_DASHBOARD_DATE',
    payload: DateType
}
export type SetDashboardCompareDate = {
    type: 'SET_DASHBOARD_COMPARE_DATE',
    payload: DateType
}
export type SetReportStartDate = {
    type: 'SET_REPORT_START_DATE', 
    payload: DateType
}
export type SetReportEndDate = {
    type: 'SET_REPORT_END_DATE', 
    payload: DateType
}
export type SetTimetorefetch = {
    type: 'SET_TIME_TO_REFETCH', 
    payload: Scalars['String']
}
export type SetSwitched = {
    type: 'SET_SWITCHED', 
    payload: Scalars['Boolean']
}
export type SetCompareSwitch = {
    type: 'SET_COMPARE_SWITCH', 
    payload:Scalars['Boolean']
}
export type ActivateAutoRefresh = {
    type: 'ACTIVATE_AUTO_REFRESH', 
    payload: Scalars['Boolean']
}
export type SetSwitchAndActivator = {
    type: 'SET_SWITCH_AND_ACTIVATOR'
    payload: Scalars['Boolean']
}
export type SetRenewDashboard = {
    type: 'SET_RENEW_DASHBOARD', 
    payload: Scalars['Boolean']
}
export type SetRenewReport = {
    type: 'SET_RENEW_REPORT'
    payload: Scalars['Boolean']
}
export type SetExternalQuest = {
    type: 'SET_EXTERNAL_QUEST', 
    payload: {
        key: ExternalQuestType, 
        bool: Scalars['Boolean']
    }
}