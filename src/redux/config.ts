import storage from 'redux-persist/lib/storage';
const dashWhiteList = [
    'switched', 'autoRefreshActivated', 'timeToRefetch', 'date',
    'purchSaleOrders','saleOrdTotalsByStatus','purchSalesReturns',
    'stockCostTotal','paymentsReceived','paymentsMade','creditsFromSale',
    'debtsFromPurchase','employeesBalance','expensesAmount','cashesAmount','receiver'
]

export const dashboardCfg = {
    key: 'dashboard',
    storage,
    whitelist: dashWhiteList
}
export const reportCfg = {
    key: 'report',storage,
    whitelist: ['startDate', 'endDate']
}