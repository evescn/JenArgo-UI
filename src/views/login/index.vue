<script setup>
import { userLogin } from '@/api/rbac.ts'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const form = ref()

// 整个的用于提交的form数据对象
const formModel = ref({
    username: '',
    password: ''
})

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码必须是 6-15位 的非空字符',
            trigger: 'blur'
        }
    ]
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
    await form.value.validate()
    const res = await userLogin(formModel.value)
    userStore.setToken(res.data.token)
    userStore.setUser(res.data)
    Message.success('登录成功')
    router.push('/')
}
</script>

<template>
    <div>
        <a-row class="login-row">
            <a-col :span="12" class="login-bg"></a-col>
            <a-col :offset="3" :span="6" class="form">
                <!-- 登录相关表单 -->
                <a-form ref="form" :model="formModel" :rules="rules" autocomplete="off" size="large">
                    <a-form-item>
                        <h1>登录</h1>
                    </a-form-item>
                    <a-form-item prop="username">
                        <a-input v-model="formModel.username" placeholder="请输入用户名">
                            <template #prefix>
                                <icon-user />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item prop="password">
                        <a-input v-model="formModel.password" name="password" placeholder="请输入密码" type="password">
                            <template #prefix>
                                <icon-lock />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item>
                        <a-button :disabled="isSubmitting" auto-insert-space class="button" type="primary" @click="login">登录 </a-button>
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
    </div>
</template>

<style lang="scss" scoped>
.login-row {
    height: 100vh;
    background-color: #fff;
}

.login-bg {
    height: 100%;
    background:
        url('@/assets/cicd.png') no-repeat 60% center / 360px auto,
        url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
}

.form {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    user-select: none;
}

.form .title {
    margin: 0 auto;
}

.form .button {
    width: 100%;
}

.form .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
