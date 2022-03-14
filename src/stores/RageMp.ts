import { defineStore } from "pinia";

export const useRageMpStore = defineStore({
  id: "ragemp",
  actions: {
    callServerEvent(event: string, data: string) {
      if (mp !== undefined) {
        mp.trigger("cMisc-CallServerEvent", event, data);
      } else {
        console.log(
          `Tried to call server event "${event}" with data "${data}"`
        );
      }
    },
  },
});
