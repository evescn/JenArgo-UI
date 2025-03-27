import { defineStore } from 'pinia'
import { getPermission } from '@/api/rbac.ts'
import { computed, ref } from 'vue'
import type { PermissionRes } from '@/type/rbac.ts'
import type { Route } from '@/type/route.ts'

export const usePermissionStore = defineStore('permission', () => {
    // 使用 ref 来定义 permission，初始值为一个空数组
    const permission = ref()

    // computed getter routes 需要使用 permission.value
    const routes = computed(() => {
        if (!permission.value.length) return []
        return generateRoutes(permission.value)
    })

    async function setPermission() {
        const res = await getPermission({
            system: 'JenArgo'
        })
        // 使用 permission.value 赋值
        permission.value = res.data.list || []
    }

    return {
        permission,
        routes,
        setPermission
    }
})

const modules = import.meta.glob('../views/**/*.vue')

function generateRoutes(routes: PermissionRes[] | null, parentPath?: string): Route[] {
    if (!routes) return []
    return routes.map((route: PermissionRes) => {
        const realPath = parentPath === undefined ? route.path : `${parentPath}/${route.path}`

        const component = route.file_path.match(/^(\/)?layout(\/index)?$/)
            ? () => import('@/layout/index.vue')
            : modules[`../views/${route.file_path.indexOf('index') > -1 ? route.file_path : '/index'}.vue`]

        const children = route.children?.length !== 0 ? generateRoutes(route.children, route.path) : []

        const newRoute = {
            ...route,
            realPath,
            component,
            children
        }
        
        return newRoute
    })
}
