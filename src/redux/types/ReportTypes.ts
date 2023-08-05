import { Scalars } from "."

export interface Localization {
    en: Scalars['String']
    ru: Scalars['String']
    tm:Scalars['String']
}
export interface FieldType {
    value: Scalars['String']
    label: Localization
}

export type InitialState = {
    reportData: Scalars['Any']
    isReportsDataLoading: Scalars['Boolean']
    activeTabIndex: Scalars['Number' | 'Undefined']
    field: FieldType
    endUrl: Scalars['String']
}

export type SetReportData = {
    type: 'SET_REPORT_DATA', 
    payload: Scalars['Any']
}
export type SetReportDataLoading = {
    type: 'SET_REPORT_DATA_LOADING'
    payload: Scalars['Boolean']
}
export type SetActiveIndex = {
    type: 'SET_TAB_ACTIVE_INDEX', 
    payload: {
        index: Scalars['Number' | 'Undefined']
    }
}
export type SetField = {
    type: 'SET_FIELD', 
    payload: FieldType
} 
export type SetEndUrl = {
    type: 'SET_END_URL', 
    payload: Scalars['String']
}