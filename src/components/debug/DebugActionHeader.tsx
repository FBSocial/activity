import { useActivityInfo } from '@/contexts/activity-info/ActivityInfoContext'
import { getUserToken } from '@/services/http/signature_headers'
import React, { useEffect, useState } from 'react'

interface DebugActionHeaderProps {
  onLogout?: () => void // 预留退出登录操作
}

/**
 * 活动页面顶部栏组件
 *
 * 显示活动ID、当前模式和用户信息，预留了退出登录等操作的接口
 *
 * @param {Object} props - 组件属性
 * @param {Function} [props.onLogout] - 退出登录回调函数
 * @param {string} [props.userToken] - 用户 token
 * @returns {JSX.Element} 渲染的顶部栏组件
 */
const DebugActionHeader: React.FC<DebugActionHeaderProps> = ({ onLogout }) => {
  const { activityId, mode } = useActivityInfo()
  const [showDetails, setShowDetails] = useState(false)

  const getModeText = (mode: string) => {
    switch (mode) {
      case 'guest':
        return '游客'
      case 'preview':
        return '预览'
      default:
        return '正常'
    }
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-opacity-80 bg-gradient-to-r from-blue-500 to-purple-500 p-2 text-white shadow-md">
      <div className="flex flex-1 items-center justify-start">
        <div className="mr-1 rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm">
          <span className="font-semibold">活动 ID:</span>
          <span className="ml-1">{activityId}</span>
        </div>
        <div className="mr-1 rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm">
          <span className="font-semibold">模式:</span>
          <span className="ml-1">{getModeText(mode)}</span>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm hover:bg-opacity-30">
            退出登录
          </button>
        )}
      </div>
      <div className="relative">
        <button onClick={() => setShowDetails(!showDetails)} className="hover:bg-opacity-3 rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm">
          更多信息
        </button>
        {showDetails && <DetailsCard />}
      </div>
    </div>
  )
}

/**
 * 详细信息卡片组件
 *
 * @param {Object} props - 组件属性
 * @param {string} [props.userToken] - 用户 token
 * @returns {JSX.Element} 渲染的详细信息卡片
 */
const DetailsCard: React.FC<{ userToken?: string }> = () => {
  const [userToken, setUserToken] = useState<string>()
  useEffect(() => {
    getUserToken().then(token => {
      setUserToken(token)
    })
  }, [])
  return (
    <div className="absolute right-0 mt-2 w-64 rounded-md bg-white p-4 shadow-lg">
      <h3 className="mb-2 text-sm font-semibold text-gray-800">用户信息</h3>
      <div className="text-sm text-gray-600">
        <p className="mb-1">
          <span className="font-medium">Token:</span>
          <div className="break-all">{userToken}</div>
        </p>
        {/* 可以在这里添加更多用户信息 */}
      </div>
    </div>
  )
}

export default DebugActionHeader
