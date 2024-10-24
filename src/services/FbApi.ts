import { openAmusementParkViaOpenInstall } from '@/contexts/open-install/useOpenInstall';
import {
  checkAppVersion,
  inAmusementPark,
  inFanbook,
  inFanbookHTML
} from '@/utils';
import queryString from 'query-string';

let toastDom: HTMLDivElement;
let toastTimer: number;

/**
 * 用户信息接口
 * @interface IUserInfo
 */
export interface IUserInfo {
  /** 用户ID */
  userId: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 性别 */
  gender: string;
  /** 短ID */
  shortId: string;
  /** 用户头像框 */
  badge: string;
}

type Locale = {
  languageCode: string;
  countryCode?: string;
};

export type ViewPadding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SystemInfo = {
  textScaleFactor: number;
  devicePixelRatio: number;
  locale: Locale;
  physicalSize: {
    width: number;
    height: number;
  };
  platformBrightness: 'dark' | 'light';
  viewPadding: ViewPadding;
};

/**
 * 频道信息接口
 * @interface ChannelInfo
 */
export interface ChannelInfo {
  /** 频道 ID */
  id: string;
  /** 频道名称 */
  name: string;
}

/**
 * 服务器信息接口
 * @interface GuildInfo
 */
export interface GuildInfo {
  /** 服务器 ID */
  id: string;
  /** 服务器名称 */
  name: string;
  /** 服务器拥有者用户 id */
  ownerId: string;
}

/**
 * Fanbook API 类
 * @class FbApi
 */
export default class FbApi {
  /**
   * 打开独立小程序
   * @param {string} url - 小程序的 URL
   */
  static openMiniprogram(url: string) {
    if (checkAppVersion('2.2.5')) {
      callAppFunc('openMiniProgram', { appId: url });
    } else {
      window.dispatchEvent(new Event('upgrade-app'));
    }
  }

  static openMiniProgramAsync(url: string) {
    if (checkAppVersion('2.4.1')) {
      return callAppFunc<{ status: 'success' | 'fail' }>(
        'openMiniProgramAsync',
        { appId: url },
      );
    } else {
      window.dispatchEvent(new Event('upgrade-app'));
    }
    return;
  }



  /**
   * 调用头像框分享
   * @param {Object} params - 参数对象
   * @param {string} params.badgePartId - 头像框部件ID
   * @returns {Promise<any>} 调用结果
   */
  static showAvatarBadgePartShare(params: { badgePartId: string }) {
    // 特殊处理：该方法只可能在应用内调用
    if (params) {
      return callAppFunc('showAvatarBadgePartShare', params);
    }
  }

  /**
   * 直接打开应用商店
   */
  static pushToApplicationMarket() {
    // 特殊处理：该方法只可能在应用内调用
    return callAppFunc('pushToApplicationMarket');
  }

  /**
   * 检测小游戏页面是否有对应的 API 能力(2.4.1 提供的能力)
   */
  static checkMiniGameFunction(params: { functionName: string }) {
    // 特殊处理：该方法只可能在应用内调用
    return callAppFunc('checkMiniGameFunction', params);
  }

  /**
   * 检测小程序是否有对应的 API 能力(2.4.1 提供的能力)
   */
  static checkMiniProgramSdkFunction(params: { functionName: string }) {
    // 特殊处理：该方法只可能在应用内调用
    return callAppFunc('checkMiniProgramSdkFunction', params);
  }

  /**
   * 打开首页小游戏tab页
   * @param {boolean} [refresh=false] - 是否刷新
   */
  static openMiniGameTabView({ refresh } = { refresh: false }) {
    // 特殊处理：该方法只可能在应用内调用
    // 会关闭当前的小程序并跳转
    callAppFunc('openMiniGameTabView', { refresh });
  }

  /**
   * 打开头像挂件页面
   */
  static openAvatarBadgeSettingPage() {
    // 特殊处理：该方法只可能在应用内调���
    // 会关闭当前的小程序并跳转
    callAppFunc('openAvatarBadgeSettingPage');
  }

  /**
   * 分享
   * @param {string} [gameId] - 游戏ID（可选）
   */
  static async share(gameId?: string) {
    if (inAmusementPark()) {
      const shareUrl = queryString.stringifyUrl({
        url: location.href,
        query: {
          inviter: (await FbApi.getUserInfo()).userId,
        },
      });
      callAppFunc('share', shareUrl, gameId);
    } else if (inFanbookHTML()) {
      if (checkAppVersion()) {
        // 这种情况是在新版本用网页直接游乐园，应该不存在这种情况
      } else {
        window.dispatchEvent(new Event('upgrade-app'));
      }
    } else {
      openAmusementParkViaOpenInstall();
    }
  }

  /**
   * 获取用户信息
   * @returns {Promise<IUserInfo>} 用户信息
   */
  static getUserInfo(): Promise<IUserInfo> {
    return callAppFunc<IUserInfo>('getUserInfo');
  }

