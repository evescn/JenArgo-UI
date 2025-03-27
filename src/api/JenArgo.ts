import http from '@/utils/request.ts'
import type {
    RequestApp,
    RequestArgoCDImage,
    RequestArgoCDList,
    RequestArgoCDLog,
    RequestDelDeploy,
    RequestDeploy,
    RequestDeployCiCd,
    RequestDeployList,
    RequestProjectBranch,
    RequestProjects,
    RequestRolloutArgoCD
} from '@/type/JenArgo.ts' // 仓库组

// 仓库组
export function apiGetGitLabGroups() {
    return http.get(`/api/gitlab/groups`)
}

export function apiGetGitLabProjects(params: RequestProjects) {
    return http.get(`/api/gitlab/projects`, { params: params })
}

export function apiGetGitLabProjectBranch(params: RequestProjectBranch) {
    return http.get(`/api/gitlab/project/branch`, { params: params })
}

// App
export function apiAddApp(params: RequestApp) {
    return http.post(`/api/app/add`, params)
}

// Deploy
export function apiGetDeploysList(params: RequestDeployList) {
    return http.get(`/api/deploy/list`, { params: params })
}

export function apiUpdateDeploy(params: RequestDeploy) {
    return http.post(`/api/deploy/update`, params)
}

export function apiDelDeploy(params: RequestDelDeploy) {
    return http.post(`/api/deploy/del`, params)
}

export function apiAddDeploy(params: RequestDeploy) {
    return http.post(`/api/deploy/add`, params)
}

// CiCd
export function apiDeployCiCd(params: RequestDeployCiCd) {
    return http.post(`/api/cicd/deployCiCd`, params)
}

// ArgoCD
export function apiGetArgoCDAppsList(params: RequestArgoCDList) {
    return http.get(`/api/argocd/apps`, { params: params })
}

export function apiGetArgoCDImageList(params: RequestArgoCDImage) {
    return http.get(`/api/argocd/image`, { params: params })
}

export function apiRolloutArgoCD(params: RequestRolloutArgoCD) {
    return http.post(`/api/argocd/rollback`, params)
}

export function apiArgoCDLog(params: RequestArgoCDLog) {
    return http.get(`/api/argocd/log`, { params: params })
}
