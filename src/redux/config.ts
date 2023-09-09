import storage from 'redux-persist/lib/storage';
const dashWhiteList = [
    'purchSaleOrders','saleOrdTotalsByStatus','purchSalesReturns',
    'stockCostTotal','paymentsReceived','paymentsMade','creditsFromSale',
    'debtsFromPurchase','employeesBalance','expensesAmount','cashesAmount',
]
export const dashboardCfg = {
    key: 'dashboard',
    storage,
    whitelist: dashWhiteList
}
export const TopnavbarCfg = {
    key: 'nav', storage, 
    whitelist: [
        'switched', 'compareSwitch', 'autoRefreshActivated', 'timeToRefetch', 'dashboardDate',
        'receiver', 'reportStartDate', 'reportEndDate'
    ]
}
export const AuthCfg = {
    key:'auth', storage,
    whitelist: ['isAuthorized']
}