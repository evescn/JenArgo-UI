<script lang="ts" setup>
import { ref } from 'vue'
import { apiRolloutArgoCD } from '@/api/JenArgo.ts'
import { Message } from '@arco-design/web-vue'

const formData = defineModel({
    type: Object
})

const handleOk = async () => {
    let params = {
        name: formData.value.name,
        rollback_id: formData.value.id
    }
    debugger
    const res = await apiRolloutArgoCD(params)
    Message.success(res.msg)

    handleCancel()
}
const handleCancel = () => {
    formData.value.id = null
    formData.value = ref({
        createModal: false,
        createRollout: [],
        name: '',
        id: null
    })
}
</script>

<template>
    <a-modal v-model:visible="formData.createModal" @cancel="handleCancel" @ok="handleOk">
        <template #title>
            <div style="color: #9a0c0c">{{ formData.name }} 服务回滚</div>
            <!--<a-alert type="warning">{{ formData.name }} 服务回滚</a-alert>-->
        </template>
        <a-form-item>
            <template #label>
                <div style="color: #b83b3b">回滚版本</div>
            </template>
            <a-select v-model="formData.id" :options="formData.createRollout" />
        </a-form-item>
    </a-modal>
</template>

<style scoped></style>
