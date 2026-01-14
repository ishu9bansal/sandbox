import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  defaultParams?: Record<string, any>;
}

interface ApiCallOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number; // miliseconds
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private defaultParams: Record<string, any>;

  constructor(config: ApiClientConfig) {
    this.defaultParams = config.defaultParams || {};

    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
    });

    // Response interceptor for handling common error scenarios
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          const authError = {
            authError: true,
            message: `HTTP error! status: ${error.response.status}`,
          };
          console.error('API call error:', authError);
          throw authError;
        }
        console.error('API call error:', error);
        throw error;
      }
    );
  }

  /**
   * Generic method to perform API calls
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param uri - Endpoint URI (relative to baseURL)
   * @param body - Request body (for POST, PUT, PATCH)
   * @param options - Additional options (headers, params)
   * @returns Promise with the response data
   */
  async call<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    uri: string,
    body?: any,
    options?: ApiCallOptions
  ): Promise<T | null> {
    try {
      const timeout = options?.timeout || 10000; // default timeout 10s
      const config: AxiosRequestConfig = {
        method,
        url: uri,
        headers: {
          ...options?.headers,
        },
        params: {
          ...this.defaultParams,
          ...options?.params,
        },
        timeout,
      };

      // Add body for methods that support it
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.data = body;
      }

      const response: AxiosResponse<T> = await this.axiosInstance.request(config);

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Convenience methods
  async get<T = any>(uri: string, options?: ApiCallOptions): Promise<T | null> {
    return this.call<T>('GET', uri, undefined, options);
  }

  async post<T = any>(uri: string, body?: any, options?: ApiCallOptions): Promise<T | null> {
    return this.call<T>('POST', uri, body, options);
  }

  async put<T = any>(uri: string, body?: any, options?: ApiCallOptions): Promise<T | null> {
    return this.call<T>('PUT', uri, body, options);
  }

  async delete<T = any>(uri: string, options?: ApiCallOptions): Promise<T | null> {
    return this.call<T>('DELETE', uri, undefined, options);
  }

  async patch<T = any>(uri: string, body?: any, options?: ApiCallOptions): Promise<T | null> {
    return this.call<T>('PATCH', uri, body, options);
  }
}

export default ApiClient;
