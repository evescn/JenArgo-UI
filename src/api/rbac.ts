import rbac from '@/utils/rbac.ts'
import type { RequestLogin, RequestMenu } from '@/type/rbac.ts'

// 用户登录权限接口
export function getPermission(params: RequestMenu) {
    return rbac.get(`/api/menu/list`, { params: params })
}

// 页面权限接口
export function userLogin(params: RequestLogin) {
    return rbac.post(`/api/login`, params)
}
