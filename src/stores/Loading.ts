import { defineStore } from "pinia";

export const useLoadingStore = defineStore({
  id: "loading",
  state: () => ({
    show: false,
  }),
  actions: {
    showLoading(status: boolean) {
      this.show = status;
    },
  },
});
