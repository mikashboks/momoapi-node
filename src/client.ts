import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

import { handleError } from "./errors";

import { TokenRefresher } from "./auth";
import { GlobalConfig, SubscriptionConfig } from "./common";

export function createClient(
  config: SubscriptionConfig & GlobalConfig,
  client: AxiosInstance = axios.create()
): AxiosInstance {
  client.defaults.baseURL = config.baseUrl;
  client.defaults.headers[ "Ocp-Apim-Subscription-Key"] = config.primaryKey;
  client.defaults.headers[ "X-Target-Environment"] = config.environment || "sandbox";
  return withErrorHandling(client);
}

export function createAuthClient(
  refresh: TokenRefresher,
  client: AxiosInstance
): AxiosInstance {
  client.interceptors.request.use(async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>  => {
    const accessToken = await refresh();
    const updatedRequest: InternalAxiosRequestConfig = {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`
      } as AxiosRequestHeaders
    };
    return updatedRequest;
  });

  return client;
}

export function withErrorHandling(client: AxiosInstance): AxiosInstance {
  client.interceptors.response.use(
    response => response,
    error => Promise.reject(handleError(error))
  );

  return client;
}
