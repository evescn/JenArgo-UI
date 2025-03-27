<template>
    <a-dropdown trigger="click">
        <div class="profile-box">
            <a-avatar :size="28" class="avatar">
                <IconUser />
            </a-avatar>
            <span class="user-name">{{ username }}</span>
        </div>
        <template #content>
            <a-doption>
                <a-space @click="handleLogout">
                    <icon-export />
                    <span>退出登录</span>
                </a-space>
            </a-doption>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
// username 信息
const username = userStore.user.username

const router = useRouter()

// 退出登陆
const handleLogout = () => {
    userStore.removeToken()

    // 跳转到 /login 页面
    router.push('/login')
}
</script>

<style scoped>
.profile-box {
    cursor: pointer;
}

.avatar {
    margin-right: 8px;
}
</style>
