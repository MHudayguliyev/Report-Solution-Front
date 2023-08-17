import { useAppSelector } from "@app/hooks/redux_hooks";
import { InitialDashboardState } from "@app/redux/types/DashboardTypes";
import moment from "moment";

const TOKEN_LOCALSTORAGE_KEY = "token";
export const tokenStorage = {
  getToken: () => {
    let parsed;
    const token = window.localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    if (token !== null) {
      parsed = JSON.parse(token);
      return parsed;
    } else {
      return null;
    }
  },
  setToken: (token: string) =>
    window.localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY),
};


export const setToStorage = (storage: any) => {
  if (storage)
    localStorage.setItem('storage', JSON.stringify(storage));
}

export const getFromStorage = (key?:string) => {
  const authUser = JSON.parse(localStorage.getItem('authUser')!) || ""
  if(key !== ''){
    const result = authUser?.[key as string] ?? ""
    return result
  }
  return authUser
}
export const deleteFromStorage = () => {
  const authUser = JSON.parse(localStorage.getItem('authUser')!) || ""
  for(let key in authUser){
    if(!key.includes('user_phone'))
      delete authUser[key]
  }
  localStorage.removeItem('persist:dashboard')
  localStorage.removeItem('persist:nav')
  localStorage.setItem('authUser', JSON.stringify(authUser))
}