import { DateType, Scalars } from "."


export type GlobalPayloadType<T> = {
    key: T
    state: Scalars['Boolean']
}
export type GlobalPayloadDataType<T> = {
    data: T
    key: DataKindType
}
export type FetcherType = "refetch" | "details"
export type TaskType = "load" | "emptify" | "both"
export type DataKindType = "initialData" | "dataToCompare"


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
export interface DashboardDataType<T> {
    initialData: T
    dataToCompare: T 
}
export interface LoadingType {
    initialData: Scalars['Boolean']
    dataToCompare: Scalars['Boolean']
}
export interface ErrorType extends LoadingType {}

export interface InitialDashboardState {
    stockCostTotal: DashboardDataType<StockCostTotal[]>,
    purchSalesReturns: DashboardDataType<PurchSalesReturns<number>[]>,
    purchSaleOrders: DashboardDataType<PurchSaleOrders<number>[]>,
    saleOrdTotalsByStatus: DashboardDataType<SaleOrdTotalsByStatus[]>,
    paymentsReceived: DashboardDataType<PaymentsReceived[]>,
    paymentsMade: DashboardDataType<PaymentsMade[]>,
    creditsFromSale: DashboardDataType<CreditsFromSale[]>,
    debtsFromPurchase: DashboardDataType<DebtsFromPurchase[]>,
    employeesBalance: DashboardDataType<EmployeesBalance[]>,
    expensesAmount: DashboardDataType<ExpensesAmount[]>,
    cashesAmount: DashboardDataType<CashesAmount[]>, 
    /// LOADING
    stockCostLoading: LoadingType,
    purchSaleRetLoading: LoadingType,
    purchSaleOrdLoading: LoadingType,
    saleOrdTotalLoading: LoadingType,
    paymentsReceivedLoading: LoadingType,
    paymentsMadeLoading: LoadingType,
    creditsLoading: LoadingType,
    debtsLoading: LoadingType,
    employeesBalanceLoading: LoadingType,
    expensesLoding: LoadingType,
    cashesLoading: LoadingType,
    //// ERROR
    stockCostErr: ErrorType,
    purchSaleRetErr: ErrorType,
    purchSaleOrdErr: ErrorType,
    saleOrdTotalErr: ErrorType,
    paymentsReceivedErr: ErrorType,
    paymentsMadeErr: ErrorType,
    creditsErr: ErrorType,
    debtsErr: ErrorType,
    employeesBalanceErr: ErrorType,
    expensesErr: ErrorType,
    cashesErr: ErrorType,

    details: Scalars["Any"], 
    isDtlTblOpen: Scalars['Boolean'],
    detailsLoading: Scalars['Boolean'],
    fetchData: {
        details: Scalars['Boolean'],
        refetch: Scalars['Boolean']
    },
    dataType: DataKindType
}

//// all the set actions
export interface SetStockCostTotal {
    type: 'SET_STOCK_COST_TOTAL'
    payload: GlobalPayloadDataType<StockCostTotal[]>
}
export interface SetPurchSalesReturns {
    type: 'SET_PURCH_SALES_RETURNS'
    payload: GlobalPayloadDataType<PurchSalesReturns<number>[]>
}
export interface SetPurchSaleOrder {
    type: 'SET_PURCH_SALE_ORDERS'
    payload: GlobalPayloadDataType<PurchSaleOrders<number>[]>
}
export interface SetSaleOrdTotalByStatus {
    type: 'SET_SALE_ORD_TOTAL_BY_STATUS'
    payload: GlobalPayloadDataType<SaleOrdTotalsByStatus[]>
}
export interface SetPaymentsReceived {
    type: 'SET_PAYMENTS_RECEIVED'
    payload: GlobalPayloadDataType<PaymentsReceived[]>
}
export interface SetPaymentsMade {
    type: 'SET_PAYMENTS_MADE'
    payload: GlobalPayloadDataType<PaymentsMade[]>
}
export interface SetCreditsFromSale {
    type: 'SET_CREDITS_FROM_SALE'
    payload: GlobalPayloadDataType<CreditsFromSale[]>
}
export interface SetDebtsFromPurchase {
    type: 'SET_DEBTS_FROM_PURCHASE'
    payload: GlobalPayloadDataType<DebtsFromPurchase[]>
}
export interface SetEmployeesBalance {
    type: 'SET_EMPLOYEES_BALANCE'
    payload: GlobalPayloadDataType<EmployeesBalance[]>
}
export interface SetExpensesAmount {
    type: 'SET_EXPENSES_AMOUNT'
    payload: GlobalPayloadDataType<ExpensesAmount[]>
}
export interface SetCashesAmount {
    type: 'SET_CASHES_AMOUNT'
    payload: GlobalPayloadDataType<CashesAmount[]>
}
export interface SetDashboardSettings {
    type: 'SET_DASHBOARD_SETTINGS'
    payload: {
        task: TaskType
        bool?: Scalars['Boolean']
        dataType?: DataKindType | undefined
    }
}

export interface SetBools {
    type: Scalars["String"]
    payload: GlobalPayloadType<DataKindType>
}
export interface SetFetcher {
    type: 'FETCH_DATA', 
    payload: GlobalPayloadType<FetcherType>
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
export interface SetDashboardTable {
    type: 'SET_DASHBOARD_TABLE'
    payload: {
        data: Scalars['Any']
        loading: Scalars['Boolean']
    }
}
export interface SetDataType {
    type: 'SET_DATA_TYPE', 
    payload: DataKindType
}