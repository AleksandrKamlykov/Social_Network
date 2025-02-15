import { useState } from 'react';
import axios, {  AxiosResponse, AxiosError,Method } from 'axios';
import { BASE_URL } from '../const';

interface UseRequestResult<T> {
    data: T | null;
    error: AxiosError | null;
    loading: boolean;
    get: (url: string) => Promise<void>;
    post: (url: string, body: any) => Promise<void>;
    put: (url: string, body: any) => Promise<void>;
    del: (url: string) => Promise<void>;
}

export const useRequestData = <T = any>(): UseRequestResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async (url:string, method:Method, body?:any) => {
        setLoading(true);
        try {
            const response: AxiosResponse<T> = await axios.request<T>({
                url: BASE_URL + url,
                method,
                data: body,
            });
            setData(response.data);
        } catch (err) {
            setError(err as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    async function get(url: string): Promise<void> {
        await fetchData(url, 'GET');
    }
    async function post(url: string, body: any): Promise<void> {
        await fetchData(url, 'POST', body);
    }
    async function put(url: string, body: any): Promise<void> {
        await fetchData(url, 'PUT', body);
    }
    async function del(url: string): Promise<void> {
        await fetchData(url, 'DELETE');
    }

    return { data, error, loading, get, post, put, del };
};

