import NotFound from '@/pages/404'
import { createBrowserRouter } from 'react-router-dom'
type BrowserRouter = ReturnType<typeof createBrowserRouter>

// 为了确保 NotFound 组件能正常捕获所有未匹配的路由，我们可以做以下调整：
// 1. 将 NotFound 路由移到子路由中
// 2. 使用 errorElement 属性来处理所有未匹配的路由
// 3. 添加一个重定向路由，将根路径重定向到带斜杠的路径

const router: BrowserRouter = createBrowserRouter(
  [
    {
      path: '',
      children: [
        {
          index: true,
          element: <NotFound />, // 重定向到带斜杠的路径
        },
        {
          path: ':activityId',
          lazy: () => import('@/pages/activity'),
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
      errorElement: <NotFound />, // 这将捕获所有未匹配的路由和错误
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default router
