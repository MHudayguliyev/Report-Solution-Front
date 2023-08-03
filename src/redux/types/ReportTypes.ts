export type Localization = {
    en: string, 
    ru: string, 
    tm:string
}

export type InitialState = {
    reportData: any | any[]
    startDate: Date | string
    endDate: Date | string
    renewData: boolean
    // autoRefreshActivated: boolean
    isDataLoading: boolean
    activeIndex: number | undefined
    field: {value: string, label: Localization}
    endUrl: string
}