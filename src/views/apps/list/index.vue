<script lang="ts" setup>
import { ref } from 'vue'
import Pager from '@/components/Pager.vue'
import { Message, TableColumnData } from '@arco-design/web-vue'
import { apiAddApp, apiGetGitLabProjects } from '@/api/JenArgo.ts'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import ModalCreate from './components/ModalCreate.vue'

const query = ref({
    page: 1,
    size: 10,
    app_name: '',
    group_id: 0
})

const columns = ref<TableColumnData[]>([
    {
        title: '应用名',
        dataIndex: 'name'
    },
    {
        title: '仓库组',
        dataIndex: 'repo_name',
        render: ({ record }): string => {
            return record?.namespace.name
        }
    },
    {
        title: '仓库地址',
        dataIndex: 'web_url',
        slotName: 'url'
    },
    {
        title: '仓库描述',
        dataIndex: 'description'
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        slotName: 'created_at'
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
    const res = await apiGetGitLabProjects(params)
    appList.value = res.data || []
    // debugger
    appLoading.value = false
}

// 翻页
const onPageChange = ({ page, size }: { page: number; size: number }) => {
    Object.assign(query.value, { size, page })
    getAppsList()
}

function getRepoValue(params: number) {
    query.value.page = 1
    query.value.group_id = params
}

function getSearchValue(params: string) {
    query.value.page = 1
    query.value.app_name = params
}

// handleCreate
const createModelData = ref({
    createDrawer: false,
    createApp: {
        group_name: '',
        project_name: '',
        group_id: null,
        visibility: '',
        desc: '',
        has_jenkins: false
    }
})

function handleCreate() {
    createModelData.value.createDrawer = true
}

async function createApp() {
    appLoading.value = true

    let params = {
        ...createModelData.value.createApp
    }

    const res = await apiAddApp(params)
    Message.success(res.msg)
    getAppsList()

    createModelData.value = {
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
</script>

<template>
    <MainHead add repo @addFunc="handleCreate" @dataList="getAppsList" @groupChange="getRepoValue" @searchChange="getSearchValue" />
    <!-- 表格数据 -->
    <a-card>
        <a-table :columns="columns" :data="appList" :loading="appLoading" :pagination="false" style="font-size: 12px">
            <template #url="{ record }">
                <a-popover>
                    <template #content>
                        <span>{{ record.web_url }}</span>
                    </template>
                    <a-tag color="blue">
                        <a :href="record.web_url" style="color: #d67037; cursor: pointer; text-decoration: none" target="_blank">
                            {{ record.web_url.replace(/^(https?:\/\/)gitlab.dayuan1997.com\//, '') }}
                        </a>
                    </a-tag>
                </a-popover>
            </template>
            <template #created_at="{ record }">
                <a-tag color="gray">{{ dayjs(record?.created_at).format('YYYY-MM-DD HH:mm:ss') }}</a-tag>
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

    <ModalCreate v-model="createModelData" @create="createApp" />
</template>

<style scoped></style>
