export interface PermissionRes {
    id: number
    name: string
    path: string
    filePath: string
    file_path: string
    redirect: string
    meta: {
        title: string
        icon: string
        operations: string[] | null
    }
    type: number
    hidden: number
    children: Array<PermissionRes> | null
}

export interface RequestMenu {
    system: string
}

export interface RequestLogin {
    username: string
    password: string
}
