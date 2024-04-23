<template>
  <v-snackbar :timeout="3000" :color="color">
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>
