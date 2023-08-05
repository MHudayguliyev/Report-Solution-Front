import { AnyAction } from "redux";
import { InitialState } from "../types/ReportTypes";

const initialState: InitialState = {
    reportData: [],
    field: {value: "material", label: {en:"Material", ru:"По товарно", tm: "Haryt b/ç"}}, // defaults to material
    endUrl: 'mat_stock_amount_cost', // defaults to mat_stock_amount_cost
    activeTabIndex: 0,
    isReportsDataLoading: false
}


const ReportReducer = (state=initialState, action:AnyAction) => {
    switch(action.type){
        case 'SET_REPORT_DATA': 
            return {
                ...state, reportData: action.payload
            }
        case 'SET_REPORT_DATA_LOADING':     
            return {
                ...state, isReportsDataLoading: action.payload
            }
        case 'SET_FIELD': 
            return{
                ...state, field: action.payload
            }
        case 'SET_TAB_ACTIVE_INDEX': 
            const {index:idx} = action.payload
            const url = idx === 0 ? 'mat_stock_amount_cost' : idx === 1 ? 'mat_gross_profitability' : ""
            return {
                ...state, 
                activeTabIndex: idx, 
                endUrl: url
            }
        default: 
            return state
    }
}

export default ReportReducer