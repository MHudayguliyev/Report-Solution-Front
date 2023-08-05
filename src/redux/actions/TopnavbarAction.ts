import { UserFirms, UserFirmsList } from "@app/api/Types/queryReturnTypes/UserFirms";
import { ActivateAutoRefresh,  DisconnectedType,  SetDashboardDate, SetFirmsList, SetReceiver, SetRenewDashboard, SetRenewReport, SetReportEndDate, SetReportStartDate, SetSwitched, SetTimetorefetch, UpdateFirmsList, UsualType } from "../types/TopnavbarTypes";
import { DateType } from "../types";

const setFirmsList = (data: UserFirms<string>[]): SetFirmsList => {
    return {
        type: 'SET_FIRMS_LIST', 
        payload: data
    }
}
const updateFirmsOnDisconnect = (disClient: DisconnectedType, t: any): UpdateFirmsList =>  {
    return {
        type: 'UPDATE_FIRMS_LIST', 
        payload: {
            disconnected_client: disClient, 
            translation: t
        }
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
setDashboardDate, setReportStartDate, setReportEndDate, 
setTimetorefetch, setSwitched, activateAutoRefresh,
setRenewDashboard, setRenewReport
}
export default exportDefault
