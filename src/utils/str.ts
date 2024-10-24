/**
 * 安全地解析 JSON 字符串
 *
 * 此函数会尝试解析输入的 JSON 字符串。如果解析失败，
 * 将调用提供的错误处理函数（如果有），并返回 undefined。
 *
 * @template T 预期的解析结果类型
 * @param {string} value - 要解析的 JSON 字符串
 * @param {(error: unknown) => void} [handleError] - 可选的错误处理函数
 * @returns {T | undefined} 解析后的 JavaScript 对象，或在解析失败时返回 undefined
 */
export const safeJsonParse = <T>(value: string, handleError?: (error: unknown) => void): T | undefined => {
    try {
        return JSON.parse(value) as T;
    } catch (error) {
        handleError?.(error);
        return undefined;
    }
};

/**
 * 安全地将值转换为 JSON 字符串
 *
 * 此函数会尝试将输入值转换为 JSON 字符串。如果转换失败，
 * 将返回提供的默认字符串，而不是抛出错误。
 *
 * @param {unknown} value - 要转换的值
 * @param {string} defaultValue - 转换失败时返回的默认字符串
 * @returns {string} JSON 字符串，或在转换失败时返回默认字符串
 */
export function safeJsonStringify(value: unknown, defaultValue: string = ''): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        console.error('JSON 字符串化失败:', error);
        return defaultValue;
    }
}
