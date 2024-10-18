/**
 * 设置 rem 基准值（只执行一次）
 * @param designWidth 设计稿宽度
 * @param baseFontSize 基准字体大小
 * @param maxWidth 最大宽度
 * @param minWidth 最小宽度
 * @returns 清理函数，用于移除事件监听器
 */
export const setRem = (() => {
    let executed = false;

    return (designWidth = 390, baseFontSize = 16, maxWidth = 430, minWidth = 375): (() => void) => {
        if (executed) return () => { }; // 如果已经执行过，返回空函数
        executed = true;

        const html = document.documentElement;
        const setRemFn = (): void => {
            const clientWidth = Math.max(minWidth, Math.min(maxWidth, html.clientWidth));
            const scale = clientWidth / designWidth;
            html.style.fontSize = `${baseFontSize * scale}px`;
        };

        setRemFn();
        window.addEventListener('resize', setRemFn);

        // 返回清理函数
        return () => {
            window.removeEventListener('resize', setRemFn);
        };
    };
})();
