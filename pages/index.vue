<template>
  <div class="pa-5 d-flex flex-col h-100">
    <v-card class="ma-auto" elevation="6" max-width="600" width="100%" rounded="lg">
      <v-container class="container">
        <PageTitle>Login</PageTitle>
        <v-form class="mt-6" v-model="formValid" @submit.prevent="onFormSubmit">
          <v-text-field
            v-model="email"
            label="E-mail"
            prepend-inner-icon="mdi-email-outline"
            :readonly="loading"
            :rules="[rules.required, rules.email]"
            required
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :readonly="loading"
            :rules="[rules.required, rules.password]"
            required
            class="mb-2"
          ></v-text-field>
          <v-btn type="submit" color="primary" size="x-large" :loading="loading" width="100%">Login</v-btn>
        </v-form>
        <v-card-text class="text-center">
          Don't have an account yet?
          <NuxtLink to="/sign-in" class="text-primary">Sign in</NuxtLink>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
  <Snackbar v-model="snackbar" :color="snackbarColor" :message="snackbarMessage" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Access my recipes",
  description: "This is the access page for my recipes.",
})
</script>

<script lang="ts">
export default {
  data: () => ({
    formValid: false,
    loading: false,
    email: null,
    password: null,
    showPassword: false,
    rules: {
      email: (value: string) => {
        if (/.+@.+\..+/.test(value)) return true

        return "The email entered is invalid."
      },
      password: (value: string) => {
        if (value.length > 8) return true

        return "The password must contain at least 8 characters."
      },
      required: (value: string) => !!value || "The field is mandatory.",
    },
    snackbar: false,
    snackbarColor: "error",
    snackbarMessage: "",
  }),
  methods: {
    onFormSubmit() {
      const config = useRuntimeConfig()
      if (!this.formValid) return

      this.loading = true

      if (this.email === config.public.accountEmail) {
        if (this.password === config.public.accountPassword) {
          location.href = "/recipes"
        } else {
          this.loading = false
          this.snackbarMessage = "Error: The password entered is incorrect."
          this.snackbarColor = "error"
          this.snackbar = true
        }
      } else {
        this.loading = false
        this.snackbarMessage = "Error: User not found."
        this.snackbarColor = "error"
        this.snackbar = true
      }
    },
  },
}
</script>
