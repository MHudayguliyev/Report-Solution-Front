import { AnyAction } from "redux";
import {InitialDashboardState} from '../types/DashboardTypes'
import { DataKindType } from '@app/redux/types/DashboardTypes';

export const initialState: InitialDashboardState= {
    purchSaleOrders: {initialData: [], dataToCompare: []},
    saleOrdTotalsByStatus: {initialData: [], dataToCompare: []},
    purchSalesReturns: {initialData: [], dataToCompare: []},
    stockCostTotal: {initialData: [], dataToCompare: []},
    paymentsReceived: {initialData: [], dataToCompare: []},
    paymentsMade: {initialData: [], dataToCompare: []},
    creditsFromSale: {initialData: [], dataToCompare: []},
    debtsFromPurchase: {initialData: [], dataToCompare: []},
    employeesBalance: {initialData: [], dataToCompare: []},
    expensesAmount: {initialData: [], dataToCompare: []},
    cashesAmount: {initialData: [], dataToCompare: []},
    //LOADING/ERROR
    stockCostLoading: {initialData: false, dataToCompare: false},
    purchSaleRetLoading: {initialData: false, dataToCompare: false},
    purchSaleOrdLoading: {initialData: false, dataToCompare: false},
    saleOrdTotalLoading: {initialData: false, dataToCompare: false},
    paymentsReceivedLoading: {initialData: false, dataToCompare: false},
    paymentsMadeLoading: {initialData: false, dataToCompare: false},
    creditsLoading: {initialData: false, dataToCompare: false},
    debtsLoading: {initialData: false, dataToCompare: false},
    employeesBalanceLoading: {initialData: false, dataToCompare: false},
    expensesLoding: {initialData: false, dataToCompare: false},
    cashesLoading: {initialData: false, dataToCompare: false},

    stockCostErr: {initialData: false, dataToCompare: false},
    purchSaleRetErr: {initialData: false, dataToCompare: false},
    purchSaleOrdErr: {initialData: false, dataToCompare: false},
    saleOrdTotalErr: {initialData: false, dataToCompare: false},
    paymentsReceivedErr: {initialData: false, dataToCompare: false},
    paymentsMadeErr: {initialData: false, dataToCompare: false},
    creditsErr: {initialData: false, dataToCompare: false},
    debtsErr: {initialData: false, dataToCompare: false},
    employeesBalanceErr: {initialData: false, dataToCompare: false},
    expensesErr: {initialData: false, dataToCompare: false},
    cashesErr: {initialData: false, dataToCompare: false},
    
    fetchData: {details: false, refetch: false},
    details: [], 
    isDtlTblOpen: false, 
    detailsLoading: false, 
    dataType: 'initialData'
}


