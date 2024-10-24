
/**
 * 复制文本到剪贴板的工具函数
 *
 * @param text 要复制的文本
 * @param onSuccess 复制成功时的回调函数
 * @param onError 复制失败时的回调函数
 * @returns Promise<boolean> 表示复制是否成功
 */
export async function copyToClipboard(
    text: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): Promise<boolean> {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (!successful) {
                throw new Error('复制操作失败');
            }
        }
        onSuccess?.();
        return true;
    } catch (err) {
        console.error('复制失败:', err);
        onError?.(err instanceof Error ? err : new Error('未知错误'));
        return false;
    }
}
