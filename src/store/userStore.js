import { defineStore } from "pinia";

const userStore = defineStore(
  "useUserStore",
  () => {
    const accountID = ref("");
    const setAccountID = id => {
      accountID.value = id;
    };

    return {
      accountID,
      setAccountID,
    };
  },
  {
    persist: true,
  }
);

export { userStore };
