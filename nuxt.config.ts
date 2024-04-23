import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: ["@/assets/global.scss"],
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Roboto Condensed": true,
        },
      },
    ],
    "@nuxt/image",
  ],
  runtimeConfig: {
    public: {
      accountEmail: process.env.ACCOUNT_EMAIL,
      accountPassword: process.env.ACCOUNT_PASSWORD,
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
