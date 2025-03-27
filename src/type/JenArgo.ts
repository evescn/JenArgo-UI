export interface RequestProjects {
    page: number
    size: number
    app_name: string
    group_id: number
}

export interface RequestProjectBranch {
    app_id: number
    branch_or_tag: boolean
}

export interface RequestApp {
    group_name: string
    project_name: string
    group_id: any
    visibility: string
    desc: string
    has_jenkins: boolean
}

export interface RequestDeployList {
    page: number
    size: number
    en: string
    app_name: string
    repo_name: string
}

export interface RequestDeploy {
    id: number
    app_name: string
    repo_name: string
    en: string
    branch: string
    tag: boolean
    has_scheduled_tasks: boolean
    start_time: string
}

export interface RequestDelDeploy {
    id: number
}

export interface RequestDeployCiCd {
    id: string
    builder: string
}

export interface RequestArgoCDList {
    page: number
    size: number
    name: string
    namespace: string
}

export interface RequestArgoCDImage {
    name: string
}

export interface RequestRolloutArgoCD {
    name: string
    rollback_id: number
}

export interface RequestArgoCDLog {
    name: string
    namespace: string
}
