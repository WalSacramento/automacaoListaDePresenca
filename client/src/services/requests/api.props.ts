import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IAxiosRequestConfig extends AxiosRequestConfig {
  token?: string;
  headers?: {
    Accept?: string;
    contentType?: string;
    Authorization?: string;
  };
}

export interface IAxiosResponse<T> extends AxiosResponse<T> {
  data: T;
}