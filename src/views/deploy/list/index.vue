<script lang="ts" setup xmlns="http://www.w3.org/1999/html">
import { ref } from 'vue'
import Pager from '@/components/Pager.vue'
import { Message, TableColumnData } from '@arco-design/web-vue'
import { apiAddDeploy, apiDelDeploy, apiDeployCiCd, apiGetDeploysList, apiGetGitLabProjects, apiUpdateDeploy } from '@/api/JenArgo.ts'
import ModalCreate from './components/ModalCreate.vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { showConfirm } from '@/utils/modal.ts'
import { useServiceStore, useUserStore } from '@/stores'

const serviceStore = useServiceStore()
const userStore = useUserStore()

const query = ref({
    page: 1,
    size: 10,
    en: '',
    app_name: '',
    repo_name: ''
})

const columns = ref<TableColumnData[]>([
    {
        title: 'ID',
        dataIndex: 'id',
        width: 230
    },
    {
        title: '应用名',
        dataIndex: 'app_name',
        width: 180,
        slotName: 'app_name'
    },
    {
        title: '仓库',
        dataIndex: 'repo_name',
        width: 100,
        slotName: 'repo_name'
    },
    {
        title: '环境',
        dataIndex: 'en',
        slotName: 'en'
    },
    {
        title: '版本分支',
        dataIndex: 'branch',
        width: 300,
        slotName: 'branch'
    },
    {
        title: 'TAG',
        dataIndex: 'tag',
        slotName: 'tag'
    },
    {
        title: '定时任务',
        dataIndex: 'has_scheduled_tasks',
        slotName: 'has_scheduled_tasks'
    },
    {
        title: '状态',
        dataIndex: 'status',
        slotName: 'status'
    },
    {
        title: '开始时间',
        dataIndex: 'start_time',
        slotName: 'start_time'
    },
    {
        title: '发布时长',
        dataIndex: 'duration',
        slotName: 'duration'
    },
    {
        title: '代码检查',
        dataIndex: 'code_check',
        align: 'center',
        slotName: 'code_check'
    },
    {
        title: '代码编译',
        dataIndex: 'build_status',
        align: 'center',
        slotName: 'build_status'
    },
    {
        title: '服务部署',
        dataIndex: 'deploy_status',
        align: 'center',
        slotName: 'deploy_status'
    },
    {
        title: '发布者',
        dataIndex: 'builder'
    },
    {
        title: '创建时间',
        dataIndex: 'CreatedAt',
        slotName: 'CreatedAt'
    },
    {
        title: '操作',
        slotName: 'action',
        fixed: 'right',
        align: 'center',
        width: '280'
    }
])
const deployList = ref([])
const appLoading = ref(true)

// 获取列表
async function getDeploysList() {
    appLoading.value = true
    let params = {
        ...query.value
    }
    const res = await apiGetDeploysList(params)
    deployList.value = res.data?.items || []
    appLoading.value = false
}

// 翻页
const onPageChange = ({ page, size }: { page: number; size: number }) => {
    Object.assign(query.value, { size, page })
    getDeploysList()
}

function getEnValue(params: string) {
    query.value.page = 1
    query.value.en = params
}

function getRepoValue(params: string) {
    query.value.page = 1
    query.value.repo_name = params
}

function getSearchValue(params: string) {
    query.value.page = 1
    query.value.app_name = params
}

// handleCreate
const createModelData = ref({
    createDrawer: false,
    createType: '',
    createDeploy: {
        id: 0,
        app_name: '',
        app_id: '',
        repo_name: '',
        en: '',
        branch: '',
        tag: false,
        has_scheduled_tasks: false,
        start_time: ''
    }
})

const appList = ref()

async function getAppsList(id: number, val: any) {
    let params = {
        page: 1,
        size: 1000,
        app_name: '',
        group_id: id
    }
    const res = await apiGetGitLabProjects(params)
    appList.value = (res?.data || [])?.map((v: any) => {
        return {
            value: v.id,
            label: v.name
        }
    })
    createModelData.value.createDeploy.app_id = appList.value.find((item: any) => item.label === val.app_name).value
}

function handleCreate(type: string, val: any) {
    if (type === 'create') {
        createModelData.value.createDrawer = true
        createModelData.value.createType = 'create'
    } else {
        const group_id = serviceStore.service.repoList.find((item: any) => item.label === val.repo_name).value
        getAppsList(group_id, val)

        Object.assign(createModelData.value.createDeploy, {
            ...val,
            group_id: group_id
        })
        createModelData.value.createDrawer = true
        createModelData.value.createType = 'update'
    }
}

const formRef = ref()

async function createDeploy() {
    appLoading.value = true

    let params = {
        ...createModelData.value.createDeploy
    }

    try {
        if (createModelData.value.createType === 'create') {
            const res = await apiAddDeploy(params)
            Message.success(res.msg)
        } else {
            const res = await apiUpdateDeploy(params)
            Message.success(res.msg)
        }
    } catch (e) {
        createModelData.value.createDrawer = false
    }

    getDeploysList()
    createModelData.value = {
        createDrawer: false,
        createType: '',
        createDeploy: {
            id: 0,
            app_name: '',
            app_id: '',
            repo_name: '',
            en: '',
            branch: '',
            tag: false,
            has_scheduled_tasks: false,
            start_time: ''
        }
    }
    appLoading.value = false
}

// del
async function delDeploy(row: any) {
    appLoading.value = true
    let params = {
        id: row.id
    }
    const res = await apiDelDeploy(params)
    Message.success(res.msg)
    getDeploysList()
    appLoading.value = false
}

