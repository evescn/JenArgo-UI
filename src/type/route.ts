/**
 * @description 路由模型
 */
export interface Route {
    id: number
    name: string
    path: string
    component: any
    filePath: string
    realPath: string
    redirect: string
    meta: {
        title: string
        icon: string
        operations: string[] | null
    }
    type: number
    hidden: number
    children: Array<Route> | []
}

/**
 * @description 接口返回数据模型
 */
export interface resData {
    data: any | null | undefined
    msg: number | null | undefined
    status: number | null | undefined
}
