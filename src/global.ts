import { useNotificationsStore } from "./stores/Notifications";
import { useLoadingStore } from "./stores/Loading";
import { useRegisterStore } from "./stores/Register";
import type { AppNotification } from "./stores/Notifications";

// avoid tsc errors using globalThis.App
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var App: any;
}

// global object to manipulate the App from console
globalThis.App = {
  Register: {
    setNameAvailable: (status: boolean) => {
      useRegisterStore().nameAvailable = status;
    },
    setEmailChecked: (status: boolean) => {
      useRegisterStore().emailChecked = status;
    },
  },
  Loading: {
    showLoading: (status: boolean) => {
      useLoadingStore().showLoading(status);
    },
  },
  Notifications: {
    addNotification: (notification: AppNotification) => {
      useNotificationsStore().addNotification(notification);
    },
  },
};
