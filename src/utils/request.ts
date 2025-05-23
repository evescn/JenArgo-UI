import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import { Message } from '@arco-design/web-vue'
import { baseHost } from '@/config'

const baseURL = baseHost

const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // TODO 2. 携带token
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = userStore.token
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 4. 摘取核心响应数据
        if (res.data.code === 0) {
            return res.data
        }

        // TODO 3. 处理业务失败
        // 处理业务失败, 给错误提示，抛出错误

        Message.error(res.data.msg || '服务异常')
        return Promise.reject(res.data)
    },
    (err) => {
        // TODO 5. 处理401错误
        // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
        if (err.response?.status === 401) {
            router.push('/login')
        }

        // 错误的默认情况 => 只要给提示
        Message.error(err.response.data.msg || '服务异常')
        return Promise.reject(err)
    }
)

export default instance
export { baseURL }
