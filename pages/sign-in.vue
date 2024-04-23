<template>
  <div class="pa-5 d-flex flex-col h-100">
    <v-card class="ma-auto" elevation="6" max-width="800" width="100%" rounded="lg">
      <v-container class="container">
        <PageTitle>Sign in</PageTitle>
        <v-form class="mt-8" v-model="formValid" @submit.prevent="onFormSubmit">
          <v-row>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="firstName"
                label="First name*"
                :readonly="loading"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="lastName"
                label="Last name*"
                :readonly="loading"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="dateOfBirth"
                label="Date of birth*"
                placeholder="dd/mm/yyyy"
                :readonly="loading"
                :rules="[rules.required, rules.date]"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="cityOfBirth"
                label="City of birth*"
                :readonly="loading"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="taxCode"
                label="Tax code*"
                :maxlength="16"
                :readonly="loading"
                :rules="[rules.required, rules.taxCode]"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" sm="6">
              <v-select
                v-model="gender"
                label="Gender*"
                :items="['Male', 'Female', 'Other']"
                :readonly="loading"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="email"
                label="E-mail*"
                prepend-inner-icon="mdi-email-outline"
                :readonly="loading"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" sm="6">
              <v-text-field
                v-model="password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                label="Password*"
                :type="showPassword ? 'text' : 'password'"
                :readonly="loading"
                :rules="[rules.required, rules.password]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <small class="d-block my-5">* mandatory fields</small>
          <v-btn type="submit" color="primary" size="x-large" :loading="loading" width="100%">Sign in</v-btn>
        </v-form>
        <v-card-text class="text-center">
          Do you already have an account?
          <NuxtLink to="/" class="text-primary">Login</NuxtLink>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
  <Snackbar v-model="snackbar" :color="snackbarColor" :message="snackbarMessage" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Register to access my recipes",
  description: "This is the registration page to access my recipes.",
})
</script>

<script lang="ts">
export default {
  data: () => ({
    formValid: false,
    loading: false,
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    cityOfBirth: null,
    taxCode: null,
    gender: null,
    email: null,
    password: null,
    privacy: null,
    showPassword: false,
    rules: {
      date: (value: string) => {
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return true
        return "The date of birth entered is invalid."
      },
      email: (value: string) => {
        if (/.+@.+\..+/.test(value)) return true

        return "The email entered is invalid."
      },
      password: (value: string) => {
        if (value.length > 8) return true

        return "The password must contain at least 8 characters."
      },
      required: (value: string) => !!value || "The field is mandatory.",
      taxCode: (value: string) => {
        if (
          /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$/.test(
            value
          )
        )
          return true

        return "The tax code entered is invalid."
      },
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
        this.loading = false
        this.snackbarMessage = "Error: User already exists."
        this.snackbarColor = "error"
        this.snackbar = true
      } else {
        this.loading = false
        this.snackbarMessage = "Account created successfully."
        this.snackbarColor = "success"
        this.snackbar = true
      }
    },
  },
}
</script>
