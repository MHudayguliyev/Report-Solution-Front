import { AnyAction } from "redux";
import { InitialState } from "../types/ReportTypes";
import moment from "moment";

import {
    SET_REPORT_DATA,
    SET_START_DATE, 
    SET_END_DATE,
    RENEW_DATA,
    SET_TAB_INDEX,
    SET_FIELD,
    SET_END_URL,
    IS_DATA_LOADING
    // ACTIVATE_AUTO_REFRESH,
} 
from '@redux/actions/ReportAction'

const initialState: InitialState = {
    reportData: [],
    startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
    endDate: moment(new Date()).format("YYYY-MM-DD"),
    field: {value: "material", label: {en:"Material", ru:"По товарно", tm: "Haryt b/ç"}}, // defaults to material
    endUrl: 'mat_stock_amount_cost', // defaults to mat_stock_amount_cost
    activeIndex: 0,
    renewData: false, 
    // autoRefreshActivated: false,
    isDataLoading: false
}


const ReportReducer = (state=initialState, action:AnyAction) => {
    switch(action.type){
        case SET_REPORT_DATA: 
            return {
                ...state, reportData: action.payload
            }
        case SET_START_DATE:    
            return {
                ...state, startDate: action.payload
            }
        case SET_END_DATE:    
            return {
                ...state, endDate: action.payload
            }
        case SET_FIELD: 
            return{
                ...state, field: action.payload
            }
        case SET_END_URL: 
            return {
                ...state, endUrl: action.url
            }
        case SET_TAB_INDEX: 
            return {
                ...state, activeIndex: action.index
            }
        case RENEW_DATA: 
            return {
                ...state, renewData: action.payload
            }
        // case ACTIVATE_AUTO_REFRESH:     
        //     return {
        //         ...state, autoRefreshActivated: action.payload
        //     }
        case IS_DATA_LOADING:     
            return {
                ...state, isDataLoading: action.payload
            }
        default: 
            return state
    }
}

export default ReportReducer