  /**
   * 显示toast提示
   * @param {string} text - 提示文本
   */
  static toast(text: string) {
    if (inAmusementPark()) {
      callAppFunc('toast', { message: text });
    } else {
      if (!toastDom) {
        toastDom = document.createElement('div');
        document.body.append(toastDom);
        toastDom.style.pointerEvents = 'none';
        toastDom.style.padding = '10px 20px';
        toastDom.style.backgroundColor = '#1A2033f2';
        toastDom.style.color = 'white';
        toastDom.style.position = 'fixed';
        toastDom.style.borderRadius = '10px';
        toastDom.style.opacity = '0';
        toastDom.style.fontWeight = '500';
        toastDom.style.fontSize = '14px';
        toastDom.style.transition = 'opacity 0.3s';
        toastDom.style.left = '50%';
        toastDom.style.top = '50%';
        toastDom.style.zIndex = '100';
        toastDom.style.width = 'fit-content';
        toastDom.style.whiteSpace = 'break-spaces';
        toastDom.style.transform = 'translate(-50%, -50%)';
      }
      clearTimeout(toastTimer);
      window.setTimeout(() => {
        toastDom.innerHTML = `<b>${text}</b>`;
        toastDom.style.opacity = '1';
      });
      toastTimer = window.setTimeout(() => {
        toastDom.style.opacity = '0';
      }, 2000);
    }
  }

  /**
   * 显示用户信息弹窗
   * @param {string} userId - 用户ID
   */
  static showUserInfoPopup(userId: string) {
    callAppFunc('showUserInfoPopup', { userId });
  }

  /**
   * 获取用户Token
   * @returns {Promise<string>} 用户Token
   */
  static getUserToken(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return callAppFunc<{ token: string }>('getUserToken')
          .then((res) => resolve(res.token))
          .catch(() => resolve(''));
      }, 50);
    });
  }


  /**
   * 设置剪贴板数据
   * @param {string} text - 要设置的文本
   * @returns {Promise<void>}
   */
  static async setClipboardData(text: string): Promise<void> {
    return callAppFunc('setClipboardData', text);
  }

  /**
   * 获取来源信息
   * @returns {Promise<Record<string, string>>} 来源信息
   */
  static getSourceInfo() {
    if (!inAmusementPark) {
      return Promise.resolve({
        event_sub_id: null,
        channel_id: null,
      });
    }
    return callAppFunc<{
      event_sub_id: string | null;
      channel_id: string | null;
    }>('getSourceInfo');
  }

  /**
   * 获取操作系统信息。
   *
   * @returns {Promise<Record<string, string>>} 包含操作系统信息的记录对象
   * @property {number} textScaleFactor - 系统字体缩放系数
   * @property {number} devicePixelRatio - 设备像素比
   * @property {Locale} locale - 系统报告的设备默认 locale，规定了应用程序的语言和格式惯例
   * @property {Object} physicalSize - 物理尺寸
   * @property {number} physicalSize.width - 物理宽度
   * @property {number} physicalSize.height - 物理高度
   * @property {"dark" | "light"} platformBrightness - 平台亮度
   * @property {ViewPadding} viewPadding - 设备的安全区信息
   */
  static async getSystemInfo(): Promise<SystemInfo> {
    // 默认的 SystemInfo 对象
    const defaultSystemInfo: SystemInfo = {
      textScaleFactor: 1,
      devicePixelRatio: 1,
      locale: { languageCode: 'en', countryCode: 'US' }, // 假设 Locale 类型包含 languageCode 和 countryCode
      physicalSize: { width: 0, height: 0 },
      platformBrightness: 'light',
      viewPadding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // 为什么要增加延时，因为调用这个函数的时候，可能还没有获取到FbApi对象
    // 该函数多数结合 react 的useLayoutEffect使用
    return new Promise((resolve) => {
      setTimeout(() => {
        callAppFunc<SystemInfo>('getSystemInfo')
          .then(resolve)
          .catch(() => {
            // 如果获取失败，返回默认的 SystemInfo 对象
            resolve(defaultSystemInfo);
          });
      }, 50);
    });
  }


  /**
   * 统一活动任务跳转
   * @param {Object} args - 跳转参数
   * @returns {Promise<void>}
   */
  static dispatchActivityTask(args: {
    scene?: string;
    target?: string;
    guildId?: string;
    channelId?: string;
    circleId?: string;
    postId?: string;
    tagId?: string;
    appId?: string;
    keepCurrent?: boolean;
    type?: string;
    title?: string;
    desc?: string;
    icon?: string;
    externalLink?: string;
    internalLink?: string;
    url?: string;
    activityId?: string;
  }): Promise<void> {
    return callAppFunc('dispatchActivityTask', args);
  }

  /**
   * 获取当前选中的频道信息
   *
   * 注意: 如果打开了私信,这个方法依然获取所选服务器的选中频道信息,而不是当前私信频道。
   *
   * @returns {Promise<ChannelInfo | null>} 当前选中的频道信息,如果没有选中频道则返回 null
   */
  static getCurrentChannel(): Promise<ChannelInfo | null> {
    return callAppFunc<ChannelInfo | null>('getCurrentChannel');
  }

  /**
   * 获取当前选中的服务器信息
   *
   * 注意: 如果打开了私信,这个方法依然获取所选服务器的信息,而不是当前私信。
   *
   * @returns {Promise<GuildInfo | null>} 当前选中的服务器信息,如果没有选中服务器则返回 null
   */
  static getCurrentGuild(): Promise<GuildInfo | null> {
    return callAppFunc<GuildInfo | null>('getCurrentGuild');
  }
}



/**
 * 调用App函数
 * @template T
 * @param {string} name - 函数名
 * @param {...unknown[]} arg - 参数列表
 * @returns {Promise<T>} 函数调用结果
 */
function callAppFunc<T>(name: string, ...arg: unknown[]): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inFanbook()) {
        window.flutter_inappwebview.callHandler(name, ...arg)
          .then((result: unknown) => resolve(result as T))
          .catch((error: Error) => reject(error));
      } else {
        reject(`调用 ${name} 失败：不在 Fanbook 环境中`);
      }
    }, 17);
  });
}
