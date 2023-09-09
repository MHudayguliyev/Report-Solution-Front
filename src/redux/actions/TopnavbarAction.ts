import { UserFirms, UserFirmsList } from "@app/api/Types/queryReturnTypes/UserFirms";
import { ActivateAutoRefresh,  DisconnectedType,  ExternalQuestType,  SetCompareSwitch,  SetDashboardCompareDate,  SetDashboardDate, SetExternalQuest, SetFirmsList, SetReceiver, SetRenewDashboard, SetRenewReport, SetReportEndDate, SetReportStartDate, SetSwitchAndActivator, SetSwitched, SetTimetorefetch, UpdateFirmsList, UsualType } from "../types/TopnavbarTypes";
import { DateType } from "../types";

const makeExternalQuest = ({key, bool}: {key: ExternalQuestType, bool: boolean}): SetExternalQuest =>  {
    return {
        type: 'SET_EXTERNAL_QUEST', 
        payload: {
            key, bool
        }
    }
}
const setScrollY = (position: number) => {
    return {
        type: 'SET_SCROLLY', 
        payload: position
    }
}
const runLayoutScrollY = ({state, position}:{state: boolean, position: number}) => {
    return {
        type: 'RUN_LAYOUT_SCROLLY', 
        payload: {state, position}
    }
}

const setFirmsList = (data: UserFirms<string>[]): SetFirmsList => {
    return {
        type: 'SET_FIRMS_LIST', 
        payload: data
    }
}
const updateFirmsOnDisconnect = (disClient: DisconnectedType, t: Function): UpdateFirmsList =>  {
    return {
        type: 'UPDATE_FIRMS_LIST', 
        payload: {
            disconnected_client: disClient, 
            translation: t
        }
    }
}
const setSwitchAndActivator = (state: boolean): SetSwitchAndActivator => {
    return {
        type: 'SET_SWITCH_AND_ACTIVATOR', 
        payload: state
    }
}
const setReceiver = (receiver: UsualType): SetReceiver => {
    return {
        type:'SET_RECEIVER', 
        payload: receiver
    }
}
const setDashboardDate = (date: DateType): SetDashboardDate => {
    return {
        type: 'SET_DASHBOARD_DATE', 
        payload: date
    }
}
const setDashboardCompareDate = (date: DateType): SetDashboardCompareDate => {
    return {
        type: 'SET_DASHBOARD_COMPARE_DATE', 
        payload: date
    }
}
const setReportStartDate = (date: DateType): SetReportStartDate => {
    return {
        type: 'SET_REPORT_START_DATE', 
        payload: date
    }
}
const setReportEndDate = (date: DateType): SetReportEndDate => {
    return {
        type:'SET_REPORT_END_DATE', 
        payload: date
    }
}
const setTimetorefetch = (time: string): SetTimetorefetch => {
    return {
        type:'SET_TIME_TO_REFETCH', 
        payload: time
    }
}
const setSwitched = (state: boolean): SetSwitched => {
    return {
        type: 'SET_SWITCHED', 
        payload: state
    }
}
const setCompareSwitch  = (state: boolean): SetCompareSwitch => {
    return {
        type: 'SET_COMPARE_SWITCH', 
        payload: state
    }
}
const activateAutoRefresh = (state: boolean): ActivateAutoRefresh => {
    return {
        type: 'ACTIVATE_AUTO_REFRESH', 
        payload: state
    }
}
const setRenewDashboard = (state: boolean): SetRenewDashboard => {
    return {
        type: 'SET_RENEW_DASHBOARD', 
        payload: state
    }
}
const setRenewReport = (state: boolean): SetRenewReport => {
    return {
        type: 'SET_RENEW_REPORT', 
        payload: state
    }
}
const exportDefault = {
    setFirmsList,updateFirmsOnDisconnect, setReceiver, 
    setDashboardDate, setDashboardCompareDate, 
    setReportStartDate, setReportEndDate, 
    setTimetorefetch, setSwitched,setCompareSwitch, activateAutoRefresh,
    setSwitchAndActivator,setScrollY,runLayoutScrollY,
    makeExternalQuest,setRenewDashboard,setRenewReport,
}
export default exportDefault
