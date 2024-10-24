import NotFound from '@/pages/404'
import ActivityNotFound from '@/pages/ActivityNotFound'
import { createBrowserRouter } from 'react-router-dom'
import { ActivityOutlet } from './outlet/ActivityOutlet'

type BrowserRouter = ReturnType<typeof createBrowserRouter>

const router: BrowserRouter = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        {
          index: true,
          element: <ActivityNotFound />,
        },
        {
          path: 'login',
          lazy: () => import('@/pages/login'),
        },
        {
          path: 'bind-account',
          lazy: () => import('@/pages/bind-account'),
        },
        {
          path: ':activityId',
          element: <ActivityOutlet />,
          children: [
            {
              index: true,
              lazy: () => import('@/pages/activity'),
            },
          ],
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
      errorElement: <NotFound />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default router
