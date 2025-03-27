<template>
    <div class="main-content">
        <router-view v-slot="{ Component, route }">
            <keep-alive v-if="route.meta.keepAlive">
                <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component :is="Component" v-else :key="route.fullPath" />
        </router-view>
    </div>
</template>
<script lang="ts" setup></script>

<style lang="less" scoped>
.main-content {
    padding: 0 20px 20px;
}
</style>
