<template>
    <div class="menu-wrapper">
        <template v-for="item in routes">
            <template v-if="item.children?.length && item.hidden === 0">
                <a-menu-item v-if="item.children.length === 1" :key="item.children[0].name" :index="item.children[0].name" @click="jumpTo(item.children[0].realPath)">
                    <template #icon>
                        <component :is="item.meta.icon" />
                    </template>
                    {{ item.meta.title }}
                </a-menu-item>

                <a-sub-menu v-else :key="item.name" :index="item.name">
                    <template #title>{{ item.meta.title }}</template>
                    <template #icon>
                        <component :is="item.meta.icon" />
                    </template>
                    <AsideMenuItem :routes="item.children" />
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item v-if="item.hidden === 0" :key="item.name" @click="jumpTo(item.realPath)">
                    <template #icon>
                        <component :is="item.meta.icon" />
                    </template>
                    {{ item.meta.title }}
                </a-menu-item>
            </template>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { Route } from '@/type/route'

defineProps<{
    routes: Route[]
}>()

const router = useRouter()
const jumpTo = (path: string) => {
    router.push({
        path
    })
}
</script>
