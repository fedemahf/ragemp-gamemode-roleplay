<template>
  <b id="app">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <!-- <transition name="fade">
      <router-view />
    </transition> -->
    <Transition name="fade">
      <Loading />
    </Transition>
    <Notifications />
  </b>
</template>

<script lang="ts">
import '@/assets/css/index.scss'
import Notifications from '@/views/NotificationsView.vue'
import Loading from '@/views/LoadingView.vue'
import { useLoadingStore } from '@/stores/Loading'
import { useNotificationsStore } from '@/stores/Notifications'
import type { AppNotification } from '@/stores/Notifications'

export default {
  name: 'App',
  components: {
    Notifications,
    Loading
  },
  methods: {
    showLoading(status: boolean) {
      return useLoadingStore().showLoading(status)
    },
    addNotification(notification: AppNotification) {
      return useNotificationsStore().addNotification(notification)
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
