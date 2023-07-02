export type InitialState = {
    startDate: Date | string
    endDate: Date | string
    renewData: boolean
    autoRefreshActivated: boolean
    isDataLoading: boolean
    activeIndex: number | undefined
    field: {value: string, label: string}
    endUrl: string
}