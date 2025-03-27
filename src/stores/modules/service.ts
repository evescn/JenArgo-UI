import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetGitLabGroups } from '@/api/JenArgo.ts'
import config from '@/config'

// 数字计数器模块
export const useServiceStore = defineStore(
    'service',
    () => {
        const service = ref({
            repoList: [],
            repo: '',
            enList: config.enList,
            en: '',
            urlEnv: 'DevOPS',
            urlEnvID: '',
            visibility: config.visibility
        })
        const getServiceInfo = async () => {
            const res = await apiGetGitLabGroups()
            service.value.repoList = (res?.data || [])?.map((v: any) => {
                return {
                    value: v.id,
                    label: v.name
                }
            })
        }

        const setRepo = (obj: string) => {
            service.value.repo = obj
            localStorage.setItem('repo', obj)
        }

        const setEn = (obj: string) => {
            service.value.en = obj
            localStorage.setItem('en', obj)
        }

        const setEnv = (obj: string) => {
            service.value.urlEnv = obj
            localStorage.setItem('urlEnv', obj)
        }

        return {
            service,
            getServiceInfo,
            setRepo,
            setEn,
            setEnv
        }
    },
    {
        persist: true
    }
)
