/**
 * 生成基础链接的工具函数
 * @param {string} pathname - 路径
 * @param {boolean} [location=true] - 是否包含当前页面的 origin，默认为 true
 * @returns {string} - 生成的链接
 */
export function generateBaseLink(
  pathname: string,
  location: boolean = true,
): string {
  if (typeof pathname !== 'string') {
    throw new Error('pathname 必须是一个字符串');
  }

  const locationOrigin =
    location && typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = import.meta.env.BASE_URL || '';

  // 确保 pathname 以斜杠开头
  const normalizedPathname = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  return `${locationOrigin}${baseUrl}${normalizedPathname}`;
}



/**
 * 生成邀请链接的 URL 查询字符串
 * @param {string} code - 邀请码
 * @param {string} [targetLink] - 可选的目标链接
 * @returns {string} 生成的 URL 查询字符串
 */
export function generateInviteUrlQuery(code: string, targetLink?: string): string {
  let urlQuery = `?scene=invite&c=${encodeURIComponent(code)}`;

  if (targetLink) {
    urlQuery += `&targetlink=${encodeURIComponent(targetLink)}`;
  }

  return urlQuery;
}

/**
 * 解析 URL 中的邀请参数
 * @param {string} url - 完整的 URL 或 URL 查询字符串
 * @returns {{ code: string; targetLink?: string }} 解析后的邀请参数
 */
export function parseInviteUrlQuery(url: string): { code: string; targetLink?: string } {
  let searchParams: URLSearchParams;

  try {
    // 尝试将输入解析为完整的 URL
    const parsedUrl = new URL(url);
    searchParams = parsedUrl.searchParams;
  } catch (error) {
    // 如果解析失败，假设输入是查询字符串
    searchParams = new URLSearchParams(url);
  }

  const code = searchParams.get('c');
  const targetLink = searchParams.get('targetlink');

  if (!code) {
    throw new Error('邀请码不存在');
  }

  return {
    code,
    targetLink: targetLink || undefined
  };
}

/**
 * 记录目标 URL 查询字符串
 * @param {string} urlQuery - URL 查询字符串
 * @param {any} data - 相关数据
 */
export function logTargetUrlQuery(urlQuery: string, data: any): void {
  console.log('target url q', urlQuery, data);
}

/**
 * 解析 URL 查询字符串并重新生成邀请链接的 URL 查询字符串
 * @param {string} urlQuery - 原始 URL 查询字符串
 * @param {boolean} [enableLogging=false] - 是否启用日志打印，默认为 false
 * @returns {string} 生成的新 URL 查询字符串
 * @throws {Error} 当原始 URL 查询字符串中没有邀请码时抛出错误
 */
export function parseAndRegenerateInviteUrlQuery(
  urlQuery: string,
  enableLogging: boolean = false
): string {
  try {
    // 解析原始 URL 查询字符串
    const parsedParams = parseInviteUrlQuery(urlQuery);

    if (enableLogging) {
      console.log('解析参数:', parsedParams);
    }

    // 重新生成 URL 查询字符串
    const regeneratedQuery = generateInviteUrlQuery(parsedParams.code, parsedParams.targetLink);

    if (enableLogging) {
      console.log('生成的 URL 查询字符串:', regeneratedQuery);
    }

    return regeneratedQuery;
  } catch (error) {
    if (enableLogging) {
      console.error('解析或生成 URL 查询字符串失败:', error);
    }
    throw error;
  }
}




/**
 * 从当前 URL 中获取 'ic' 参数值
 * @returns {string|null} 'ic' 参数值，如果不存在则返回 null
 */
export function getIcFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ic');
}

/**
 * 从当前 URL 中获取指定参数的值
 * @param {string} key - 要获取的参数名
 * @returns {string | undefined} 参数值，如果不存在则返回 undefined
 */
export function getUrlParameter(key: string): string | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key) ?? undefined;
}
