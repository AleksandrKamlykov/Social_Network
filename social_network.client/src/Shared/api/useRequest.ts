import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError,Method } from 'axios';
import { BASE_URL } from '../const';

interface UseRequestResult<T> {
    error: AxiosError | null;
    loading: boolean;
    get: (url: string) => Promise<T>;
    post: (url: string, body: any) => Promise<T>;
    put: (url: string, body: any) => Promise<T>;
    del: (url: string) => Promise<T>;
}

export const useRequest = <T = any>(): UseRequestResult<T> => {
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async (  url:string, method:Method, body?:any) => {
        setLoading(true);
        try {
            const response: AxiosResponse<T> = await axios.request<T>({
                url:BASE_URL + url,
                method,
                data: body,
            });
            return response.data as T;
        } catch (err) {
            setError(err as AxiosError);
            return {} as T;
            setError(err as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    async function get(url: string): Promise<T> {
      return  await fetchData(url, 'GET');
    }
    async function post(url: string, body: any): Promise<T> {
      return  await fetchData(url, 'POST', body);
    }
    async function put(url: string, body: any): Promise<T> {
     return   await fetchData(url, 'PUT', body);
    }
    async function del(url: string): Promise<T> {
      return  await fetchData(url, 'DELETE');
    }

    return {  error, loading, get, post, put, del };
};

