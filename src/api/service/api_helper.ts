import { axiosInstance } from "../axiosInstance";
import authToken from "./auth_token";

export const api = {
  get: async<T>({url}: {url:string}): Promise<T> => {
    const config = {
      withCredentials: true,
    }
    return axiosInstance.get(url, config).then(response => response.data)
  },
  post: async<T, R>({url, data}: {url:string,data: T}): Promise<R> => {
    const config = {
      withCredentials: true
    }
    return axiosInstance.post(url, {...data},{...config}).then(response => response.data)
  }, 
  put: async<T, R>({url, data}: {url:string,data: T}): Promise<R> => {
    const config = {
      withCredentials: true
    }
    return axiosInstance.put(url, {...data},{...config}).then(response => response.data)
  }, 
  delete: async<R>({url}: {url:string}): Promise<R> => {
    const config = {
      withCredentials: true
    }
    return axiosInstance.delete(url,{...config}).then(response => response.data)
  }, 
  getPrivate: async<T>({url, withCredentials}: {url:string, withCredentials:boolean}): Promise<T> => {
    const token = 'Bearer ' + authToken()
    const config = {
      headers: {
        Authorization: token
      },
      withCredentials
    }
    return axiosInstance.get(url, config).then(response => response.data)
  },
  postPrivate: async<T, R>({url, withCredentials,  data}: {url:string, withCredentials: boolean, data: T}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {
      headers: {
        Authorization: token
      },
      withCredentials
    }
    return axiosInstance.post(url, {...data}, {...config}).then(response => response.data)
  }, 
  putPrivate: async<T, R>({url, data, withCredentials,}: {url:string, data: T, withCredentials: boolean}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {
      headers: {
        Authorization: token
      },
      withCredentials
    }
    return axiosInstance.put(url, {...data},{...config}).then(response => response.data)
  },
  deletePrivate: async<R>({url, withCredentials}: {url:string, withCredentials: boolean}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {
      headers: {
        Authorization: token
      },
      withCredentials
    }
    return axiosInstance.delete(url, config).then(response => response.data)
  }
}