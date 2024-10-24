import { useCallback, useEffect, useState } from 'react'
import { openInFanbook } from './utils'

const SCRIPT_ID = 'openinstall-script'
const SCRIPT_SRC = '//res.cdn.openinstall.io/openinstall.js'
const TIMEOUT_MS = 10000

let isInitialized = false
let initializationPromise: Promise<void> | null = null

/**
 * 加载 OpenInstall 脚本并初始化
 * @param {Record<string, string>} [params] - 初始化参数
 * @returns {Promise<void>} - 返回一个 Promise，当 OpenInstall 插件初始化完成时 resolve
 */
function initializeOpenInstall(params?: Record<string, string>): Promise<void> {
  if (isInitialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window 对象不存在，可能在非浏览器环境中运行'))
      return
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement

    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }

    const timeout = setTimeout(() => {
      reject(new Error(`OpenInstall 脚本加载超时（${TIMEOUT_MS}ms）`))
    }, TIMEOUT_MS)

    script.onload = () => {
      clearTimeout(timeout)
      if (typeof OpenInstall === 'undefined') {
        reject(new Error('OpenInstall 脚本加载成功，但 OpenInstall 对象未定义'))
        return
      }

      try {
        window.openInstall = new OpenInstall(
          {
            appKey: 'rmst4o',
            preferWakeup: true,
            onready: () => {
              console.log('OpenInstall ready ...')
              isInitialized = true
              resolve()
            },
          },
          params
        )
      } catch (error) {
        reject(new Error(`OpenInstall 初始化失败: ${error}`))
      }
    }

    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('OpenInstall 脚本加载失败'))
    }
  })

  return initializationPromise
}

/**
 * 重置 OpenInstall 初始化状态
 */
function resetOpenInstall(): void {
  isInitialized = false
  initializationPromise = null
}

/**
 * 自定义 React Hook，用于使用 OpenInstall 功能
 * @param {boolean} [shouldInitialize=true] - 是否应该初始化 OpenInstall
 * @returns {Object} 返回一个对象，包含以下属性：
 * - isReady: boolean - 初始化状态，表示 OpenInstall 是否已就绪
 * - error: Error | null - 错误信息，如果初始化过程中发生错误，则包含错误对象；否则为 null
 * - openFanbook: Function - 打开 Fanbook 的函数，接受一个包含 path、code 和 guildId 的对象作为参数
 * - reinitialize: Function - 重新初始化 OpenInstall 的函数，返回一个 Promise
 */
export function useOpenInstall(shouldInitialize: boolean = true) {
  const [isReady, setIsReady] = useState(isInitialized)
  const [error, setError] = useState<Error | null>(null)

  const initializeOpenInstallWrapper = useCallback(() => {
    if (!shouldInitialize) {
      setIsReady(false)
      setError(null)
      return Promise.resolve()
    }

    setIsReady(false)
    setError(null)
    return initializeOpenInstall()
      .then(() => {
        setIsReady(true)
      })
      .catch(err => {
        setError(err)
        throw err
      })
  }, [shouldInitialize])

  useEffect(() => {
    if (shouldInitialize && !isInitialized) {
      initializeOpenInstallWrapper()
    } else if (!shouldInitialize) {
      setIsReady(false)
      setError(null)
    }
  }, [shouldInitialize, initializeOpenInstallWrapper])

  const openFanbook = useCallback(
    (params?: { path?: string; code?: string; guildId?: string; channelId?: string; urlStr?: string }) => {
      if (isReady && shouldInitialize) {
        if (params) {
          // 只传递非 undefined 的参数
          const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))
          openInFanbook(filteredParams as any) // 使用 'as any' 暂时绕过类型检查
        } else {
          // 如果没有传入参数，只唤醒应用
          window.openInstall?.wakeupOrInstall()
        }
      } else if (shouldInitialize) {
        console.error('OpenInstall 未就绪，无法打开 Fanbook')
      } else {
        console.log('OpenInstall 未初始化，跳过打开 Fanbook')
      }
    },
    [isReady, shouldInitialize]
  )

  const reinitialize = useCallback(() => {
    if (!shouldInitialize) {
      return Promise.resolve()
    }
    resetOpenInstall()
    return initializeOpenInstallWrapper()
  }, [initializeOpenInstallWrapper, shouldInitialize])

  return {
    isReady: shouldInitialize && isReady,
    error,
    openFanbook,
    reinitialize,
  }
}

export function openAmusementParkViaOpenInstall() {
  window.openInstall?.wakeupOrInstall({
    data: {
      scene: 'amusement-park',
    },
    timeout: 1000,
  })
}
