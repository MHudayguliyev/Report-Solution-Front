import { AnyAction } from "redux";
import { InitialState } from "../types/TopnavbarTypes";
import moment from "moment";
import toast from 'react-hot-toast'
import { UserFirmsList } from "@app/api/Types/queryReturnTypes/UserFirms";

const initialState: InitialState = {
    firmsList: [],
    renewDashboard: false, 
    renewReport: false, 
    receiver: { value: '', label: '', connected: false },
    autoRefreshActivated: false, 
    switched: false, 
    timeToRefetch: '5', 
    dashboardDate: moment(new Date()).format("YYYY-MM-DD"),
    reportStartDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
    reportEndDate: moment(new Date()).format("YYYY-MM-DD"),

}

const TopnavbarReducer = (state=initialState, action: AnyAction) => {
    switch(action.type){
        case 'SET_FIRMS_LIST': 
            const firms:UserFirmsList<string>[] = action.payload?.map((item:any) => {
                return {
                    user_guid: item.user_guid, 
                    firm_fullname: item.firm_fullname, 
                    firm_tel_num1: item.firm_tel_num1,
                    firm_tel_num2: item.firm_tel_num2, 
                    firm_address: item.firm_address, 
                    firm_crt_mdf_dt: item.firm_crt_mdf_dt,
                    label: item.firm_name, 
                    value: item.backend_guid,
                    connected: item.connected,
                    connected_at: item.connected_at // note: this is null when THE FIRM is not connected once yet!
                }
            })
            return {
                ...state, 
                firmsList: firms
            }
        case 'UPDATE_FIRMS_LIST':
            const {disconnected_client, translation} = action.payload
            const firmsListClone = state.firmsList?.map(item => ({...item}))
            for(let i = 0; i < firmsListClone.length; i++){
                const firm = firmsListClone[i]
                if(firm.value === disconnected_client.room){
                    firm.connected = disconnected_client.connected // which is false
                    firm.connected_at = disconnected_client.last_conn_dt
                    toast.error(firm.label + ' ' + translation('disconnected'), {duration: 2*1000})
                }
            }

            return {
                ...state, 
                firmsList: firmsListClone,
                receiver: {connected: false, label: "", value: ""},
                autoRefreshActivated: false, 
                switched: false
            }
        case 'SET_RENEW_DASHBOARD': 
            return {
                ...state, 
                renewDashboard: action.payload
            }
        case 'SET_RENEW_REPORT': 
            return {
                ...state, 
                renewReport: action.payload
            }
        case 'SET_RECEIVER': 
        const {value, label, connected} = action.payload
            return {
                ...state, 
                receiver: {...state.receiver, value, label, connected}
            }
        case 'SET_DASHBOARD_DATE': 
            return {
                ...state, 
                dashboardDate: action.payload 
            }
        case 'SET_REPORT_START_DATE': 
            return {
                ...state, 
                reportStartDate: action.payload 
            }
        case 'SET_REPORT_END_DATE': 
            return {
                ...state, 
                reportEndDate: action.payload 
            }
        case 'SET_TIME_TO_REFETCH': 
            return {
                ...state, 
                timeToRefetch: action.payload 
            }
        case 'ACTIVATE_AUTO_REFRESH': 
            return {
                ...state, 
                autoRefreshActivated: action.payload 
            }
        case 'SET_SWITCHED': 
            return {
                ...state, 
                switched: action.payload 
            }

        default: 
            return state
    }
}

export default TopnavbarReducer