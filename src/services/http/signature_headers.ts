import { getToken } from '@/utils/auth-utils';
import { createDeviceTypeHeader, inFanbook } from '@/utils/ua-utils';
import { sortBy } from 'es-toolkit';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import FbApi from '../FbApi';

const {
  VITE_FANBOOK_SECRET: appSecret,
  VITE_FANBOOK_KEY: appKey,
  VITE_PLATFORM: platform,
} = import.meta.env;

interface CommonFields {
  Nonce: string;
  Timestamp: string;
  Authorization?: string;
  AppKey: string;
  RequestBody?: string;
  Platform: string;
}

interface SignHeader extends CommonFields {
  signature: string;
}

export type SignatureHeaders = SignHeader & HeadersInit;

/**
 * 对 URI 组件进行编码，并处理特殊字符
 * @param str 需要编码的字符串
 * @returns 编码后的字符串
 */
function fixedEncodeURIComponent(str: string) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * 生成签名
 * @param signatureMap 包含签名所需字段的对象
 * @returns 生成的签名字符串
 */
export function getSignature(signatureMap: CommonFields): string {
  // @ts-expect-error "ignore"
  const sortedEntries = sortBy(Object.entries(signatureMap), ([key]) => key);
  const chain = sortedEntries.map(([key, value]) => `${key}=${value}`).join('&') + '&' + appSecret;
  const encodedChain = fixedEncodeURIComponent(chain);
  return md5(encodedChain);
}

/**
 * 获取用户 token
 * @returns Promise<string | undefined> 用户 token
 */
export async function getUserToken(): Promise<string | undefined> {
  if (inFanbook()) {
    const response = await FbApi.getUserToken();
    // console.log("小程序环境 token:", response);
    return response;
  } else {
    const token = getToken();
    // console.log("非小程序环境 token:", token);
    return token;
  }
}

/**
 * 生成包含签名的请求头
 * @param params 请求参数
 * @returns Promise<SignatureHeaders> 包含签名的请求头
 */
export default async function signatureHeaders(params: unknown | string = ''): Promise<SignatureHeaders> {
  const token = await getUserToken();
  const RequestBody = params ? JSON.stringify(params) : '';

  const common: CommonFields = {
    Nonce: uuidv4(),
    Timestamp: Date.now().toString(),
    Authorization: token ?? '',
    AppKey: appKey,
    Platform: platform,
  };

  return {
    ...common,
    signature: getSignature({
      ...common,
      RequestBody,
    }),
    ...createDeviceTypeHeader(),
    Authorization: token ?? '',
  };
}
