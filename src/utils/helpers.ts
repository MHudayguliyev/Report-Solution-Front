import crypto from 'crypto-js'
import SocketIoClient from 'socket.io-client'
import DashboardAction from '@redux/actions/DashboardAction'
import { MaterialList } from "@app/api/Types/queryReturnTypes";


export function resetFormikValue(initValues: any, valuesToSet: any, setFieldValue: Function, setFieldTouched: Function) {
   for(let key of Object.keys(initValues)){
      setFieldValue(key, valuesToSet[key])
      setFieldTouched(key, false, false)
   }
}
export function setFormikField(field: string, value: string | number | undefined,ref: any) {
   if(ref.current)
      ref.current.setFieldValue(field, value)
}
export function delay(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
export function capitalize(str: string) {
   return str.split(' ').map(item => item[0].toUpperCase() + item.substring(1, item.length)).join(' ')
}
export function divideNumber(num: number) {
   return new Intl.NumberFormat('en-US', {maximumFractionDigits: 3}).format(num).replaceAll(',', ' ')
}
export const toRem = (value: number): string => {
   return (value / 16) + 'rem';;
}
export const setCookie = (name: string, value: string, days: number) => {
   var expires = "";
   if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
   }
   document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const getCookie = (name: string) => {
   var nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}

export const convertToValidDatePostgresqlTimestamp = (date: string) => {
   const res = date.split(/\D/);
   return `${res[2]}.${res[1]}.${res[0]} ${res[3]}:${res[4]}`
}

export const convertToValidDateForInputField = (date: string) => {
   const res = date.split(/\D/);
   return `${res[0]}-${res[1]}-${res[2]}T${res[3]}:${res[4]}`
}
export function NoneEmpty(arr: string[]) {
   let count = 0;
   for (let i=0; i <= arr.length; i++) {
      if (arr[i] !== '') count = count + 1;
   }
   return count - 1 === arr.length;
}
export const isEmpty = (value: any) => {
   if (typeof value === 'string')
      return value.trim() === ''
   else
      return isNaN(value) || value === null || value === undefined
}
export const isStrEmpty = (str: string) => {
   return (str || str.length > 0 );
}
export const CheckObjOrArrForNull = (obj_or_arr: any) =>  {
   if (obj_or_arr !== null && obj_or_arr !== undefined) {
     if (obj_or_arr instanceof Object && Object.keys(obj_or_arr).length !== 0)
       return true;
     else if (Array.isArray(obj_or_arr) && obj_or_arr.length !== 0) return true;
   }
   return false;
}
export const CheckIfArray = (arr: any) => {
   if(Array.isArray(arr) && arr.length !== 0) 
      return true
   return false
}
// export const isAccessTokenExpired = () => {
//    const accessTokenExpirationDate = new Date(localStorage.getItem('accessTokenExpiration')!);
//    const currentDate = new Date();
//    const oneMonthLater = new Date(accessTokenExpirationDate.setMonth(accessTokenExpirationDate.getMonth() + 1));
//    return currentDate > oneMonthLater;
// };

export const isSelectedMaterial = (material: MaterialList, data: MaterialList, sec:boolean = false) => {
   if(sec){
      return material.line_row_id_front === data.line_row_id_front
   }else {
      return material.row_id === data.row_id
   }
}

export const sortArray = (array: any, key: string, sortBy: string) => {
   let response: any = []
   if(array){
     if(sortBy === 'ASC'){
       response = array.slice(0)
       response.sort((a: any, b: any) => a[key] < b[key] ? 1 : -1)
       return response
     }else if(sortBy === 'DESC'){
       response = array.slice(0)
       response.sort((a: any, b: any) => a[key] > b[key] ? 1 : -1)
       return response
     }
   }
}


export const getDate = (date?: any) => {
   let startDate, endDate;
   if(!date){
      const date = new Date()
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   }else {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   }

   return {startDate, endDate}
}


export const CheckIfEqual = (arg1: number, arg2: number) => {
   return arg1 === arg2
}

export const DecryptApiData = (data: any) => {
   const bytes = crypto.AES.decrypt(data, import.meta.env.VITE_API_SECRET_KEY)
   return JSON.parse(bytes.toString(crypto.enc.Utf8))
}

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

export const ConnectToSocket = () => {
   const BASE_URL = import.meta.env.VITE_API_MODE === 'development' ? 
                     import.meta.env.VITE_API_LOCAL_SOCKET_URL : 
                     import.meta.env.VITE_API_SERVER_SOCKET_URL
   const socket = SocketIoClient(BASE_URL, {
      transports: ['websocket']
    })
    return socket
}
export interface ResponseType {
   cred: {
      name: string, 
      type_id: number | undefined 
   },
   data: any
}

export const setDashboardLoading = (dispatch: any, state: boolean) => {
   dispatch(DashboardAction.setPurchSaleOrdLoading(state))
   dispatch(DashboardAction.setOrdCountTotalLoading(state))
   dispatch(DashboardAction.setPurchSalesRetLoading(state))
   dispatch(DashboardAction.setStockLoading(state))
   dispatch(DashboardAction.setPaymentsReceivedLoading(state))
   dispatch(DashboardAction.setPaymentsMadeLoading(state))
   dispatch(DashboardAction.setDebtsLoading(state))
   dispatch(DashboardAction.setCreditsLoading(state))
   dispatch(DashboardAction.setEmployeesBalanceLoading(state))
   dispatch(DashboardAction.setCashesLoading(state))
   dispatch(DashboardAction.setExpensesLoading(state))
}

export const setDashboardData = (dispatch: any, response: ResponseType) => {
   const ms = 1000  
   const {cred: {name, type_id}, data} = response

   switch(name){
      case 'purch_sale_orders':
         delay(ms).then(() => {
            if(CheckIfArray(data)){
               dispatch(DashboardAction.setPurchSaleOrders(data)) 
               dispatch(DashboardAction.setPurchSaleOrdErr(false))
            }else {
               dispatch(DashboardAction.setPurchSaleOrders([])) 
               dispatch(DashboardAction.setPurchSaleOrdErr(true))
            }
            dispatch(DashboardAction.setPurchSaleOrdLoading(false))
         })
         break;

      case "purch_sales_returns":
         delay(ms).then(() => {
            if(CheckIfArray(data)){
               dispatch(DashboardAction.setPurchSalesReturns(data))
               dispatch(DashboardAction.setPurchSalesRetErr(false))
            }else {
               dispatch(DashboardAction.setPurchSalesReturns([]))
               dispatch(DashboardAction.setPurchSalesRetErr(true))
            }
            dispatch(DashboardAction.setPurchSalesRetLoading(false))
         }) 
         break;

      case "sale_ord_totals_by_status":
         delay(ms).then(() => {
            if(CheckIfArray(data)){
               dispatch(DashboardAction.setOrdCountTotalByStatus(data))
               dispatch(DashboardAction.setOrdCountTotalErr(false))
            }else {
               dispatch(DashboardAction.setOrdCountTotalByStatus([]))
               dispatch(DashboardAction.setOrdCountTotalErr(true))
            }
            dispatch(DashboardAction.setOrdCountTotalLoading(false))
         })
         break;

      case "stock_cost_total":
         delay(ms).then(() => {
            // console.log('ssotk', data)
            if(CheckIfArray(data)){
               dispatch(DashboardAction.setStockCostTotal(data))
               dispatch(DashboardAction.setStockErr(false))
            }else {
               dispatch(DashboardAction.setStockCostTotal([]))
               dispatch(DashboardAction.setStockErr(true))
            }
            dispatch(DashboardAction.setStockLoading(false))
         }) 
         break;
      
      case "payments_received_made":
         if(type_id===11){
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setPaymentsReceived(data))
                  dispatch(DashboardAction.setPaymentsReceivedErr(false))
               }else {
                  dispatch(DashboardAction.setPaymentsReceived([]))
                  dispatch(DashboardAction.setPaymentsReceivedErr(true))
               }
               dispatch(DashboardAction.setPaymentsReceivedLoading(false))
            })
         }else if(type_id===12){
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setPaymentMade(data))
                  dispatch(DashboardAction.setPaymentsMadeErr(false))
               }else {
                  dispatch(DashboardAction.setPaymentMade([]))
                  dispatch(DashboardAction.setPaymentsMadeErr(true))
               }
               dispatch(DashboardAction.setPaymentsMadeLoading(false))
            })
         }
         break;

      case "credits_debts_empl_balance":
         if(type_id===1){
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setDebtsFromPurchase(data))
                  dispatch(DashboardAction.setDebtsErr(false))
               }else {
                  dispatch(DashboardAction.setDebtsFromPurchase([]))
                  dispatch(DashboardAction.setDebtsErr(true))
               }
               dispatch(DashboardAction.setDebtsLoading(false))
            })
         }else if(type_id===2){
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setCreditsFromSale(data))
                  dispatch(DashboardAction.setCreditsErr(false))
               }else {
                  dispatch(DashboardAction.setCreditsFromSale([]))
                  dispatch(DashboardAction.setCreditsErr(true))
               }
               dispatch(DashboardAction.setCreditsLoading(false))
            })
         }else if(type_id===4){
            // console.log('emps', )
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setEmployeesBalance(data))
                  dispatch(DashboardAction.setEmployeesBalanceErr(false))
               }else {
                  dispatch(DashboardAction.setEmployeesBalance([]))
                  dispatch(DashboardAction.setEmployeesBalanceErr(true))
               }
               dispatch(DashboardAction.setEmployeesBalanceLoading(false))
            })
         }
         break;

      case "expenses_cashes_amount":
         if(type_id===8){
            // console.log('casehes', data)
            delay(ms).then(() => {
               if(CheckIfArray(data)){

                  dispatch(DashboardAction.setCashesAmount(data))
                  dispatch(DashboardAction.setCashesErr(false))
               }else {
                  dispatch(DashboardAction.setCashesAmount([]))
                  dispatch(DashboardAction.setCashesErr(true))
               }
               dispatch(DashboardAction.setCashesLoading(false))
            })
         }else if(type_id===25){
            // console.log('expenses', data)
            delay(ms).then(() => {
               if(CheckIfArray(data)){
                  dispatch(DashboardAction.setExpensesAmount(data))
                  dispatch(DashboardAction.setExpensesErr(false))
               }else {
                  dispatch(DashboardAction.setExpensesAmount([]))
                  dispatch(DashboardAction.setExpensesErr(true))
               }
               dispatch(DashboardAction.setExpensesLoading(false))
            })
         }
         break;
      default: 
        return data
    }
}  