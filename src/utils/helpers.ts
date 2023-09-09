import hash from 'object-hash'
import DashboardAction from '@redux/actions/DashboardAction'
import {  ResponseType } from '@app/Types/utils';
import { UserFirmsList } from '@app/api/Types/queryReturnTypes/UserFirms';
import { papers } from '@app/assets/JsonData/papers';
import moment from 'moment';
import { DataKindType } from '@app/redux/types/DashboardTypes';

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
export const isNullOrUndefined = (data:any) => {
   return (data !== null && data !== undefined)
}
export const isNegativeNumber = (value: string) => {
   return (isNullOrUndefined(value) && value.toString().includes('-'))
}
export const convertToNumber = (value:string) => {
   return Number(value)
}
// export const calculate = ({}) => {

// }
export const isStrEmpty = (str: string) => {
   return (str || str.length > 0 );
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
export const checkIfArray = (arr: any[]) => {
   if(Array.isArray(arr) && arr.length !== 0) 
      return true
   return false
}
export const CheckIfEqual = (arg1: number, arg2: number) => {
   return arg1 === arg2
}
export const arraysChecker = (arrays: any[]) => {
   let counter = 0;
   for(let i = 0; i < arrays.length; i++){
      const array = arrays[i]
      if(checkIfArray(array))
         counter++
   }
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
   const {
      data,
      cred: {
         name, 
         type_id, 
         dashboardDataType: key = 'initialData'
      }
   } = response
   const setter: {key: DataKindType, state: boolean} = {
      key,
      state: false
   }

   switch(name){
      case papers[0]:
         delay(ms).then(() => {
            if(checkIfArray(data)){
               dispatch(DashboardAction.setPurchSaleOrders(data, key)) 
               dispatch(DashboardAction.setPurchSaleOrdErr(setter))
            }else {
               dispatch(DashboardAction.setPurchSaleOrders([], key)) 
               dispatch(DashboardAction.setPurchSaleOrdErr({...setter, state: true}))
            }
            dispatch(DashboardAction.setPurchSaleOrdLoading(setter))
         })
         break;

      case papers[1]:
         delay(ms).then(() => {
            if(checkIfArray(data)){
               dispatch(DashboardAction.setPurchSalesReturns(data, key))
               dispatch(DashboardAction.setPurchSalesRetErr(setter))
            }else {
               dispatch(DashboardAction.setPurchSalesReturns([], key))
               dispatch(DashboardAction.setPurchSalesRetErr({...setter, state: true}))
            }
            dispatch(DashboardAction.setPurchSalesRetLoading(setter))
         }) 
         break;

      case papers[6]:
         delay(ms).then(() => {
            if(checkIfArray(data)){
               dispatch(DashboardAction.setOrdCountTotalByStatus(data, key))
               dispatch(DashboardAction.setOrdCountTotalErr(setter))
            }else {
               dispatch(DashboardAction.setOrdCountTotalByStatus([], key))
               dispatch(DashboardAction.setOrdCountTotalErr({...setter, state: true}))
            }
            dispatch(DashboardAction.setOrdCountTotalLoading(setter))
         })
         break;

      case papers[2]:
         delay(ms).then(() => {
            if(checkIfArray(data)){
               dispatch(DashboardAction.setStockCostTotal(data, key))
               dispatch(DashboardAction.setStockErr(setter))
            }else {
               dispatch(DashboardAction.setStockCostTotal([], key))
               dispatch(DashboardAction.setStockErr({...setter, state: true}))
            }
            dispatch(DashboardAction.setStockLoading(setter))
         }) 
         break;
      
      case papers[3]:
         if(type_id===11){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setPaymentsReceived(data, key))
                  dispatch(DashboardAction.setPaymentsReceivedErr(setter))
               }else {
                  dispatch(DashboardAction.setPaymentsReceived([], key))
                  dispatch(DashboardAction.setPaymentsReceivedErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setPaymentsReceivedLoading(setter))
            })
         }else if(type_id===12){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setPaymentMade(data, key))
                  dispatch(DashboardAction.setPaymentsMadeErr(setter))
               }else {
                  dispatch(DashboardAction.setPaymentMade([], key))
                  dispatch(DashboardAction.setPaymentsMadeErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setPaymentsMadeLoading(setter))
            })
         }
         break;

      case papers[4]:
         if(type_id===1){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setDebtsFromPurchase(data, key))
                  dispatch(DashboardAction.setDebtsErr(setter))
               }else {
                  dispatch(DashboardAction.setDebtsFromPurchase([], key))
                  dispatch(DashboardAction.setDebtsErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setDebtsLoading(setter))
            })
         }else if(type_id===2){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setCreditsFromSale(data, key))
                  dispatch(DashboardAction.setCreditsErr(setter))
               }else {
                  dispatch(DashboardAction.setCreditsFromSale([], key))
                  dispatch(DashboardAction.setCreditsErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setCreditsLoading(setter))
            })
         }else if(type_id===4){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setEmployeesBalance(data, key))
                  dispatch(DashboardAction.setEmployeesBalanceErr(setter))
               }else {
                  dispatch(DashboardAction.setEmployeesBalance([], key))
                  dispatch(DashboardAction.setEmployeesBalanceErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setEmployeesBalanceLoading(setter))
            })
         }
         break;

      case papers[5]:
         if(type_id===8){
            delay(ms).then(() => {
               if(checkIfArray(data)){

                  dispatch(DashboardAction.setCashesAmount(data, key))
                  dispatch(DashboardAction.setCashesErr(setter))
               }else {
                  dispatch(DashboardAction.setCashesAmount([], key))
                  dispatch(DashboardAction.setCashesErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setCashesLoading(setter))
            })
         }else if(type_id===25){
            delay(ms).then(() => {
               if(checkIfArray(data)){
                  dispatch(DashboardAction.setExpensesAmount(data, key))
                  dispatch(DashboardAction.setExpensesErr(setter))
               }else {
                  dispatch(DashboardAction.setExpensesAmount([], key))
                  dispatch(DashboardAction.setExpensesErr({...setter, state: true}))
               }
               dispatch(DashboardAction.setExpensesLoading(setter))
            })
         }
         break;
      default: 
         break;
      }
}  