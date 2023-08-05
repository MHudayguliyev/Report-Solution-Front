import { DateType, Scalars } from "."

export type FetcherType = "refetch" | "details"
export type TaskType = "load" | "emptify" | "both"

/// aluw we satuw harytlary
export interface PurchOrders {
    purch_ord_count: Scalars['Number'],
    purch_ord_amount: Scalars['Number'], 
    purch_ord_nettotal: Scalars['Number']
}
export interface SaleOrders {
    sale_ord_count: Scalars['Number'],
    sale_ord_amount: Scalars['Number'], 
    sale_ord_nettotal: Scalars['Number']
}
/// aluw-satuw-gaytarma
export interface Purches {
    purch_inv_count: Scalars['Number'], 
    purch_mat_amount: Scalars['Number'], 
    purch_nettotal: Scalars['Number']
}
export interface RetPurches {
    ret_of_purch_inv_count: Scalars['Number'], 
    ret_of_purch_mat_amount: Scalars['Number'], 
    ret_of_purch_nettotal: Scalars['Number']
}
export interface Sales {
    sale_inv_count: Scalars['Number'], 
    sales_mat_amount: Scalars['Number'], 
    sales_nettotal: Scalars['Number']
}
export interface RetSold {
    ret_of_sold_inv_count: Scalars['Number'], 
    ret_of_sold_mat_amount: Scalars['Number'], 
    ret_of_sold_nettotal: Scalars['Number']
}


export interface StockCostTotal{
    stock_cost_total: DateType
}
export interface PurchSalesReturns<N>{
    purch_nettotal: N,
    return_of_purch: N, 
    sale_nettotal: N, 
    return_of_sold: N
}
export interface PurchSaleOrders<N>{
    purch_ord_nettotal:N,
    sale_ord_nettotal:N
}
export interface SaleOrdTotalsByStatus{
    ord_status_id: Scalars['Number'],
    ord_status_name: Scalars['String'], 
    sale_ord_count: Scalars['Number'], 
    sale_ord_mat_amount: Scalars['Number'], 
    sale_ord_nettotal: Scalars['Number']
}
export interface PaymentsReceived {
    payments_received: Scalars['Number']
}
export interface PaymentsMade {
    payments_made: Scalars['Number']
}

export interface CreditsFromSale {
    credits_from_sale: Scalars['Number' | 'String'], 
}
export interface DebtsFromPurchase {
    debts_from_purchase: Scalars['Number'],
}
export interface EmployeesBalance {
    employees_balance: Scalars['Number'],
}
export interface ExpensesAmount {
    expenses_amount: Scalars['Number']
}
export interface CashesAmount {
    cashes_amount: Scalars['Number'], 
}
export interface AllCashBalance {
    acc_card_balance: Scalars['Number'],
    acc_card_id: Scalars['Number'], 
    acc_type_name:Scalars['Number' | 'String'], 
    acc_card_name: Scalars['String' | 'Undefined']
}

export interface InitialDashboardState<T> {
    stockCostTotal: StockCostTotal[],
    purchSalesReturns: PurchSalesReturns<number>[],
    purchSaleOrders: PurchSaleOrders<number>[],
    saleOrdTotalsByStatus: SaleOrdTotalsByStatus[],
    paymentsReceived: PaymentsReceived[],
    paymentsMade: PaymentsMade[],
    creditsFromSale: CreditsFromSale[],
    debtsFromPurchase: DebtsFromPurchase[],
    employeesBalance: EmployeesBalance[],
    expensesAmount: ExpensesAmount[],
    cashesAmount: CashesAmount[], 
    /// LOADING
    stockCostLoading: T,
    purchSaleRetLoading: T,
    purchSaleOrdLoading: T,
    saleOrdTotalLoading: T,
    paymentsReceivedLoading: T,
    paymentsMadeLoading: T,
    creditsLoading: T,
    debtsLoading: T,
    employeesBalanceLoading: T,
    expensesLoding: T,
    cashesLoading: T,
    //// ERROR
    stockCostErr: T,
    purchSaleRetErr: T,
    purchSaleOrdErr: T,
    saleOrdTotalErr: T,
    paymentsReceivedErr: T,
    paymentsMadeErr: T,
    creditsErr: T,
    debtsErr: T,
    employeesBalanceErr: T,
    expensesErr: T,
    cashesErr: T,
    details: Scalars["Any"], 
    isDtlTblOpen: Scalars['Boolean'],
    detailsLoading: Scalars['Boolean'],
    fetchData: {
        details: Scalars['Boolean'],
        refetch: Scalars['Boolean']
    },
}

//// all the set actions
export interface SetStockCostTotal {
    type: 'SET_STOCK_COST_TOTAL'
    payload: StockCostTotal[]
}
export interface SetPurchSalesReturns {
    type: 'SET_PURCH_SALES_RETURNS'
    payload: PurchSalesReturns<number>[]
}
export interface SetPurchSaleOrder {
    type: 'SET_PURCH_SALE_ORDERS'
    payload: PurchSaleOrders<number>[]
}
export interface SetSaleOrdTotalByStatus {
    type: 'SET_SALE_ORD_TOTAL_BY_STATUS'
    payload: SaleOrdTotalsByStatus[]
}
export interface SetPaymentsReceived {
    type: 'SET_PAYMENTS_RECEIVED'
    payload: PaymentsReceived[]
}
export interface SetPaymentsMade {
    type: 'SET_PAYMENTS_MADE'
    payload: PaymentsMade[]
}
export interface SetCreditsFromSale {
    type: 'SET_CREDITS_FROM_SALE'
    payload: CreditsFromSale[]
}
export interface SetDebtsFromPurchase {
    type: 'SET_DEBTS_FROM_PURCHASE'
    payload: DebtsFromPurchase[]
}
export interface SetEmployeesBalance {
    type: 'SET_EMPLOYEES_BALANCE'
    payload: EmployeesBalance[]
}
export interface SetExpensesAmount {
    type: 'SET_EXPENSES_AMOUNT'
    payload: ExpensesAmount[]
}
export interface SetCashesAmount {
    type: 'SET_CASHES_AMOUNT'
    payload: CashesAmount[]
}
export interface SetDashboardSettings {
    type: 'SET_DASHBOARD_SETTINGS'
    payload: {
        task: TaskType
        bool?: Scalars['Boolean']
    }
}

export interface SetBools {
    type: Scalars["String"]
    payload: Scalars['Boolean']
}
export interface SetFetcher {
    type: 'FETCH_DATA', 
    payload: {
        state: Scalars['Boolean']
        key:FetcherType
    }
}
export interface LiberateFetcher {
    type: 'LIBERATE_FETCHER'
}
export interface SetDetails {
    type: 'SET_DETAILS', 
    payload: Scalars['Any']
}
export interface OpenDtlTable {
    type: 'OPEN_DTL_TBL'
    state: Scalars['Boolean']
}
export interface SetDetailsLoading {
    type: 'SET_DETAILS_LOADING'
    state: Scalars['Boolean']
}