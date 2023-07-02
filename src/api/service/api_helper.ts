import { axiosInstance, axiosInstancePrivate } from "../axiosInstance";

export async function Get<R>(url: string, config = {}): Promise<R> {
  return axiosInstance.get(url, { ...config }).then(response => response.data);
}
export async function GetPrivate<R>(url: string, config = {}): Promise<R> {
  return axiosInstancePrivate.get(url, { ...config }).then(response => response.data);
}
export async function Post<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstance.post(url, {...data}, {...config}).then(response => response.data)
}
export async function Put<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstance
    .put(url, {...data}, { ...config })
    .then(response => response.data);
}

export async function patch<T, R>(url: string, data: T, config = {}): Promise<R> {
  return axiosInstance
    .patch(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del<R>(url: string, config = {}): Promise<R> {
  return axiosInstance
    .delete(url, { ...config })
    .then(response => response.data);
}
