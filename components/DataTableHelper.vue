<template>
  <span v-html="styleOutput"></span>
</template>

<script lang="ts">
export default {
  props: {
    headers: { required: true, type: Array },
    cssClass: { required: true, type: String },
    maxWidth: { required: false, type: String, default: "600px" },
  },
  computed: {
    styleOutput() {
      let result = ""
      if (this.headers.length === 0) return result
      this.headers.forEach((element, index) => {
        result +=
          ".v-data-table." +
          this.cssClass +
          " td:nth-child(" +
          (index + 1) +
          ')::before { content:"' +
          element.title +
          ':"; display:none; }' +
          "\n"
      })

      result +=
        `
@media (max-width:` +
        this.maxWidth +
        `) {
  .v-data-table.` +
        this.cssClass +
        ` thead { border: none; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
  .v-data-table.` +
        this.cssClass +
        ` td { padding: 5px 20px !important; position:relative; border-bottom: none !important; display: flex; align-items: center; text-align: left !important; width:100%; height:auto !important; }
  .v-data-table.` +
        this.cssClass +
        ` td:first-child { padding-top: 20px !important; }
  .v-data-table.` +
        this.cssClass +
        ` td.v-data-table__td::before { display:block; font-weight: bold; text-align: left; padding-right: 0.5em; }
  .v-data-table.` +
        this.cssClass +
        ` td:last-child { border-bottom: 0; padding-bottom: 15px !important; margin-left: auto !important; margin-top: -36px !important; }
  .v-data-table.` +
        this.cssClass +
        ` td:last-child:before { display: none; }
  .v-data-table.` +
        this.cssClass +
        ` tr:not(:first-child) > td:first-child { border-top: 5px solid rgb(var(--v-theme-background)); }
}
          `

      //console.log('style on v-data-table "'+this.cssClass+'" added:'); console.log(result.trim());
      return "<style>" + result.trim() + "</style>"
    },
  },
}
</script>
