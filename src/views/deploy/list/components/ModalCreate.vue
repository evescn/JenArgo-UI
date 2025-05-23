<script setup>
import { onMounted, ref, watch } from 'vue'
import { showConfirm } from '@/utils/modal.ts'
import { useServiceStore } from '@/stores'
import { apiGetGitLabProjectBranch, apiGetGitLabProjects } from '@/api/JenArgo.js'

const serviceStore = useServiceStore()

const formData = defineModel({
    type: Object
})

const emit = defineEmits(['create'])

const formRef = ref()

//关闭抽屉
function onClose() {
    showConfirm('关闭', '', close)
    appList.value = []
    branchList.value = []
    tagList.value = []
}

function close() {
    formData.value = {
        createDrawer: false,
        createType: '',
        createDeploy: {
            app_name: '',
            app_id: '',
            repo_name: '',
            en: '',
            branch: '',
            tag: false
        }
    }
}

const formSubmit = async () => {
    let validateRes1 = await formRef.value.validate()
    if (!validateRes1) {
        emit('create')
    }
}

const gitlabRepo = () => {
    formData.value.createDeploy.repo_name = serviceStore.service.repoList.find((item) => item.value === formData.value.createDeploy.group_id).label
    getAppsList()
}

const gitlabApp = () => {
    formData.value.createDeploy.app_name = appList.value.find((item) => item.value === formData.value.createDeploy.app_id).label
    formData.value.createDeploy.branch = ''
}

// appList
const appList = ref([])
const branchList = ref([])
const tagList = ref([])

async function getAppsList() {
    let params = {
        page: 1,
        size: 1000,
        group_id: formData.value.createDeploy.group_id
    }
    const res = await apiGetGitLabProjects(params)
    appList.value = (res?.data || [])?.map((v) => {
        return {
            value: v.id,
            label: v.name
        }
    })
}

async function gitlabBranch() {
    formData.value.createDeploy.branch = ''
    branchList.value = ''
    let params = {
        app_id: formData.value.createDeploy.app_id,
        branch_or_tag: false
    }
    const res = await apiGetGitLabProjectBranch(params)
    branchList.value = res.data.map((item) => item.name)
}

function onChangeBT() {
    if (formData.value.createDeploy.en === 'prod') {
        gitlabTag()
    } else {
        gitlabBranch()
    }
}

async function gitlabTag() {
    formData.value.createDeploy.branch = ''
    tagList.value = ''
    if (formData.value.createDeploy.app_id && tagList.value.length === 0) {
        let params = {
            app_id: formData.value.createDeploy.app_id,
            branch_or_tag: true
        }
        const res = await apiGetGitLabProjectBranch(params)
        tagList.value = res.data.map((item) => item.name)
    }
}

watch(
    () => [formData.value.createDeploy.en, formData.value.createDeploy.app_id],
    ([en, app_id]) => {
        if (en && app_id) {
            onChangeBT()
        }
    }
)

onMounted(() => {
    watch(
        () => formData.value.createType,
        () => {
            if (formData.value.createType === 'update') {
                getAppsList()
            }
        }
    )
})
</script>

<template>
    <!-- 创建deployment的抽屉弹框 -->
    <a-drawer :footer-style="{ textAlign: 'right' }" :visible="formData.createDrawer" :width="380" title="创建 Deploy" @cancel="onClose">
        <a-form ref="formRef" :labelCol="{ style: { width: '50%' } }" :model="formData.createDeploy">
            <a-form-item :rules="[{ required: true, message: '请选择仓库' }]" :validate-trigger="['change', 'input']" field="group_id" label="仓库" label-col-flex="120px">
                <a-select v-model="formData.createDeploy.group_id" :options="serviceStore.service.repoList" allow-search placeholder="请选择" @change="gitlabRepo" />
            </a-form-item>
            <a-form-item :rules="[{ required: true, message: '请选择应用' }]" :validate-trigger="['change', 'input']" field="app_id" label="应用名" label-col-flex="120px">
                <a-select v-model="formData.createDeploy.app_id" :options="appList" allow-search placeholder="请选择" @change="gitlabApp" />
            </a-form-item>
            <a-form-item :rules="[{ required: true, message: '请选择环境' }]" :validate-trigger="['change', 'input']" field="en" label="环境" label-col-flex="120px">
                <a-select v-model="formData.createDeploy.en" :options="serviceStore.service.enList" placeholder="请选择" show-search size="small" />
            </a-form-item>
            <a-form-item
                v-if="formData.createDeploy.en === 'prod'"
                :rules="[{ required: true, message: '请选择Tag' }]"
                :validate-trigger="['change', 'input']"
                field="branch"
                label="Tag"
                label-col-flex="120px"
            >
                <a-select v-model="formData.createDeploy.branch" :options="tagList" :trigger-props="{ autoFitPopupMinWidth: true }" allow-search placeholder="请选择" />
            </a-form-item>
            <a-form-item v-else :rules="[{ required: true, message: '请选择版本分支' }]" :validate-trigger="['change', 'input']" field="branch" label="版本分支" label-col-flex="120px">
                <a-select v-model="formData.createDeploy.branch" :options="branchList" allow-search placeholder="请选择" />
            </a-form-item>
            <a-form-item field="tag" label="打TAG" label-col-flex="120px">
                <a-switch v-model="formData.createDeploy.tag" style="margin-right: 20px" />
            </a-form-item>
            <a-form-item field="has_scheduled_tasks" label="创建定时任务" label-col-flex="120px">
                <a-switch v-model="formData.createDeploy.has_scheduled_tasks" style="margin-right: 20px" />
            </a-form-item>
            <a-form-item v-if="formData.createDeploy.has_scheduled_tasks" field="start_time" label="任务启动时间" label-col-flex="120px">
                <a-date-picker v-model="formData.createDeploy.start_time" format="YYYY-MM-DD HH:mm:ss" show-time />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose()">取消</a-button>
            <a-button type="primary" @click="formSubmit()">创建</a-button>
        </template>
    </a-drawer>
</template>

<style scoped></style>
