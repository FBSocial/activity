const SCRIPT_ID = 'openinstall-script';
const SCRIPT_SRC = '//res.cdn.openinstall.io/openinstall.js';
const TIMEOUT_MS = 10000;

/**
 * 加载 OpenInstall 脚本
 * @returns {Promise<void>} - 返回一个 Promise，当脚本加载完成时 resolve
 */
function loadOpenInstallScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window 对象不存在，可能在非浏览器环境中运行'));
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      document.body.appendChild(script);
    }

    if (script.hasAttribute('data-loaded')) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      reject(new Error(`OpenInstall 脚本加载超时（${TIMEOUT_MS}ms）`));
    }, TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeout);
      script.setAttribute('data-loaded', 'true');
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('OpenInstall 脚本加载失败'));
    };
  });
}

/**
 * 安装 OpenInstall 插件
 * @param {Record<string, string>} [params] - 初始化参数
 * @returns {Promise<void>} - 返回一个 Promise，当 OpenInstall 插件初始化完成时 resolve
 */
export function installOpenInstall(
  params?: Record<string, string>,
): Promise<void> {
  return loadOpenInstallScript()
    .then(() => {
      return new Promise((resolve, reject) => {
        if (window.openInstall) {
          resolve();
          return;
        }

        try {
          window.openInstall = new OpenInstall(
            {
              appKey: 'rmst4o',
              preferWakeup: true,
              onready: () => {
                console.log('OpenInstall ready ...');
                resolve();
              },
            },
            params,
          );
        } catch (error) {
          reject(new Error(`OpenInstall 初始化失败: ${error}`));
        }
      });
    });
}

/**
 * 在 Fanbook 中打开指定路径
 * @param {Object} options - 打开选项
 * @param {string} options.path - 要打开的路径
 * @param {string} options.code - 相关代码
 * @param {string} options.guildId - 公会 ID
 */
export function openInFanbook({
  path,
  code,
  guildId,
}: {
  path: string;
  code: string;
  guildId: string;
}) {
  if (!window.openInstall) {
    console.error('OpenInstall 未初始化，请先调用 installOpenInstall 函数');
    return;
  }

  window.openInstall.wakeupOrInstall({
    data: {
      scene: 'receive_award',
      path,
      code,
      guildId,
    },
    timeout: 2000,
  });
}

/**
 * 重新初始化 OpenInstall
 * @param {Record<string, string>} [params] - 初始化参数
 * @returns {Promise<void>} - 返回一个 Promise，当 OpenInstall 插件重新初始化完成时 resolve
 */
export function reinitializeOpenInstall(
  params?: Record<string, string>,
): Promise<void> {
  // 移除现有的 OpenInstall 实例
  if (window.openInstall) {
    window.openInstall = null;
  }

  // 移除现有的脚本
  const existingScript = document.getElementById(SCRIPT_ID);
  if (existingScript) {
    existingScript.remove();
  }

  // 重新安装 OpenInstall
  return installOpenInstall(params);
}