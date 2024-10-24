/**
 * 动态加载腾讯云验证码脚本
 * @returns {Promise<void>} 返回一个 Promise，在脚本加载完成时解决
 */
export function loadTCaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
        const SCRIPT_ID = 'tencent-captcha-script';
        const SCRIPT_SRC = 'https://turing.captcha.qcloud.com/TCaptcha.js';

        // 检查脚本是否已经加载
        if (document.getElementById(SCRIPT_ID)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;

        script.onload = () => {
            console.log('腾讯云验证码脚本加载成功');
            resolve();
        };

        script.onerror = () => {
            console.error('加载腾讯云验证码脚本失败');
            reject(new Error('加载腾讯云验证码脚本失败'));
        };

        document.head.appendChild(script);
    });
}
