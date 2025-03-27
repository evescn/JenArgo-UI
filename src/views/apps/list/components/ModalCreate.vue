<script setup>
import { ref } from 'vue'
import { showConfirm } from '@/utils/modal.ts'
import { useServiceStore } from '@/stores'

const serviceStore = useServiceStore()

const formData = defineModel({
    type: Object
})

const emit = defineEmits(['create'])

const formRef = ref()

//关闭抽屉
function onClose() {
    showConfirm('关闭', '', close)
}

function close() {
    formData.value = {
        createDrawer: false,
        createApp: {
            group_name: '',
            project_name: '',
            group_id: null,
            visibility: '',
            desc: '',
            has_jenkins: false
        }
    }
}

const formSubmit = async () => {
    await formRef.value.validate()
    emit('create')
}

const gitlabName = () => {
    formData.value.createApp.group_name = serviceStore.service.repoList.find((item) => item.value === formData.value.createApp.group_id).label
}
</script>

<template>
    <!-- 创建deployment的抽屉弹框 -->
    <a-drawer :footer-style="{ textAlign: 'right' }" :visible="formData.createDrawer" :width="380" title="创建 App" @cancel="onClose">
        <br />
        <a-form ref="formRef" :labelCol="{ style: { width: '50%' } }" :model="formData.createApp">
            <a-form-item :rules="[{ required: true, message: '请输入应用名' }]" label="应用名" label-col-flex="120px" name="project_name">
                <a-input v-model="formData.createApp.project_name"></a-input>
            </a-form-item>
            <a-form-item :rules="[{ required: true, message: '请输入仓库名' }]" label="仓库" label-col-flex="120px" name="group_id">
                <a-select v-model="formData.createApp.group_id" :options="serviceStore.service.repoList" placeholder="请选择" show-search @change="gitlabName" />
            </a-form-item>

            <a-form-item :rules="[{ required: true, message: '请输入仓库权限' }]" label="GitLab 仓库权限" label-col-flex="120px" name="visibility">
                <a-select v-model="formData.createApp.visibility" :options="serviceStore.service.visibility" placeholder="请选择" show-search size="small" />
            </a-form-item>
            <a-form-item label="创建 Pipeline" label-col-flex="120px" name="has_jenkins">
                <a-switch v-model="formData.createApp.has_jenkins" style="margin-right: 20px" />
            </a-form-item>
            <a-form-item :rules="[{ required: true, message: '请输入应用描述' }]" label="描述" label-col-flex="120px" name="desc">
                <a-textarea v-model="formData.createApp.desc" show-count />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button style="margin-right: 8px" @click="onClose()">取消</a-button>
            <a-button type="primary" @click="formSubmit()">创建</a-button>
        </template>
    </a-drawer>
</template>

<style scoped></style>
