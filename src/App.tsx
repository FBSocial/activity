import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './routes'
import { setRem } from './utils/screen'
setRem()

/**
 * App 组件
 *
 * 这个组件是应用的根组件，负责渲染路由。
 *
 * @returns {JSX.Element} 渲染的 RouterProvider 组件
 */
function App() {
  // 检查 router 是否正确导入
  if (!router) {
    console.error('路由配置未正确导入')
    return <div>加载错误：路由配置未找到</div>
  }

  return <RouterProvider router={router} fallbackElement={<div></div>} />
}

export default App

// 注意：请确保 src/routes.ts 文件存在并正确导出了路由配置
// 如果路由配置正确，但页面仍然不渲染，可能需要检查以下几点：
// 1. 路由配置中是否正确设置了路径和对应的组件
// 2. 组件是否正确导出和导入
// 3. 是否有任何控制台错误提示其他问题
