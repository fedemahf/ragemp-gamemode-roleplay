import { defineStore } from "pinia";

export const useRegisterStore = defineStore({
  id: "register",
  state: () => ({
    nameAvailable: false,
    emailChecked: false,
  }),
});
