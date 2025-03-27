import { createRouter, createWebHistory } from 'vue-router'
import { usePermissionStore, useUserStore } from '@/stores'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: () => import('@/views/login/index.vue')
        },
        {
            path: '/',
            redirect: '/apps/list/'
        }
    ]
})

// 结合路由守卫，去开启和关闭进度条
// router.beforeEach((to, from, next) => {
//     // 设置头部 title
//     document.title = to.meta.title || 'JenArgo'
//
//     // 放行
//     next()
// })

router.beforeEach(async (to, from, next) => {
    const store = usePermissionStore()
    // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
    const userStore = useUserStore()
    if (to.path === '/login') {
        next()
    } else if (!userStore.token && to.path !== '/login') {
        next('/login')
    } else {
        // 设置路由
        if (!store.permission) {
            await store.setPermission()
            store.routes.forEach((item: any) => {
                router.addRoute(item)
            })
            next(to)
        }
        next()
    }
})

export default router
