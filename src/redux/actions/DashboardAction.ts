import { DataKindType, SetDashboardTable, SetDataType } from './../types/DashboardTypes';
import {
    SetCashesAmount,
    SetCreditsFromSale,
    SetDebtsFromPurchase,
    SetEmployeesBalance,
    SetExpensesAmount,
    SetSaleOrdTotalByStatus,
    SetPaymentsMade,
    SetPaymentsReceived,
    SetPurchSaleOrder,
    SetPurchSalesReturns,
    SetStockCostTotal,
    SetBools,
    SetFetcher,
    FetcherType,
    LiberateFetcher,
    SetDetails,
    OpenDtlTable,
    SetDetailsLoading,
    SetDashboardSettings,
    TaskType,
} from '../types/DashboardTypes'
import {
    StockCostTotal,
    PurchSalesReturns,
    PurchSaleOrders,
    SaleOrdTotalsByStatus,
    PaymentsReceived,
    PaymentsMade,
    CreditsFromSale,
    DebtsFromPurchase,
    EmployeesBalance,
    ExpensesAmount,
    CashesAmount,
    GlobalPayloadType, 
} from '../types/DashboardTypes'

const fetchData = (key: FetcherType, state: boolean): SetFetcher => {
    return {
        type: 'FETCH_DATA',
        payload: {state, key}
    }
}
const liberateFetcher = (): LiberateFetcher => { 
    return {
        type: 'LIBERATE_FETCHER'
    }
}
const setDetails = (data: any): SetDetails => {
    return {
        type: 'SET_DETAILS', 
        payload: data, 
    }
}
const openDtlTbl = (state: boolean): OpenDtlTable => {
    return {
        type: 'OPEN_DTL_TBL', state
    }
}
const setDetailsLoading = (state: boolean): SetDetailsLoading => {
    return {
        type: 'SET_DETAILS_LOADING', state
    }
}
const setDashboardTable = ({data, loading}: {data: any, loading: boolean}): SetDashboardTable => {
    return {
        type: 'SET_DASHBOARD_TABLE',
        payload: {data, loading}
    }
}
const setDashboardDataType = (type: DataKindType): SetDataType => {
    return {
        type: 'SET_DATA_TYPE', 
        payload: type
    }
}
const setStockCostTotal = (data: StockCostTotal[], key: DataKindType): SetStockCostTotal => {
    return {
        type: 'SET_STOCK_COST_TOTAL',
        payload: {key, data}
    }
}
const setStockLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_STOCK_COST_TOTAL_LOADING',
        payload: {
            key, state
        }
    }
}
const setStockErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_STOCK_COST_TOTAL_ERR',
    payload: {
        key, state
    }
})

const setPurchSalesReturns = (data: PurchSalesReturns<number>[], key: DataKindType): SetPurchSalesReturns => {
    return {
        type: 'SET_PURCH_SALES_RETURNS',
        payload: {key, data}
    }
}
const setPurchSalesRetLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_PURCH_SALES_RETURNS_LOADING',
        payload: {
            key, state
        }
    }
}
const setPurchSalesRetErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_PURCH_SALE_RETURNS_ERR',
    payload: {
        key, state
    }
})


const setPurchSaleOrders = (data: PurchSaleOrders<number>[], key: DataKindType): SetPurchSaleOrder => {
    return {
        type: 'SET_PURCH_SALE_ORDERS',
        payload: {key, data}
    }
}
const setPurchSaleOrdLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_PURCH_SALE_ORDERS_LOADING',
        payload: {
            key, state
        }
    }
}
const setPurchSaleOrdErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_PURCH_SALE_ORDERS_ERR',
    payload: {
        key, state
    }
})


const setOrdCountTotalByStatus = (data: SaleOrdTotalsByStatus[],key: DataKindType): SetSaleOrdTotalByStatus => {
    return {
        type: 'SET_SALE_ORD_TOTAL_BY_STATUS',
        payload: {key, data}
    }
}
const setOrdCountTotalLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_SALE_ORD_TOTAL_BY_STATUS_LOADING',
        payload: {
            key, state
        }
    }
}
const setOrdCountTotalErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_SALE_ORD_TOTAL_BY_STATUS_ERR',
    payload: {
        key, state
    }
})


const setPaymentsReceived = (data: PaymentsReceived[], key: DataKindType): SetPaymentsReceived => {
    return {
        type: 'SET_PAYMENTS_RECEIVED',
        payload: {key, data}
    }
}
const setPaymentsReceivedLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_PAYMENTS_RECEIVED_LOADING',
        payload: {
            key, state
        }
    }
}
const setPaymentsReceivedErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_PAYMENTS_RECEIVED_ERR',
    payload: {
        key, state
    }
})


