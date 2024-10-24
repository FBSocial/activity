/**
 * 用户代理字符串
 */
const userAgent = navigator.userAgent.toLowerCase();

/**
 * 环境类型枚举
 */
enum Environment {
  AmusementPark = 'AmusementPark',
  FanbookHTML = 'FanbookHTML',
  Miniprogram = 'Miniprogram',
  Other = 'Other'
}

/**
 * 设备类型枚举
 */
enum DeviceType {
  Apple = 'Apple',
  Android = 'Android',
  Other = 'Other'
}

/**
 * 判断当前环境
 * @returns {Environment} 当前环境类型
 */
function getCurrentEnvironment(): Environment {
  if (userAgent.includes('amusementpark')) return Environment.AmusementPark;
  if (userAgent.includes('fanbook/')) return Environment.FanbookHTML;
  if (userAgent.includes('fbmp')) return Environment.Miniprogram;
  return Environment.Other;
}

/**
 * 判断是否在 Fanbook 环境中（包括游乐园、HTML 或小程序）
 */
const isInFanbook = (): boolean => getCurrentEnvironment() !== Environment.Other;

/**
 * 获取当前设备类型
 * @returns {DeviceType} 当前设备类型
 */
function getDeviceType(): DeviceType {
  if (/ipad|iphone|ipod|mac/.test(userAgent)) return DeviceType.Apple;
  if (/android/.test(userAgent)) return DeviceType.Android;
  return DeviceType.Other;
}

/**
 * 比较版本号，判断版本 a 是否大于版本 b
 * @param a - 版本号 a
 * @param b - 版本号 b
 * @returns 如果版本 a 大于版本 b，返回 true，否则返回 false
 */
export function isVersionGreaterThan(a: string, b: string): boolean {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) > 0;
}

/**
 * 检查应用版本是否大于或等于最小版本
 * @param minVersion - 最小版本号，默认为 '2.2.3'
 * @returns 如果应用版本大于或等于最小版本，返回 true，否则返回 false
 */
export function checkAppVersion(minVersion: string = '2.2.3'): boolean {
  const versionMatch = userAgent.match(/(fanbook|amusementpark)\/(\d+\.\d+\.\d+)/);
  const version = versionMatch?.[2];
  if (!version) return false;
  return minVersion === version || isVersionGreaterThan(version, minVersion);
}

export const inAmusementPark = (): boolean => getCurrentEnvironment() === Environment.AmusementPark;
export const inFanbookHTML = (): boolean => getCurrentEnvironment() === Environment.FanbookHTML;
export const inMiniprogram = (): boolean => getCurrentEnvironment() === Environment.Miniprogram;
export const inFanbook = isInFanbook;
export const inAppleDevice = (): boolean => getDeviceType() === DeviceType.Apple;
export const inAndroidDevice = (): boolean => getDeviceType() === DeviceType.Android;
