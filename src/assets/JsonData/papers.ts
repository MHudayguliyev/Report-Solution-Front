export const papers = [
    // dashboard //
    'purch_sale_orders',
    'purch_sales_returns',
    'stock_cost_total',
    'payments_received_made',
    'credits_debts_empl_balance',
    'expenses_cashes_amount',
    'sale_ord_totals_by_status', 
    // report //
    'mat_stock_amount_cost',
    'mat_gross_profitability',
    // forecast //
]

const nullTypeId = null
export const list = [
    {
        endPoint: papers[0],
        type_id: nullTypeId
    },{
        endPoint: papers[6],
        type_id: nullTypeId
    },{
        endPoint: papers[1],
        type_id: nullTypeId 
    },{
        endPoint: papers[2],
        type_id: nullTypeId  
    },
    {
        endPoint: papers[3],
        type_id: [11, 12]  
    },{
        endPoint: papers[4],
        type_id: [2,1,4]  
    },{
        endPoint: papers[5],
        type_id: [25,8]      
    }
]     
 
 