import { defineStore } from "pinia";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const mp: any;

export const useRageMpStore = defineStore({
  id: "ragemp",
  actions: {
    callServerEvent(event: string, data: string) {
      if (typeof mp !== "undefined") {
        mp.trigger("cMisc-CallServerEvent", event, data);
      } else {
        console.log(
          `Tried to call server event "${event}" with data "${data}"`
        );
      }
    },
  },
});