const DashboardReducer = (state=initialState, action:AnyAction) => {
    switch(action.type) {
        case 'SET_DASHBOARD_TABLE': 
            return {
                ...state, 
                details: action.payload.data, 
                detailsLoading: action.payload.loading
            }
        case 'SET_DATA_TYPE': 
            return {
                ...state, 
                dataType: action.payload
            }
        case 'FETCH_DATA':
            return {
                ...state, 
                fetchData: {...state.fetchData, [action.payload.key as string]: action.payload.key as boolean}
            }
        case 'LIBERATE_FETCHER': 
            return {
                ...state, fetchData: {...state.fetchData, details: false, refetch: false}
            }
        case 'SET_DASHBOARD_SETTINGS': 
            const {task, bool, dataType} = action.payload
            if(task==='load'){
                return {
                    ...state, 
                    stockCostLoading: {...state.stockCostLoading, [dataType as string]: bool},
                    purchSaleRetLoading: {...state.purchSaleRetLoading, [dataType as string]: bool}, 
                    purchSaleOrdLoading: {...state.purchSaleRetLoading, [dataType as string]: bool},  
                    saleOrdTotalLoading: {...state.saleOrdTotalLoading, [dataType as string]: bool},  
                    paymentsReceivedLoading: {...state.paymentsReceivedLoading, [dataType as string]: bool},  
                    paymentsMadeLoading: {...state.paymentsMadeLoading, [dataType as string]: bool},  
                    creditsLoading: {...state.creditsLoading, [dataType as string]: bool},  
                    debtsLoading: {...state.debtsLoading, [dataType as string]: bool},  
                    employeesBalanceLoading: {...state.employeesBalanceLoading, [dataType as string]: bool},  
                    expensesLoding: {...state.expensesLoding, [dataType as string]: bool},  
                    cashesLoading: {...state.cashesLoading, [dataType as string]: bool}, 
                }
            }else if(task==='emptify'){
                return {
                    ...state, 
                    purchSaleOrders: {...state.purchSaleOrders, [dataType as string]: []}, 
                    saleOrdTotalsByStatus:  {...state.saleOrdTotalsByStatus, [dataType as string]: []}, 
                    purchSalesReturns: {...state.purchSalesReturns, [dataType as string]: []}, 
                    stockCostTotal:  {...state.stockCostTotal, [dataType as string]: []}, 
                    paymentsReceived:  {...state.paymentsReceived, [dataType as string]: []}, 
                    paymentsMade: {...state.paymentsMade, [dataType as string]: []}, 
                    creditsFromSale:  {...state.creditsFromSale, [dataType as string]: []}, 
                    debtsFromPurchase:  {...state.debtsFromPurchase, [dataType as string]: []}, 
                    employeesBalance:  {...state.employeesBalance, [dataType as string]: []}, 
                    expensesAmount: {...state.expensesAmount, [dataType as string]: []}, 
                    cashesAmount:  {...state.cashesAmount, [dataType as string]: []}, 
                    details: []
                }
            }else if(task==='both'){
                return {
                    ...state, 
                    stockCostLoading: {...state.stockCostLoading, initialData: bool, dataToCompare: bool},
                    purchSaleRetLoading: {...state.purchSaleRetLoading, initialData: bool, dataToCompare: bool}, 
                    purchSaleOrdLoading: {...state.purchSaleOrdLoading, initialData: bool, dataToCompare: bool}, 
                    saleOrdTotalLoading: {...state.saleOrdTotalLoading, initialData: bool, dataToCompare: bool}, 
                    paymentsReceivedLoading: {...state.paymentsReceivedLoading, initialData: bool, dataToCompare: bool}, 
                    paymentsMadeLoading: {...state.paymentsMadeLoading, initialData: bool, dataToCompare: bool}, 
                    creditsLoading: {...state.creditsLoading, initialData: bool, dataToCompare: bool}, 
                    debtsLoading: {...state.debtsLoading, initialData: bool, dataToCompare: bool}, 
                    employeesBalanceLoading: {...state.employeesBalanceLoading, initialData: bool, dataToCompare: bool}, 
                    expensesLoding: {...state.expensesLoding, initialData: bool, dataToCompare: bool}, 
                    cashesLoading: {...state.cashesLoading, initialData: bool, dataToCompare: bool}, 
                    purchSaleRetErr:{...state.purchSaleRetErr, initialData: bool, dataToCompare: bool}, 
                    purchSaleOrdErr:{...state.purchSaleOrdErr, initialData: bool, dataToCompare: bool}, 
                    saleOrdTotalErr:{...state.saleOrdTotalErr, initialData: bool, dataToCompare: bool}, 
                    paymentsReceivedErr:{...state.paymentsReceivedErr, initialData: bool, dataToCompare: bool}, 
                    paymentsMadeErr:{...state.paymentsMadeErr, initialData: bool, dataToCompare: bool}, 
                    creditsErr:{...state.creditsErr, initialData: bool, dataToCompare: bool}, 
                    debtsErr:{...state.debtsErr, initialData: bool, dataToCompare: bool}, 
                    employeesBalanceErr:{...state.employeesBalanceErr, initialData: bool, dataToCompare: bool}, 
                    expensesErr: {...state.expensesErr, initialData: bool, dataToCompare: bool}, 
                    cashesErr:{...state.cashesErr, initialData: bool, dataToCompare: bool}, detailsLoading: bool, 

                    purchSaleOrders: {...state.purchSaleOrders, initialData: [], dataToCompare: []}, 
                    saleOrdTotalsByStatus:  {...state.saleOrdTotalsByStatus, initialData: [], dataToCompare: []}, 
                    purchSalesReturns: {...state.purchSalesReturns, initialData: [], dataToCompare: []}, 
                    stockCostTotal:  {...state.stockCostTotal, initialData: [], dataToCompare: []}, 
                    paymentsReceived:  {...state.paymentsReceived, initialData: [], dataToCompare: []}, 
                    paymentsMade: {...state.paymentsMade, initialData: [], dataToCompare: []}, 
                    creditsFromSale:  {...state.creditsFromSale, initialData: [], dataToCompare: []}, 
                    debtsFromPurchase:  {...state.debtsFromPurchase, initialData: [], dataToCompare: []}, 
                    employeesBalance:  {...state.employeesBalance, initialData: [], dataToCompare: []}, 
                    expensesAmount: {...state.expensesAmount, initialData: [], dataToCompare: []}, 
                    cashesAmount:  {...state.cashesAmount, initialData: [], dataToCompare: []}, 
                    details: [] // 
                }
            }
        case 'OPEN_DTL_TBL':
            return {
                ...state, isDtlTblOpen: action.state
            }
        case 'SET_DETAILS':
            return {
                ...state, details: action.payload
            }
        case 'SET_DETAILS_LOADING': 
            return {
                ...state, detailsLoading: action.state
            }
        case 'SET_STOCK_COST_TOTAL_LOADING': 
            return {
                ...state, 
                stockCostLoading: {...state.stockCostLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_STOCK_COST_TOTAL_ERR': 
            return {
                ...state, 
                stockCostErr: {...state.stockCostErr, [action.payload.key as string]: action.payload.state}
            }

        case 'SET_PURCH_SALES_RETURNS_LOADING': 
            return {
                ...state, 
                purchSaleRetLoading: {...state.purchSaleRetLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PURCH_SALE_RETURNS_ERR': 
            return {
                ...state, 
                purchSaleRetErr: {...state.purchSaleRetErr, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PURCH_SALE_ORDERS_LOADING': 
            return {
                ...state, 
                purchSaleOrdLoading: {...state.purchSaleOrdLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PURCH_SALE_ORDERS_ERR': 
            return {
                ...state, 
                purchSaleOrdErr: {...state.purchSaleOrdErr, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_SALE_ORD_TOTAL_BY_STATUS_LOADING': 
            return {
                ...state, 
                saleOrdTotalLoading: {...state.saleOrdTotalLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_SALE_ORD_TOTAL_BY_STATUS_ERR': 
            return {
                ...state, 
                saleOrdTotalErr: {...state.saleOrdTotalErr, [action.payload.key as string]: action.payload.state}
            }
            

        case 'SET_PAYMENTS_RECEIVED_ERR': 
            return {
                ...state, 
                paymentsReceivedErr: {...state.paymentsReceivedErr, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PAYMENTS_RECEIVED_LOADING': 
            return {
                ...state, 
                paymentsReceivedLoading: {...state.paymentsReceivedLoading, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_PAYMENTS_MADE_LOADING': 
            return {
                ...state, 
                paymentsMadeLoading: {...state.paymentsMadeLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PAYMENTS_MADE_ERR': 
            return {
                ...state, 
                paymentsMadeErr: {...state.paymentsMadeErr, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_CREDITS_FROM_SALE_LOADING': 
            return {
                ...state, 
                creditsLoading: {...state.creditsLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_CREDITS_FROM_SALE_ERR': 
            return {
                ...state, 
                creditsErr: {...state.creditsErr, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_DEBTS_FROM_PURCHASE_LOADING': 
            return {
                ...state, 
                debtsLoading: {...state.debtsLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_DEBTS_FROM_PURCHASE_ERR': 
            return {
                ...state, 
                debtsErr:  {...state.debtsErr, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_EMPLOYEES_BALANCE_LOADING': 
            return {
                ...state, 
                employeesBalanceLoading: {...state.employeesBalanceLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_EMPLOYEES_BALANCE_ERR': 
            return {
                ...state, 
                employeesBalanceErr: {...state.employeesBalanceErr, [action.payload.key as string]: action.payload.state}
            }


        case 'SET_EXPENSES_AMOUNT_LOADING': 
            return {
                ...state, 
                expensesLoding: {...state.expensesLoding, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_EXPENSES_AMOUNT_ERR': 
            return {
                ...state, 
                expensesErr: {...state.expensesErr, [action.payload.key as string]: action.payload.state}
            }

            
        case 'SET_CASHES_AMOUNT_LOADING': 
            return {
                ...state, 
                cashesLoading: {...state.cashesLoading, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_CASHES_AMOUNT_ERR': 
            return {
                ...state, 
                cashesErr: {...state.cashesErr, [action.payload.key as string]: action.payload.state}
            }
        case 'SET_PURCH_SALE_ORDERS': 
            return {
                ...state, 
                purchSaleOrders: {...state.purchSaleOrders, [action.payload.key as string]: action.payload.data}
            }
        case 'SET_SALE_ORD_TOTAL_BY_STATUS': 
            return {
                ...state, 
                saleOrdTotalsByStatus: {...state.saleOrdTotalsByStatus, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_PURCH_SALES_RETURNS': 
            return {
                ...state, 
                purchSalesReturns: {...state.purchSalesReturns, [action.payload.key as string]: action.payload.data}
            }
        case 'SET_STOCK_COST_TOTAL': 
            return {
                ...state, 
                stockCostTotal: {...state.stockCostTotal, [action.payload.key as string]: action.payload.data}
            }   
        case 'SET_PAYMENTS_RECEIVED': 
            return {
                ...state, 
                paymentsReceived: {...state.paymentsReceived, [action.payload.key as string]: action.payload.data}
            }  
        case 'SET_PAYMENTS_MADE': 
            return {
                ...state, 
                paymentsMade: {...state.paymentsMade, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_CREDITS_FROM_SALE': 
            return {
                ...state, 
                creditsFromSale: {...state.creditsFromSale, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_DEBTS_FROM_PURCHASE': 
            return {
                ...state, 
                debtsFromPurchase: {...state.debtsFromPurchase, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_EMPLOYEES_BALANCE': 
            return {
                ...state, 
                employeesBalance: {...state.employeesBalance, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_EXPENSES_AMOUNT': 
            return {
                ...state, 
                expensesAmount: {...state.expensesAmount, [action.payload.key as string]: action.payload.data}
            } 
        case 'SET_CASHES_AMOUNT': 
            return {
                ...state, 
                cashesAmount: {...state.cashesAmount, [action.payload.key as string]: action.payload.data}
            } 
        default: 
            return state
    }
}

export default DashboardReducer
