import { SetReportTable } from './../types/ReportTypes';
import { Scalars } from "../types"
import { FieldType, SetActiveIndex, SetEndUrl, SetField, SetReportData, SetReportDataLoading } from "../types/ReportTypes"


const setReportTable = ({data, loading}: {data: any,loading:boolean }): SetReportTable => {
    return {
        type: 'SET_REPORT_TABLE', 
        payload: {
            data, loading
        }
    }
}
const setReportData = (data: Scalars['Any']): SetReportData => {
    return {
        type: 'SET_REPORT_DATA', 
        payload: data
    }
}
const setReportDataLoading = (state: Scalars['Boolean']): SetReportDataLoading => {
    return {
        type: 'SET_REPORT_DATA_LOADING', 
        payload: state
    }
}
const setField = (field: FieldType): SetField => {
    return {
        type: 'SET_FIELD', 
        payload: field
    }
}
const setTabActiveIndex = (index: Scalars['Number']): SetActiveIndex => {
    return {
        type: 'SET_TAB_ACTIVE_INDEX', 
        payload: {index}
    }
}

const exportDefault = {
    setReportTable,
    setReportData,
    setReportDataLoading,
    setField, 
    setTabActiveIndex, 
}
export default exportDefault
