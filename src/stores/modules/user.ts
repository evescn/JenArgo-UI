import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
    'rbac-user',
    () => {
        const token = ref('')
        const setToken = (newToken: string) => {
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }

        const user = ref({})
        const setUser = (obj: any) => {
            user.value = obj
        }

        return {
            token,
            setToken,
            removeToken,
            user,
            setUser
        }
    },
    {
        persist: true
    }
)
