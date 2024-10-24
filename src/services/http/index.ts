import FbApi from '../FbApi';
import signatureHeaders, { type SignatureHeaders } from './signature_headers';

/**
 * HTTP 响应接口
 */
export interface HttpResp<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 处理 HTTP 响应
 * @param response - HTTP 响应
 * @param showToast - 是否显示错误提示
 * @returns 处理后的数据
 */
async function handleResponse<T>(response: Response, showToast = true): Promise<T> {
  const data: HttpResp<T> = await response.json();

  if (data.code !== 0) {
    if (showToast && data.code !== 6) {
      FbApi.toast(data.msg);
    }
    if (data.code === 3001) {
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
    }
    if (data.code === 20010) {
      FbApi.toast(data?.msg || '非白名单用户');
      window.location.href = '/activity';
    }

    if (data.code === 20000) {
      FbApi.toast(data.msg);
      window.location.href = '/activity';
    }

    if (data.code === 3001) {
      // clearAuthStatus();
    }
    throw new Error(data.msg);
  }

  return data.data;
}

/**
 * 获取请求头，包括签名和 token
 * @param data - 请求数据（可选）
 * @returns 包含签名和 token 的请求头
 */
async function getHeaders(data?: unknown): Promise<SignatureHeaders> {
  const signHeader = await signatureHeaders(data);
  const headers: SignatureHeaders = {
    'Content-Type': 'application/json',
    ...signHeader,
  };
  // console.log("完整的请求头:", headers);
  return headers;
}

/**
 * 发送 POST 请求
 * @param path - 请求路径
 * @param data - 请求数据
 * @returns 响应数据
 */
export async function post<T>(path: string, data?: unknown): Promise<T> {
  const headers = await getHeaders(data);

  const response = await fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    // mode: 'cors',
    // credentials: 'include'
  });

  return handleResponse<T>(response);
}

/**
 * 发送 POST 请求并处理错误提示
 * @param path - 请求路径
 * @param data - 请求数据
 * @returns 响应数据
 */
export async function postWithErrorToast<T>(path: string, data: unknown): Promise<T> {
  try {
    return await post<T>(path, data);
  } catch (error) {
    if (error instanceof Error) {
      FbApi.toast(error.message);
    }
    throw error;
  }
}

/**
 * 发送 GET 请求
 * @param path - 请求路径
 * @returns 响应数据
 */
export async function get<T>(path: string): Promise<T> {
  const headers = await getHeaders();

  const response = await fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    headers,
    // mode: 'cors',
    // credentials: 'include'
  });

  return handleResponse<T>(response);
}

/**
 * 发送不带签名的 GET 请求
 * @param path - 请求路径
 * @returns 响应数据
 */
export async function getWithNotSign<T>(path: string): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    headers,
  });

  return handleResponse<T>(response);
}

export default {
  post,
  postWithErrorToast,
  get,
  getWithNotSign,
};
