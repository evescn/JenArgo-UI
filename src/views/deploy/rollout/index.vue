<script lang="ts" setup>
import { ref } from 'vue'
import { TableColumnData } from '@arco-design/web-vue'
import { apiArgoCDLog, apiGetArgoCDAppsList, apiGetArgoCDImageList } from '@/api/JenArgo.ts'
import ModalRollout from '@/views/deploy/rollout/components/ModalRollout.vue'
import Pager from '@/components/Pager.vue'

const query = ref({
    page: 1,
    size: 10,
    name: '',
    namespace: ''
})

const columns = ref<TableColumnData[]>([
    {
        title: '应用名称',
        dataIndex: 'metadata.name',
        align: 'center',
        width: '130',
        render: ({ record }) => {
            return record.metadata.name.replace(/^[^-]+-/, '')
        }
    },
    {
        title: '命名空间',
        dataIndex: 'spec.destination.namespace',
        align: 'center',
        width: '120'
    },
    {
        title: '应用状态',
        dataIndex: 'status.health.status',
        slotName: 'status',
        align: 'center'
    },
    {
        title: '镜像',
        dataIndex: 'status.summary.images',
        align: 'center',
        slotName: 'image'
    },
    {
        title: '更新时间',
        dataIndex: 'status.operationState.finishedAt',
        render: ({ record }) => {
            return record.status?.operationState?.finishedAt ? formatDateWithTZ(record.status?.operationState?.finishedAt) : ''
        }
    },
    {
        title: '创建时间',
        dataIndex: 'metadata.creationTimestamp',
        render: ({ record }) => {
            return formatDateWithTZ(record.metadata?.creationTimestamp)
        }
    },
    {
        title: '操作',
        slotName: 'action',
        fixed: 'right',
        align: 'center',
        width: '200'
    }
])
const appList = ref([])
const appLoading = ref(true)

// 获取列表
async function getAppsList() {
    appLoading.value = true
    let params = {
        ...query.value
    }
    const res = await apiGetArgoCDAppsList(params)
    appList.value = res.data?.items || []
    appLoading.value = false
}

// 翻页
const onPageChange = ({ page, size }: { page: number; size: number }) => {
    Object.assign(query.value, { size, page })
    getAppsList()
}

function getEnValue(params: string) {
    query.value.page = 1
    query.value.namespace = params
}

function getSearchValue(params: string) {
    query.value.page = 1
    query.value.name = params
}

function formatDateWithTZ(isoStr: string) {
    // 创建 Date 对象，默认按 UTC 解析
    const date = new Date(isoStr)

    // 获取各时间字段，并补零
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取服务信息
const createModelData = ref({
    createModal: false,
    createRollout: [],
    name: '',
    id: null
})

async function getAppInfo(name: string) {
    createModelData.value.createModal = true
    createModelData.value.name = name
    let params = {
        name: name
    }
    const res = await apiGetArgoCDImageList(params)
    createModelData.value.createRollout = (res?.data?.images || [])?.map((v: any) => {
        return {
            value: v.id,
            label: v.image.split('/').pop() ? v.image.split('/').pop() : v.image
        }
    })
}

//截取容器名称中前面的镜像仓库地址
function ellipsis(val: any, len: number) {
    return val.length > len ? val.substring(0, len) + '...' : val
}

// 获取列表
const logInfo = ref()
const visible = ref(false)

async function getLog(record: any) {
    let params = {
        name: record.metadata.name,
        namespace: record.spec.destination.namespace
    }
    const res = await apiArgoCDLog(params)
    logInfo.value = res.data || []
    visible.value = true
}

const handleOk = async () => {
    logInfo.value = []
    visible.value = false
}
</script>

<template>
    <MainHead en @dataList="getAppsList" @envChange="getEnValue" @searchChange="getSearchValue" />
    <!-- 表格数据 -->
    <a-card>
        <a-table :columns="columns" :data="appList" :loading="appLoading" :pagination="false" style="font-size: 12px">
            <template #status="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.status.health.status === 'Progressing'" :percent="1" size="mini" status="warning" />
                    <a-progress v-else-if="record.status.health.status === 'Healthy'" :percent="1" size="mini" status="success" type="circle" />
                </a-space>
            </template>
            <template #image="{ record }">
                <div v-for="(item, key) in record.status.summary.images" :key="key">
                    <a-popover>
                        <template #content>
                            <span>{{ item }}</span>
                        </template>
                        <a-tag color="arcoblue" style="margin-bottom: 5px; cursor: pointer">
                            {{ ellipsis(item.split('/').pop() ? item.split('/').pop() : item, 100) }}
                        </a-tag>
                    </a-popover>
                </div>
            </template>
            <template #action="{ record }">
                <div class="button-container">
                    <a-button size="small" status="warning" @click="getLog(record)"> 日志</a-button>
                    <a-button size="small" status="danger" @click="getAppInfo(record.metadata.name)"> 回滚</a-button>
                </div>
            </template>
            <template #footer>
                <a-row align="center" justify="end">
                    <a-col :span="12">
                        <div class="page-right">
                            <Pager :length="appList?.length || 0" :loading="appLoading" :pageNum="query.page" :pageSize="query.size" @change="onPageChange" />
                        </div>
                    </a-col>
                </a-row>
            </template>
        </a-table>
    </a-card>

    <ModalRollout v-model="createModelData" />

    <a-modal v-model:visible="visible" :hideCancel="true" :width="'80%'" @cancel="handleOk" @ok="handleOk">
        <template #title> Title</template>
        <pre style="white-space: pre-wrap; word-wrap: break-word; max-height: 800px; overflow-y: auto">
            {{ logInfo }}
        </pre>
    </a-modal>
</template>

<style scoped>
.button-container .arco-btn {
    margin-right: 20px;
}
</style>
