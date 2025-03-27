import { inject, provide, ref } from 'vue';
import type { Ref } from 'vue';

interface Menu {
    isMenuVisiable: Ref;
    showMenu: () => {};
}

export function provideMenu() {
    const isMenuVisiable = ref(false);
    const showMenu = () => {
        isMenuVisiable.value = true;
    };
    provide('menu', {
        isMenuVisiable,
        showMenu,
    });

    return {
        isMenuVisiable,
        showMenu,
    };
}

export function injectMenu() {
    const { isMenuVisiable, showMenu } = inject('menu') as Menu;

    return { isMenuVisiable, showMenu };
}
