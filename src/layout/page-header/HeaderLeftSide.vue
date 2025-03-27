<template>
    <div class="header-left">
        <router-link v-if="!isSmallScreen" class="logo-box" to="/">
            <img alt="" class="logo-img" src="@/assets/cicd.png" />
            <h5 class="logo-text">JenArgo 系统</h5>
        </router-link>

        <icon-menu v-else @click="showMenu" />
    </div>
</template>

<script lang="ts" setup>
import { injectMenu } from '../hooks/useMenu'
import useScreenSize from '../hooks/useScreenSize'

const { isSmallScreen } = useScreenSize()

const { showMenu } = injectMenu()
</script>

<style lang="less" scoped>
.header-left {
    display: flex;
    align-items: center;
}

.logo-box {
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 1.4;
    color: var(--color-text-1);

    &:active {
        color: var(--color-text-1);
    }
}

.logo-img {
    display: block;
    //width: 33px;
    height: 33px;
    margin-right: 12px;
}

.logo-text {
    font-weight: bold; /* 可以加粗让字体更明显 */
}

::v-deep(.logo-box) {
    text-decoration: none !important;
}

::v-deep(.logo-text) {
    text-decoration: none !important;
}
</style>
