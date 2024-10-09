import { useTitle } from 'ahooks'
import React from 'react'

/**
 * 404 页面组件
 *
 * 这个组件用于显示当用户访问不存在的页面时的错误信息。
 * 它提供了一个简洁的界面，并允许用户返回首页。
 */
const NotFound: React.FC = () => {
  useTitle('页面不存在')
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-8 text-center text-xl text-gray-600">抱歉，您要查找的页面不存在。</p>
      {/* <Link to="/" className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-600">
        返回首页
      </Link> */}
    </div>
  )
}

export default NotFound
