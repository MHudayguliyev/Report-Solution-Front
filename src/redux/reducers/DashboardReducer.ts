import { AnyAction } from "redux";
import {InitialDashboardState} from '../types/DashboardTypes'

export const initialState: InitialDashboardState<boolean> = {
    purchSaleOrders: [],
    saleOrdTotalsByStatus: [],
    purchSalesReturns: [],
    stockCostTotal: [],
    paymentsReceived: [],
    paymentsMade: [],
    creditsFromSale: [],
    debtsFromPurchase: [],
    employeesBalance: [],
    expensesAmount: [],
    cashesAmount: [],
    //LOADING/ERROR
    stockCostLoading: false,
    purchSaleRetLoading: false,
    purchSaleOrdLoading: false,
    saleOrdTotalLoading: false,
    paymentsReceivedLoading: false,
    paymentsMadeLoading: false,
    creditsLoading: false,
    debtsLoading: false,
    employeesBalanceLoading: false,
    expensesLoding: false,
    cashesLoading: false,
    stockCostErr: false,

    purchSaleRetErr: false,
    purchSaleOrdErr: false,
    saleOrdTotalErr: false,
    paymentsReceivedErr: false,
    paymentsMadeErr: false,
    creditsErr: false,
    debtsErr: false,
    employeesBalanceErr: false,
    expensesErr: false,
    cashesErr: false,
    
    fetchData: {details: false, refetch: false},
    details: [], 
    isDtlTblOpen: false, 
    detailsLoading: false, 

}


