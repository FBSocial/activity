/**
 * 将 JSON 对象序列化并转换为 base64 编码
 * @param {unknown} data - 要序列化和编码的数据
 * @returns {string} base64 编码的字符串
 * @throws {Error} 如果输入无法序列化为 JSON
 */
export function jsonToBase64(data: unknown): string {
    try {
        // 步骤 1: 将数据序列化为 JSON 字符串
        const jsonString = JSON.stringify(data);

        // 步骤 2: 将字符串转换为 base64 编码
        return btoa(encodeURIComponent(jsonString));
    } catch (error) {
        throw new Error(`无法将数据序列化为 JSON: ${(error as Error).message}`);
    }
}

/**
 * 将 base64 编码的字符串解码并解析为 JSON 对象
 * @template T 预期的返回类型
 * @param {string} base64String - 要解码和解析的 base64 编码字符串
 * @returns {T} 解析后的 JSON 数据
 * @throws {Error} 如果输入无法解码或解析为 JSON
 */
export function base64ToJson<T>(base64String: string): T {
    if (typeof base64String !== 'string') {
        throw new Error('输入必须是字符串');
    }

    try {
        // 步骤 1: 将 base64 字符串解码
        const jsonString = decodeURIComponent(atob(base64String));

        // 步骤 2: 将 JSON 字符串解析为对象
        return JSON.parse(jsonString) as T;
    } catch (error) {
        throw new Error(`无法解码或解析 base64 字符串: ${(error as Error).message}`);
    }
}
