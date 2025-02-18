import { useState } from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Method,
} from "axios";
import { BASE_URL } from "../const";

type ReqResponse<T> = Promise<AxiosResponse<T>>;

interface UseRequestResult<T> {
  error: AxiosError | null;
  loading: boolean;
  get: (url: string) => ReqResponse<T>;
  post: (url: string, body?: any) => ReqResponse<T>;
  put: (url: string, body: any) => ReqResponse<T>;
  del: (url: string) => ReqResponse<T>;
}

export const useRequest = <T = any>(): UseRequestResult<T> => {
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (
    url: string,
    method: Method,
    body?: any
  ): ReqResponse<T> => {
    setLoading(true);
    try {
      const response: AxiosResponse<T> = await axios.request<T>({
        url: BASE_URL + url,
        method,
        data: body ?? {},
        withCredentials: true,
      });

      return response;
    } catch (err) {
      setError(err as AxiosError);
      return {} as ReqResponse<T>;
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  async function get(url: string) {
    return await fetchData(url, "GET");
  }
  async function post(url: string, body: any = {}) {
    return await fetchData(url, "POST", body);
  }
  async function put(url: string, body: any) {
    return await fetchData(url, "PUT", body);
  }
  async function del(url: string) {
    return await fetchData(url, "DELETE");
  }

  return { error, loading, get, post, put, del };
};
