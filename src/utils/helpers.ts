import hash from 'object-hash'
import DashboardAction from '@redux/actions/DashboardAction'
import {  ResponseType } from '@app/Types/utils';
import { UserFirmsList } from '@app/api/Types/queryReturnTypes/UserFirms';
import { papers } from '@app/assets/JsonData/papers';
import moment from 'moment';

export function getDate(date: Date | string) {
   return date !== null ? moment(new Date(date)).format('DD.MM.YYYY hh:mm') : date
}
export function isDateValid(date:Date|string){
   return moment(date).isValid()
}
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
   return new Promise(resolve => setTimeout(resolve, ms))
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
export const getUserDevice = () => {
   const agent = navigator.userAgent
   return hash(agent, { encoding: 'base64'})
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
export const isNullOrUndefined = (data:any) => {
   return (data !== null && data !== undefined)
}
export const checkDisconnectedClient = (disClient: any)=> {
   return !disClient.connected && disClient.room!=="" && disClient.last_conn_dt!==""
}
export const CheckObjOrArrForNull = (obj_or_arr: any) =>  {
   if (obj_or_arr !== null && obj_or_arr !== undefined) {
     if (obj_or_arr instanceof Object && Object.keys(obj_or_arr).length !== 0)
       return true;
     else if (Array.isArray(obj_or_arr) && obj_or_arr.length !== 0) return true;
   }
   return false;
}
export const CheckIfArray = (arr: any[]) => {
   if(Array.isArray(arr) && arr.length !== 0) 
      return true
   return false
}
export const CheckIfEqual = (arg1: number, arg2: number) => {
   return arg1 === arg2
}
export const ArraysChecker = (arrays: any[]) => {
   let counter = 0;
   for(let i = 0; i < arrays.length; i++){
      const array = arrays[i]
      if(CheckIfArray(array))
         counter++
   }
   console.log('counter ', counter)
   if(counter >= 1)
      return true
   return false
}
export const leastFirmConnected = (firms: UserFirmsList<string>[]) => {
   let counter=0;
   for(let i = 0; i < firms.length; i++){
      if(firms[i].connected)
         counter++
   }
   if(counter >= 1)
      return true
   return false
}

export const setDashboardData = ({dispatch,response}: {dispatch:Function,response: ResponseType}) => {
   const ms = 1000  
   const {cred: {name, type_id}, data} = response

   switch(name){
      case papers[0]:
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

      case papers[1]:
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

      case papers[6]:
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

      case papers[2]:
         delay(ms).then(() => {
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
      
      case papers[3]:
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

      case papers[4]:
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

      case papers[5]:
         if(type_id===8){
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
         break;
      }
}  