function gotoJenkins(record: any) {
    window.open(record.build_url, '_blanik')
}

async function deployCiCd(record: any) {
    appLoading.value = true
    let params = {
        id: record.id,
        builder: userStore.user.username
    }
    const res = await apiDeployCiCd(params)
    Message.success(res.msg)
    getDeploysList()
    appLoading.value = false
}
</script>

<template>
    <MainHead add en repo @addFunc="handleCreate('create', '')" @dataList="getDeploysList" @envChange="getEnValue" @groupChange="getRepoValue" @searchChange="getSearchValue" />
    <!-- 表格数据 -->
    <a-card>
        <a-table :columns="columns" :data="deployList" :loading="appLoading" :pagination="false" style="font-size: 12px">
            <template #app_name="{ record }">
                <span style="font-weight: bold; color: rgb(70, 75, 179)">{{ record.app_name }}</span>
            </template>
            <template #repo_name="{ record }">
                <span v-if="record.repo_name === 'bhbl'" style="color: rgb(84, 138, 238)">{{ record.repo_name }}</span>
                <span v-else-if="record.repo_name === 'inf'" style="color: rgb(185, 117, 76)">{{ record.repo_name }}</span>
                <span v-else-if="record.repo_name === 'fe'" style="color: rgb(168, 104, 204)">{{ record.repo_name }}</span>
            </template>
            <template #en="{ record }">
                <a-tag v-if="record.en == 't1'" color="blue">{{ record.en }}</a-tag>
                <a-tag v-else-if="record.en == 't3'" color="cyan">{{ record.en }}</a-tag>
                <a-tag v-else-if="record.en == 'd1'" color="yellow">{{ record.en }}</a-tag>
                <a-tag v-else color="orange">{{ record.en }}</a-tag>
            </template>
            <template #branch="{ record }">
                <span style="color: rgb(84, 138, 238)">{{ record.branch }}</span>
            </template>
            <template #tag="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.tag === true" :percent="1" size="mini" status="success" type="circle" />
                </a-space>
            </template>
            <template #has_scheduled_tasks="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.has_scheduled_tasks === true" :percent="1" size="mini" status="success" type="circle" />
                </a-space>
            </template>
            <template #status="{ record }">
                <a-progress v-if="record.status === 4" :percent="1" :steps="5" size="small" status="danger" stroke-color="#a61d24">
                    <template v-slot:text="scope">
                        <a-progress :percent="1" size="mini" status="danger" />
                    </template>
                </a-progress>
                <a-progress v-else-if="record.status === 3" :percent="1" :steps="5" size="small" status="success" stroke-color="#52c41a">
                    <template v-slot:text="scope">
                        <a-progress :percent="1" size="mini" status="success" type="circle" />
                    </template>
                </a-progress>
                <a-progress v-else-if="record.status === 2" :percent="0.5" :steps="5" size="small" stroke-color="#52c41a" />
                <a-progress v-else-if="record.status === 1" :percent="0.1" :steps="5" size="small" stroke-color="#52c41a" />
                <a-progress v-else-if="record.status === 0" :percent="0" :steps="5" size="small" />
                <a-progress v-else :percent="0.5" :steps="5" size="small" />
            </template>
            <template #CreatedAt="{ record }">
                <a-tag color="gray">{{ dayjs(record?.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}</a-tag>
            </template>

            <template #start_time="{ record }">
                <a-tag v-if="record.start_time">{{ record.start_time }}</a-tag>
            </template>
            <template #duration="{ record }">
                <a-tag v-if="record.duration">{{ record.duration }}</a-tag>
            </template>
            <template #code_check="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.code_check === 2" :percent="1" size="mini" status="danger" />
                    <a-progress v-else-if="record.code_check === 1" :percent="1" size="mini" status="success" />
                </a-space>
            </template>
            <template #build_status="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.build_status === 2" :percent="1" size="mini" status="danger" />
                    <a-progress v-else-if="record.build_status === 1" :percent="1" size="mini" status="success" />
                </a-space>
            </template>
            <template #deploy_status="{ record }">
                <a-space :size="0">
                    <a-progress v-if="record.deploy_status === 2" :percent="1" size="mini" status="danger" />
                    <a-progress v-else-if="record.deploy_status === 1" :percent="1" size="mini" status="success" />
                </a-space>
            </template>
            <template #action="{ record }">
                <div class="button-container">
                    <a-button :disabled="record.status !== 0" size="small" @click="deployCiCd(record)"> 构建</a-button>
                    <a-button :disabled="record.status === 0" size="small" @click="gotoJenkins(record)"> 详情</a-button>
                    <a-button :disabled="record.status !== 0" size="small" @click="handleCreate('update', record)"> 编辑 </a-button>
                    <a-button :disabled="record.status !== 0" size="small" @click="showConfirm('删除', record, delDeploy)">删除 </a-button>
                </div>
            </template>
            <template #footer>
                <a-row align="center" justify="end">
                    <a-col :span="12">
                        <div class="page-right">
                            <Pager :length="deployList?.length || 0" :loading="appLoading" :pageNum="query.page" :pageSize="query.size" @change="onPageChange" />
                        </div>
                    </a-col>
                </a-row>
            </template>
        </a-table>
    </a-card>

    <ModalCreate ref="formRef" v-model="createModelData" @create="createDeploy" />
</template>

<style scoped>
.button-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;
    gap: 1em; /* 自定义按钮之间的间距 */
}

.button-container .arco-btn {
    border-color: transparent; /* 去掉按钮边框 */
    background-color: transparent; /* 可选：如果需要去掉背景颜色 */
    padding: 0;
}
</style>
