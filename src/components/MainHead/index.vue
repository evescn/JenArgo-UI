<script setup>
import { onMounted, ref } from 'vue'
import { useServiceStore } from '@/stores'

const serviceStore = useServiceStore()

defineProps({
    namespace: { type: Boolean, default: false },
    en: { type: Boolean, default: false },
    repo: { type: Boolean, default: false },
    urlEnv: { type: Boolean, default: false },
    searchDescribe: { type: String, default: '' },
    add: { type: Boolean, default: false }
})

const emit = defineEmits(['searchChange', 'envChange', 'groupChange', 'urlEnvChange', 'dataList', 'addFunc'])

// 搜索
const searchValue = ref('')

function searchChange() {
    emit('searchChange', searchValue.value)
}

function enChange(val) {
    serviceStore.setRepo(val)
    //子传父
    emit('envChange', val)
    //重新获取一次资源列表
    emit('dataList')
}

function repoChange(val) {
    serviceStore.setRepo(val)
    //子传父
    emit('groupChange', val)
    //重新获取一次资源列表
    emit('dataList')
}

async function urlEnvChange(val) {
    serviceStore.setEnv(val)

    //子传父 重新获取一次资源列表
    ctx.emit('dataList')
}

onMounted(() => {
    //重新获取一次资源列表
    repoChange()
})
</script>

<template>
    <div>
        <a-card :body-style="{ padding: '10px' }">
            <a-row :gutter="24">
                <a-col :span="20">
                    <div style="text-align: left">
                        <!-- 选择框 -->
                        <!-- CiCd 环境选择框：当收到父组件传过来的 en 属性为true时，才展示这个选择框 -->
                        <span v-if="en" style="font-size: 14px">环境：</span>
                        <a-select v-if="en" :options="serviceStore.service.enList" allow-clear placeholder="全部" size="small" style="width: 140px; margin-right: 10px" @change="enChange"></a-select>

                        <!-- CiCd 仓库选择框：当收到父组件传过来的 repo 属性为true时，才展示这个选择框 -->
                        <span v-if="repo" style="font-size: 14px">仓库组：</span>
                        <a-select
                            v-if="repo"
                            :options="serviceStore.service.repoList"
                            allow-clear
                            placeholder="全部"
                            size="small"
                            style="width: 140px; margin-right: 10px"
                            @change="repoChange"
                        ></a-select>

                        <!-- 搜索框 -->
                        <a-input v-model="searchValue" allow-clear placeholder="请输入" size="small" style="width: 200px; margin-right: 10px" @change="searchChange"></a-input>
                        <a-button ghost size="small" type="primary" @click="$emit('dataList')">
                            <template #icon>
                                <icon-search />
                            </template>
                            搜索
                        </a-button>
                    </div>
                </a-col>
                <a-col :span="4">
                    <div style="text-align: right">
                        <a-button v-if="add" ghost size="small" style="margin-right: 10px" type="primary" @click="$emit('addFunc')">
                            <template #icon>
                                <icon-plus />
                            </template>
                            新增
                        </a-button>
                        <a-button ghost size="small" @click="$emit('dataList')">
                            <template #icon>
                                <icon-refresh />
                            </template>
                            刷新
                        </a-button>
                    </div>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style lang="less" scoped>
.ant-btn {
    border-radius: 1px;
}
</style>
