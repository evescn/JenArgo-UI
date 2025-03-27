<template>
    <ul class="header-right">
        <li class="nav-item">
            <ProfileNav />
        </li>
    </ul>
</template>

<script setup lang="ts">
import ProfileNav from './ProfileNav.vue';
</script>

<style scoped>
.header-right {
    display: flex;
    align-items: center;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
}
</style>
