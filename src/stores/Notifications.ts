import { defineStore } from "pinia";

export interface AppNotification {
  id: number;
  text: string;
  theme?: string;
  time?: string;
  title?: string;
  img?: string;
}

interface NotificationState {
  nextItemId: number;
  list: Array<AppNotification>;
}

export const useNotificationsStore = defineStore({
  id: "notifications",
  state: (): NotificationState => ({
    nextItemId: 1,
    list: [],
  }),
  getters: {
    notificationsList: (state) => {
      return state.list;
    },
  },
  actions: {
    addNotification(notification: AppNotification) {
      notification.id = this.nextItemId++;
      this.list.push(notification);
      let time = 5;
      if (notification.time) time = parseInt(notification.time);
      setTimeout(this.removeNotification, time * 1000, notification.id);
    },
    removeNotification(id: number) {
      for (const item of this.list) {
        if (item.id === id) return this.list.splice(this.list.indexOf(item), 1);
      }
    },
  },
});
