import { Localization } from "../types/ReportTypes"

export const SET_START_DATE = 'SET_START_DATE'
export const SET_END_DATE = 'SET_END_DATE'
export const SET_FIELD = 'SET_FIELD'
export const SET_END_URL = 'SET_END_URL'
export const SET_TAB_INDEX = 'SET_TAB_INDEX'
export const RENEW_DATA = 'RENEW_DATA'
export const ACTIVATE_AUTO_REFRESH = 'ACTIVATE_AUTO_REFRESH'
export const IS_DATA_LOADING = 'IS_DATA_LOADING'
export const SET_REPORT_DATA = 'SET_REPORT_DATA'

const setReportData = (data: any | any[]) => ({
    type: SET_REPORT_DATA,
    payload: data
})

const setStartDate = (date: Date | string) => ({
    type: SET_START_DATE,
    payload: date
})
const setEndDate = (date: Date | string) => ({
    type: SET_END_DATE,
    payload: date
})
const setField = (field: {value: string, label: Localization}) => ({
    type: SET_FIELD,
    payload: field
})
const setEndUrl = (url: string) => ({
    type: SET_END_URL,url
})
const setActiveindex = (index: number) => ({
    type: SET_TAB_INDEX, index
})
const renewData = (state: boolean) => ({
    type: RENEW_DATA,
    payload: state
})
const setDataLoading = (state: boolean) => ({
    type: IS_DATA_LOADING, 
    payload: state
})
// const activateAutoRefresh = (state: boolean) => ({
//     type: ACTIVATE_AUTO_REFRESH,
//     payload: state
// })

const exportDefault = {
    setReportData,
    setStartDate, 
    setEndDate,
    setField, 
    setEndUrl,
    setActiveindex, 
    renewData,
    setDataLoading
    // activateAutoRefresh,
}
export default exportDefault