const setPaymentMade = (data: PaymentsMade[], key: DataKindType): SetPaymentsMade => {
    return {
        type: 'SET_PAYMENTS_MADE',
        payload: {key, data}
    }
}
const setPaymentsMadeLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_PAYMENTS_MADE_LOADING',
        payload: {
            key, state
        }
    }
}
const setPaymentsMadeErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_PAYMENTS_MADE_ERR',
    payload: {
        key, state
    }
})


const setCreditsFromSale = (data: CreditsFromSale[], key: DataKindType): SetCreditsFromSale => {
    return {
        type: 'SET_CREDITS_FROM_SALE',
        payload: {key, data}
    }
}
const setCreditsLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_CREDITS_FROM_SALE_LOADING',
        payload: {
            key, state
        }
    }
}
const setCreditsErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_CREDITS_FROM_SALE_ERR',
    payload: {
        key, state
    }
})



const setDebtsFromPurchase = (data: DebtsFromPurchase[], key: DataKindType): SetDebtsFromPurchase => {
    return {
        type: 'SET_DEBTS_FROM_PURCHASE',
        payload: {key, data}
    }
}
const setDebtsLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_DEBTS_FROM_PURCHASE_LOADING',
        payload: {
            key, state
        }
    }
}
const setDebtsErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_DEBTS_FROM_PURCHASE_ERR',
    payload: {
        key, state
    }
})


const setEmployeesBalance = (data: EmployeesBalance[], key: DataKindType): SetEmployeesBalance => {
    return {
        type: 'SET_EMPLOYEES_BALANCE',
        payload: {key, data}
    }
}
const setEmployeesBalanceLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_EMPLOYEES_BALANCE_LOADING',
        payload: {
            key, state
        }
    }
}
const setEmployeesBalanceErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_EMPLOYEES_BALANCE_ERR',
    payload: {
        key, state
    }
})


const setExpensesAmount = (data: ExpensesAmount[], key: DataKindType): SetExpensesAmount => {
    return {
        type: 'SET_EXPENSES_AMOUNT',
        payload: {key, data}
    }
}
const setExpensesLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_EXPENSES_AMOUNT_LOADING',
        payload: {
            key, state
        }
    }
}
const setExpensesErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_EXPENSES_AMOUNT_ERR',
    payload: {
        key, state
    }
})

const setCashesAmount = (data: CashesAmount[], key:DataKindType): SetCashesAmount => {
    return {
        type: 'SET_CASHES_AMOUNT',
        payload: {key, data}
    }
}
const setCashesLoading = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => {
    return {
        type: 'SET_CASHES_AMOUNT_LOADING',
        payload: {
            key, state
        }
    }
}
const setCashesErr = ({key, state}: GlobalPayloadType<DataKindType>): SetBools => ({
    type: 'SET_CASHES_AMOUNT_ERR',
        payload: {
            key, state
        }
})
const setDashboardSettings = ({task, bool, dataType}:{task: TaskType, bool?: boolean, dataType?: DataKindType | undefined}): SetDashboardSettings => ({
    type: 'SET_DASHBOARD_SETTINGS', 
    payload: {
        task, bool: bool ?? false, dataType
    }
})

const exportDefault = {
    ///FETCH_DATA/DETAILS TABLE OPEN STATE/DETAILS LOADING STATE/DASHBOARD DATA TYPE
    fetchData,liberateFetcher,  setDashboardSettings,   
    setDetails, openDtlTbl, setDetailsLoading, setDashboardTable,setDashboardDataType, 
    /// REAL STATES
    setCashesAmount,
    setCreditsFromSale,
    setDebtsFromPurchase,
    setEmployeesBalance,
    setExpensesAmount,
    setOrdCountTotalByStatus,
    setPaymentMade,
    setPaymentsReceived,
    setPurchSaleOrders,
    setPurchSalesReturns,
    setStockCostTotal,
    /// LOADING/ERROR
    setStockLoading,
    setCashesLoading,
    setCreditsLoading,
    setDebtsLoading,
    setEmployeesBalanceLoading,
    setExpensesLoading,
    setOrdCountTotalLoading,
    setPaymentsMadeLoading,
    setPaymentsReceivedLoading,
    setPurchSaleOrdLoading,
    setPurchSalesRetLoading,
    setStockErr,
    setCashesErr,
    setCreditsErr,
    setDebtsErr,
    setEmployeesBalanceErr,
    setExpensesErr,
    setOrdCountTotalErr,
    setPaymentsMadeErr,
    setPaymentsReceivedErr,
    setPurchSaleOrdErr,
    setPurchSalesRetErr
}

export default exportDefault