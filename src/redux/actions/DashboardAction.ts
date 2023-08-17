import { SetDashboardTable } from './../types/DashboardTypes';
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

const setStockCostTotal = (data: StockCostTotal[]): SetStockCostTotal => {
    return {
        type: 'SET_STOCK_COST_TOTAL',
        payload: data
    }
}
const setStockLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_STOCK_COST_TOTAL_LOADING',
        payload: state
    }
}
const setStockErr = (state: boolean): SetBools => ({
    type: 'SET_STOCK_COST_TOTAL_ERR',
    payload: state
})

const setPurchSalesReturns = (data: PurchSalesReturns<number>[]): SetPurchSalesReturns => {
    return {
        type: 'SET_PURCH_SALES_RETURNS',
        payload: data
    }
}
const setPurchSalesRetLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_PURCH_SALES_RETURNS_LOADING',
        payload: state
    }
}
const setPurchSalesRetErr = (state: boolean): SetBools => ({
    type: 'SET_PURCH_SALE_RETURNS_ERR',
    payload: state
})


const setPurchSaleOrders = (data: PurchSaleOrders<number>[]): SetPurchSaleOrder => {
    return {
        type: 'SET_PURCH_SALE_ORDERS',
        payload: data
    }
}
const setPurchSaleOrdLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_PURCH_SALE_ORDERS_LOADING',
        payload: state
    }
}
const setPurchSaleOrdErr = (state: boolean): SetBools => ({
    type: 'SET_PURCH_SALE_ORDERS_ERR',
    payload: state
})


const setOrdCountTotalByStatus = (data: SaleOrdTotalsByStatus[]): SetSaleOrdTotalByStatus => {
    return {
        type: 'SET_SALE_ORD_TOTAL_BY_STATUS',
        payload: data
    }
}
const setOrdCountTotalLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_SALE_ORD_TOTAL_BY_STATUS_LOADING',
        payload: state
    }
}
const setOrdCountTotalErr = (state: boolean): SetBools => ({
    type: 'SET_SALE_ORD_TOTAL_BY_STATUS_ERR',
    payload: state
})


const setPaymentsReceived = (data: PaymentsReceived[]): SetPaymentsReceived => {
    return {
        type: 'SET_PAYMENTS_RECEIVED',
        payload: data
    }
}
const setPaymentsReceivedLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_PAYMENTS_RECEIVED_LOADING',
        payload: state
    }
}
const setPaymentsReceivedErr = (state: boolean): SetBools => ({
    type: 'SET_PAYMENTS_RECEIVED_ERR',
    payload: state
})


const setPaymentMade = (data: PaymentsMade[]): SetPaymentsMade => {
    return {
        type: 'SET_PAYMENTS_MADE',
        payload: data
    }
}
const setPaymentsMadeLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_PAYMENTS_MADE_LOADING',
        payload: state
    }
}
const setPaymentsMadeErr = (state: boolean): SetBools => ({
    type: 'SET_PAYMENTS_MADE_ERR',
    payload: state
})


const setCreditsFromSale = (data: CreditsFromSale[]): SetCreditsFromSale => {
    return {
        type: 'SET_CREDITS_FROM_SALE',
        payload: data
    }
}
const setCreditsLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_CREDITS_FROM_SALE_LOADING',
        payload: state
    }
}
const setCreditsErr = (state: boolean): SetBools => ({
    type: 'SET_CREDITS_FROM_SALE_ERR',
    payload: state
})



const setDebtsFromPurchase = (data: DebtsFromPurchase[]): SetDebtsFromPurchase => {
    return {
        type: 'SET_DEBTS_FROM_PURCHASE',
        payload: data
    }
}
const setDebtsLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_DEBTS_FROM_PURCHASE_LOADING',
        payload: state
    }
}
const setDebtsErr = (state: boolean): SetBools => ({
    type: 'SET_DEBTS_FROM_PURCHASE_ERR',
    payload: state
})


const setEmployeesBalance = (data: EmployeesBalance[]): SetEmployeesBalance => {
    return {
        type: 'SET_EMPLOYEES_BALANCE',
        payload: data
    }
}
const setEmployeesBalanceLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_EMPLOYEES_BALANCE_LOADING',
        payload: state
    }
}
const setEmployeesBalanceErr = (state: boolean): SetBools => ({
    type: 'SET_EMPLOYEES_BALANCE_ERR',
    payload: state
})


const setExpensesAmount = (data: ExpensesAmount[]): SetExpensesAmount => {
    return {
        type: 'SET_EXPENSES_AMOUNT',
        payload: data
    }
}
const setExpensesLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_EXPENSES_AMOUNT_LOADING',
        payload: state
    }
}
const setExpensesErr = (state: boolean): SetBools => ({
    type: 'SET_EXPENSES_AMOUNT_ERR',
    payload: state
})

const setCashesAmount = (data: CashesAmount[]): SetCashesAmount => {
    return {
        type: 'SET_CASHES_AMOUNT',
        payload: data
    }
}
const setCashesLoading = (state: boolean): SetBools => {
    return {
        type: 'SET_CASHES_AMOUNT_LOADING',
        payload: state
    }
}
const setCashesErr = (state: boolean): SetBools => ({
    type: 'SET_CASHES_AMOUNT_ERR',
    payload: state
})
const setDashboardSettings = ({task, bool}:{task: TaskType, bool?: boolean}): SetDashboardSettings => ({
    type: 'SET_DASHBOARD_SETTINGS', 
    payload: {
        task, bool: bool ?? false
    }
})

const exportDefault = {
    ///FETCH_DATA/DETAILS TABLE OPEN STATE/DETAILS LOADING STATE
    fetchData,liberateFetcher,  setDashboardSettings,
    setDetails, openDtlTbl, setDetailsLoading, setDashboardTable,
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