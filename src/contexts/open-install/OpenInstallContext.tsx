import React, { createContext, useContext } from 'react'
import { useOpenInstall as useOpenInstallHook } from './useOpenInstall'

// 保留之前的常量定义和辅助函数（initializeOpenInstall, openInFanbook, resetOpenInstall）

interface OpenInstallContextType {
  isReady: boolean
  error: Error | null
  openFanbook: (options?: Record<string, any>) => void
  reinitialize: () => Promise<void>
}

const OpenInstallContext = createContext<OpenInstallContextType | null>(null)

/**
 * OpenInstall Provider 组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {boolean} [props.shouldInitialize=true] - 是否应该初始化 OpenInstall
 */
export function OpenInstallProvider({ children, shouldInitialize = true }: { children: React.ReactNode; shouldInitialize?: boolean }) {
  const { isReady, error, openFanbook, reinitialize } = useOpenInstallHook(shouldInitialize)

  const value = {
    isReady,
    error,
    openFanbook,
    reinitialize,
  }

  return <OpenInstallContext.Provider value={value}>{children}</OpenInstallContext.Provider>
}

/**
 * 自定义 Hook，用于在组件中使用 OpenInstall 功能
 * @returns {OpenInstallContextType} OpenInstall 上下文值
 * @throws {Error} 如果在 OpenInstallProvider 外部使用，则抛出错误
 */
export function useOpenInstallContext(): OpenInstallContextType {
  const context = useContext(OpenInstallContext)
  if (context === null) {
    throw new Error('useOpenInstallContext 必须在 OpenInstallProvider 内部使用')
  }
  return context
}
