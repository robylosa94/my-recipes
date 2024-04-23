// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css"

import "vuetify/styles"
import { createVuetify, type ThemeDefinition } from "vuetify"

const customTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#020420",
    surface: "#1e293b",
    primary: "#00dc82",
    error: "#E53935",
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "customTheme",
      themes: {
        customTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
