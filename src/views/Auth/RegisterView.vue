<template>
  <b class="full" style="background-color: rgba(0, 0, 0, 0.4)">
    <router-link to="/login" class="link-button link-button_top transition_02"
      >Already have an account? Log In</router-link
    >
    <b class="login-window">
      <input
        type="email"
        class="input input_transparent-with-bottom-border"
        placeholder="Email"
        v-model="email"
        @input="resetCheckedEmail"
        :class="{ checked: emailChecked }"
        @keyup.enter="checkEmail"
        autofocus
        required
      />
      <b v-if="!emailChecked" class="code-block">
        <a
          class="link-button theme_white transition_02 hover"
          @click="checkEmail"
          >Check email</a
        >
      </b>
      <b v-else>
        <input
          type="text"
          class="input input_transparent-with-bottom-border"
          v-model="firstName"
          placeholder="First name"
          :class="{ checked: nameAvailable }"
          @input="resetCheckedName"
          @keyup.enter="checkName"
          required
        />
        <input
          type="text"
          class="input input_transparent-with-bottom-border"
          v-model="lastName"
          placeholder="Last name"
          :class="{ checked: nameAvailable }"
          @input="resetCheckedName"
          @keyup.enter="checkName"
          required
        />
        <b v-if="!nameAvailable">
          <a
            class="link-button theme_white transition_02 hover"
            @click="checkName"
            >Check username</a
          >
        </b>
        <b v-else>
          <input
            type="password"
            class="input input_transparent-with-bottom-border"
            :class="{ checked: passwordChecked }"
            placeholder="Password"
            v-model="password"
            @keyup.enter="createAccount"
            required
          />
          <input
            type="password"
            class="input input_transparent-with-bottom-border"
            :class="{ checked: passwordChecked }"
            placeholder="Confirm password"
            v-model="passwordConfirm"
            @input="verifyPassword"
            @keyup.enter="createAccount"
            required
          />
          <a
            v-if="passwordChecked"
            class="link-button link-button_login theme_green transition_02 hover"
            @click="createAccount"
            >Create account</a
          >
        </b>
      </b>
    </b>
  </b>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNotificationsStore } from "@/stores/Notifications";
import type { AppNotification } from "@/stores/Notifications";
import { useRegisterStore } from "@/stores/Register";

export default defineComponent({
  data() {
    return {
      email: "",

      firstName: "",
      lastName: "",

      password: "",
      passwordConfirm: "",
      passwordChecked: false,
    };
  },
  props: ["nameAvailable", "emailChecked"],
  methods: {
    checkEmail() {
      mp.trigger(
        "cMisc-CallServerEvent",
        "sRegister-CheckEmail",
        this.email.toLowerCase()
      );
    },

    resetCheckedName: function () {
      useRegisterStore().nameAvailable = false;
      // appData.views.Register.nameAvailable = false;
    },

    resetCheckedEmail: function () {
      useRegisterStore().emailChecked = false;
      // appData.views.Register.emailChecked = false;
    },

    checkName() {
      if (this.firstName.length < 1 || this.lastName.length < 1) {
        this.addNotification({
          id: -1,
          text: `You can't use empty name!`,
          theme: `red`,
          title: `Empty name`,
          img: "error.svg",
        });
      } else {
        const obj = {
          firstName: this.firstName,
          lastName: this.lastName,
        };
        mp.trigger(
          "cMisc-CallServerEvent",
          "sRegister-CheckName",
          JSON.stringify(obj)
        );
      }
    },

    verifyPassword() {
      this.passwordChecked = this.password === this.passwordConfirm;
    },

    createAccount() {
      const obj = {
        email: this.email.toLowerCase(),
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      };
      mp.trigger(
        "cMisc-CallServerEvent",
        "sRegister-CreateAccount",
        JSON.stringify(obj)
      );
    },

    addNotification(notification: AppNotification) {
      return useNotificationsStore().addNotification(notification);
    },
  },
});
</script>

<style scoped>
.login-window {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 20vw;
  height: 100%;
}

.link-button_login {
  margin: 1em 0;
}
.link-button_top {
  padding: 1em 2em;
  width: auto;
  position: fixed;
  left: 0;
  top: 0;
  cursor: pointer;
}
.link-button_top:hover {
  background: rgba(255, 255, 255, 0.5);
}

.code-block {
  display: flex;
  align-items: flex-end;
  margin: 2vh 0;
}

.input_code {
  margin: 0;
}

.checked {
  color: limegreen;
  border-color: limegreen;
}
</style>
