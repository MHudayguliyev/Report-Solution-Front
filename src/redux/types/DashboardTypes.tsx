import { UserFirms, UserFirmsList } from "@app/api/Types/queryReturnTypes/UserFirms"

/// aluw we satuw harytlary
export interface PurchOrders {
    purch_ord_count: number,
    purch_ord_amount: number, 
    purch_ord_nettotal: number
}
export interface SaleOrders {
    sale_ord_count: number,
    sale_ord_amount: number, 
    sale_ord_nettotal: number
}
/// aluw-satuw-gaytarma
export interface Purches {
    purch_inv_count: number, 
    purch_mat_amount: number, 
    purch_nettotal: number
}
export interface RetPurches {
    ret_of_purch_inv_count: number, 
    ret_of_purch_mat_amount: number, 
    ret_of_purch_nettotal: number
}
export interface Sales {
    sale_inv_count: number, 
    sales_mat_amount: number, 
    sales_nettotal: number
}
export interface RetSold {
    ret_of_sold_inv_count: number, 
    ret_of_sold_mat_amount: number, 
    ret_of_sold_nettotal: number
}


export interface StockCostTotal{
    stock_cost_total: Date | string
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
    ord_status_id: number,
    ord_status_name: string, 
    sale_ord_count: number, 
    sale_ord_mat_amount: number, 
    sale_ord_nettotal: number
}
export interface PaymentsReceived {
    payments_received: number
}
export interface PaymentsMade {
    payments_made: number
}

export interface CreditsFromSale {
    credits_from_sale: number | string, 
}
export interface DebtsFromPurchase {
    debts_from_purchase: number,
}
export interface EmployeesBalance {
    employees_balance: number,
}
export interface ExpensesAmount {
    expenses_amount: number
}
export interface CashesAmount {
    cashes_amount: number, 
}
export interface AllCashBalance {
    acc_card_balance: number,
    acc_card_id: number, 
    acc_type_name: number| string, 
    acc_card_name: string | undefined
}

export type StorageData = {

}

export type UsualType = {
    label: string, 
    value: string, 
    connected: boolean,
}
// export type ReceiverType ={}

///// initial dashboard type
export interface InitialDashboardState<T> extends StorageData {
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
    ///RECEIVER/DATE...
    receiver: UsualType

    autoRefreshActivated: boolean,
    timeToRefetch: string | number,
    date: Date | string,
    renewData: boolean, 
    switched: boolean,
    details: any, 
    isDtlTblOpen: boolean,
    detailsLoading: boolean,
    firmsList: UserFirmsList<string>[],
    fetchData: {
        details: boolean,
        refetch: boolean
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
export interface SetAllCashBalance {
    type: 'SET_ALL_CASH_BALANCE'
    payload: AllCashBalance[]
}
