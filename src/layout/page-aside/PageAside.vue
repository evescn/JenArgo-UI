<template>
    <a-layout-sider v-if="!isSmallScreen" breakpoint="xl" collapsible>
        <!-- <AsideLogo /> -->
        <AsideMenu />
        <template #trigger="{ collapsed }">
            <icon-menu-unfold v-if="collapsed" />
            <icon-menu-fold v-else />
        </template>
    </a-layout-sider>

    <a-drawer
        :visible="isMenuVisiable"
        placement="left"
        :footer="false"
        mask-closable
        :closable="false"
        @cancel="drawerCancel"
    >
        <AsideMenu />
    </a-drawer>
</template>

<script setup lang="ts">
import AsideMenu from './AsideMenu.vue';
import { injectMenu } from '../hooks/useMenu';
import useScreenSize from '../hooks/useScreenSize';

const { isSmallScreen } = useScreenSize();

const { isMenuVisiable } = injectMenu();
const drawerCancel = () => {
    isMenuVisiable.value = false;
};
</script>
