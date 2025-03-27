import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

export * from './modules/service.ts'
export * from './modules/user.ts'
export * from './permisson.ts'