const DashboardReducer = (state=initialState, action:AnyAction) => {
    switch(action.type) {
        case 'FETCH_DATA':
            const {state: condition, key} = action.payload
            return {
                ...state, 
                fetchData: {...state.fetchData, [key as string]: condition as boolean}
            }
        case 'LIBERATE_FETCHER': 
            return {
                ...state, fetchData: {...state.fetchData, details: false, refetch: false}
            }
        case 'SET_DASHBOARD_SETTINGS': 
            const {task, bool} = action.payload
            if(task==='load'){
                return {
                    ...state, 
                    stockCostLoading: bool,purchSaleRetLoading: bool, 
                    purchSaleOrdLoading: bool, saleOrdTotalLoading: bool, 
                    paymentsReceivedLoading: bool, paymentsMadeLoading: bool, 
                    creditsLoading: bool, debtsLoading: bool, employeesBalanceLoading: bool, 
                    expensesLoding: bool, cashesLoading: bool,
                }
            }else if(task==='emptify'){
                return {
                    ...state, 
                    purchSaleOrders: [], saleOrdTotalsByStatus: [], 
                    purchSalesReturns:[], stockCostTotal: [], 
                    paymentsReceived: [], paymentsMade:[], 
                    creditsFromSale: [], debtsFromPurchase: [], 
                    employeesBalance: [], expensesAmount:[], cashesAmount: [],
                    details: []
                }
            }else if(task==='both'){
                return {
                    ...state, 
                    stockCostLoading: bool,purchSaleRetLoading: bool, 
                    purchSaleOrdLoading: bool, saleOrdTotalLoading: bool, 
                    paymentsReceivedLoading: bool, paymentsMadeLoading: bool, 
                    creditsLoading: bool, debtsLoading: bool, employeesBalanceLoading: bool, 
                    expensesLoding: bool, cashesLoading: bool, purchSaleRetErr:bool, 
                    purchSaleOrdErr:bool, saleOrdTotalErr:bool, paymentsReceivedErr:bool, 
                    paymentsMadeErr:bool, creditsErr:bool, debtsErr:bool, employeesBalanceErr:bool, 
                    expensesErr: bool, cashesErr:bool, detailsLoading: bool,
                    purchSaleOrders: [], saleOrdTotalsByStatus: [], 
                    purchSalesReturns:[], stockCostTotal: [], 
                    paymentsReceived: [], paymentsMade:[], 
                    creditsFromSale: [], debtsFromPurchase: [], 
                    employeesBalance: [], expensesAmount:[], cashesAmount: [], details: []
                }
            }else 
                return state

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
                stockCostLoading: action.payload
            }
        case 'SET_STOCK_COST_TOTAL_ERR': 
            return {
                ...state, 
                stockCostErr: action.payload
            }

        case 'SET_PURCH_SALES_RETURNS_LOADING': 
            return {
                ...state, 
                purchSaleRetLoading: action.payload
            }
        case 'SET_PURCH_SALE_RETURNS_ERR': 
            return {
                ...state, 
                purchSaleRetErr: action.payload
            }


        case 'SET_PURCH_SALE_ORDERS_LOADING': 
            return {
                ...state, 
                purchSaleOrdLoading: action.payload
            }
        case 'SET_PURCH_SALE_ORDERS_ERR': 
            return {
                ...state, 
                purchSaleOrdErr: action.payload
            }


        case 'SET_SALE_ORD_TOTAL_BY_STATUS_LOADING': 
            return {
                ...state, 
                saleOrdTotalLoading: action.payload
            }
        case 'SET_SALE_ORD_TOTAL_BY_STATUS_ERR': 
            return {
                ...state, 
                saleOrdTotalErr: action.payload
            }
            

        case 'SET_PAYMENTS_RECEIVED_ERR': 
            return {
                ...state, 
                paymentsReceivedErr: action.payload
            }
        case 'SET_PAYMENTS_RECEIVED_LOADING': 
            return {
                ...state, 
                paymentsReceivedLoading: action.payload
            }


        case 'SET_PAYMENTS_MADE_LOADING': 
            return {
                ...state, 
                paymentsMadeLoading: action.payload
            }
        case 'SET_PAYMENTS_MADE_ERR': 
            return {
                ...state, 
                paymentsMadeErr: action.payload
            }


        case 'SET_CREDITS_FROM_SALE_LOADING': 
            return {
                ...state, 
                creditsLoading: action.payload
            }
        case 'SET_CREDITS_FROM_SALE_ERR': 
            return {
                ...state, 
                creditsErr: action.payload
            }


        case 'SET_DEBTS_FROM_PURCHASE_LOADING': 
            return {
                ...state, 
                debtsLoading: action.payload
            }
        case 'SET_DEBTS_FROM_PURCHASE_ERR': 
            return {
                ...state, 
                debtsErr: action.payload
            }


        case 'SET_EMPLOYEES_BALANCE_LOADING': 
            return {
                ...state, 
                employeesBalanceLoading: action.payload
            }
        case 'SET_EMPLOYEES_BALANCE_ERR': 
            return {
                ...state, 
                employeesBalanceErr: action.payload
            }


        case 'SET_EXPENSES_AMOUNT_LOADING': 
            return {
                ...state, 
                expensesLoding: action.payload
            }
        case 'SET_EXPENSES_AMOUNT_ERR': 
            return {
                ...state, 
                expensesErr: action.payload
            }

            
        case 'SET_CASHES_AMOUNT_LOADING': 
            return {
                ...state, 
                cashesLoading: action.payload
            }
        case 'SET_CASHES_AMOUNT_ERR': 
            return {
                ...state, 
                cashesErr: action.payload
            }
        case 'SET_PURCH_SALE_ORDERS': 
            return {
                ...state, 
                purchSaleOrders: action.payload
            }
        case 'SET_SALE_ORD_TOTAL_BY_STATUS': 
            return {
                ...state, 
                saleOrdTotalsByStatus: action.payload
            } 
        case 'SET_PURCH_SALES_RETURNS': 
            return {
                ...state, 
                purchSalesReturns: action.payload
            }
        case 'SET_STOCK_COST_TOTAL': 
            return {
                ...state, 
                stockCostTotal: action.payload
            }   
        case 'SET_PAYMENTS_RECEIVED': 
            return {
                ...state, 
                paymentsReceived: action.payload
            }  
        case 'SET_PAYMENTS_MADE': 
            return {
                ...state, 
                paymentsMade: action.payload
            } 
        case 'SET_CREDITS_FROM_SALE': 
            return {
                ...state, 
                creditsFromSale: action.payload
            } 
        case 'SET_DEBTS_FROM_PURCHASE': 
            return {
                ...state, 
                debtsFromPurchase: action.payload
            } 
        case 'SET_EMPLOYEES_BALANCE': 
            return {
                ...state, 
                employeesBalance: action.payload
            } 
        case 'SET_EXPENSES_AMOUNT': 
            return {
                ...state, 
                expensesAmount: action.payload
            } 
        case 'SET_CASHES_AMOUNT': 
            return {
                ...state, 
                cashesAmount: action.payload
            } 
        default: 
            return state
    }
}

export default DashboardReducer
