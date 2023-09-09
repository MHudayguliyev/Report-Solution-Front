import { axiosInstance } from "../axiosInstance";
import authToken from "./auth_token";
  const config = {
    withCredentials: true,
  }
  const privateConfig = {
    headers: {
      "Authorization": "", 
      "Content-type": "application/json"
    }, 
    withCredentials: false, 
  }
export const api = {
  get: async<T>({url}: {url:string}): Promise<T> => {
    return axiosInstance.get(url, {...config}).then(response => response.data)
  },
  post: async<T, R>({url, data}: {url:string,data: T}): Promise<R> => {
    return axiosInstance.post(url, {...data},{...config}).then(response => response.data)
  }, 
  put: async<T, R>({url, data}: {url:string,data: T}): Promise<R> => {
    return axiosInstance.put(url, {...data},{...config}).then(response => response.data)
  }, 
  delete: async<R>({url}: {url:string}): Promise<R> => {
    return axiosInstance.delete(url,{...config}).then(response => response.data)
  }, 
  getPrivate: async<T>({url, withCredentials}: {url:string, withCredentials:boolean}): Promise<T> => {
    const token = 'Bearer ' + authToken()
    const config = {...privateConfig, headers: {...privateConfig.headers, Authorization: token}, withCredentials}
    return axiosInstance.get(url, {...config}).then(response => response.data)
  },
  postPrivate: async<T, R>({url,data,contentType = 'application/json',withCredentials}: {url:string, data: T,contentType?:string|any, withCredentials: boolean}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {...privateConfig,  
      headers: {...privateConfig.headers, 
        "Authorization": token, 
        "Content-type": contentType}, 
        withCredentials}
      // console.log("config", config)
      // console.log('data',data)
    return axiosInstance.post(url, {...data}, {...config}).then(response => response.data)
  }, 
  putPrivate: async<T, R>({url, data, withCredentials,}: {url:string, data: T, withCredentials: boolean}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {...privateConfig, headers: {...privateConfig.headers, Authorization: token}, withCredentials}
    return axiosInstance.put(url, {...data},{...config}).then(response => response.data)
  },
  deletePrivate: async<R>({url, withCredentials}: {url:string, withCredentials: boolean}): Promise<R> => {
    const token = 'Bearer ' + authToken();
    const config = {...privateConfig, headers: {...privateConfig.headers, Authorization: token}, withCredentials}
    return axiosInstance.delete(url, {...config}).then(response => response.data)
  }
}