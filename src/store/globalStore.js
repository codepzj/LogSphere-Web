import { defineStore } from "pinia";

const globalStore = defineStore(
    "useGlobalStore",
    () => {
        const NavbarShow = ref(true)
        const setNavbarShow = (status) => NavbarShow.value = status
        return {
            NavbarShow,
            setNavbarShow
        };
    },
    {
        persist: true,
    }
);

export { globalStore };
