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


export const setToStorage = (storage: InitialDashboardState<boolean> | undefined | any) => {
  if (storage)
    localStorage.setItem('storage', JSON.stringify(storage));
}

export const getFromStorage = (): InitialDashboardState<boolean> | any => {
  if (localStorage.getItem('persist:dashboard') !== null){
    return JSON.parse(localStorage.getItem('persist:dashboard')!)
  }
  // return {
  //   receiver: {
  //     label: '',
  //     value: '',
  //     connected: false
  //   }
  // }


}