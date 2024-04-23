<template>
  <NuxtLink to="/" class="logout">Logout <v-icon class="ml-1" size="small">mdi-logout-variant</v-icon></NuxtLink>
  <v-container class="container">
    <v-data-table
      class="dataTable"
      :headers="headers"
      :items="recipes"
      :items-per-page="itemsPerPage ? itemsPerPage : 30"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      :loading="loading"
    >
      <template v-slot:top>
        <div class="header">
          <PageTitle class="mr-5">My recipes</PageTitle>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" variant="flat" class="my-2" width="150" @click="editItem(item)"
                >New recipe <v-icon class="ml-1" size="x-large">mdi-plus-circle</v-icon></v-btn
              >
            </template>
            <v-card>
              <v-container>
                <v-form v-model="formValid" @submit.prevent="onFormSubmit">
                  <v-card-title class="pl-2">{{ formTitle }}</v-card-title>
                  <v-card-text class="pl-2 pt-4">
                    <v-text-field
                      label="Name*"
                      v-model="editedItem.name"
                      :readonly="formLoading"
                      :rules="[rules.required]"
                      required
                      class="mb-2"
                    ></v-text-field>
                    <v-text-field
                      type="number"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      label="Calories (kcal)*"
                      v-model="editedItem.caloriesPerServing"
                      :readonly="formLoading"
                      :rules="[rules.required]"
                      required
                      class="mb-2"
                    ></v-text-field>
                    <v-select
                      label="Difficulty*"
                      :items="['Easy', 'Medium', 'Hard']"
                      v-model="editedItem.difficulty"
                      :readonly="formLoading"
                      :rules="[rules.required]"
                      required
                      class="mb-2"
                    ></v-select>
                    <v-text-field
                      type="number"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      label="Timing (min)*"
                      v-model="editedItem.prepTimeMinutes"
                      :readonly="formLoading"
                      :rules="[rules.required]"
                      required
                      class="mb-2"
                    ></v-text-field>
                    <small class="d-block mb-5">* mandatory fields</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="plain" @click="close">Cancel</v-btn>
                    <v-btn type="submit" color="primary" variant="flat" :loading="formLoading">Save</v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-container>
                <v-card-title class="pl-2">Delete recipe</v-card-title>
                <v-card-text class="pl-2">Are you sure you want to delete this recipe?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="plain" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="error" variant="flat" @click="deleteItemConfirm">Confirm</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
        </div>
      </template>
      <template v-slot:item.caloriesPerServing="{ value }">
        <v-chip :color="getCaloriesColor(value)">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="xx-large" @click="editItem(item)">mdi-pencil-circle</v-icon>
        <v-icon size="xx-large" @click="deleteItem(item)">mdi-delete-circle</v-icon>
      </template>
      <template v-slot:loading>
        <v-skeleton-loader :type="itemsPerPage ? 'table-row@' + itemsPerPage : 'table-row@30'"></v-skeleton-loader>
      </template>
    </v-data-table>
    <!--
      Per la versione mobile: Vuetify 3 ha un bug nella versione mobile dei data table
      Bug: https://github.com/vuetifyjs/vuetify/issues/16784  
      Soluzione seguita: https://github.com/vuetifyjs/vuetify/issues/16784#issuecomment-1768071164
    -->
    <DataTableHelper cssClass="dataTable" :headers="headers"></DataTableHelper>
    <!--  -->
    <Snackbar v-model="snackbar" :color="snackbarColor" :message="snackbarMessage" />
  </v-container>
</template>

<style lang="scss" scoped>
.logout {
  color: lightgray;
  font-size: 14px;
  margin: 15px 15px 0 auto;
  text-decoration: none;
  transition: color 0.3s ease;

  @media (hover: hover) {
    &:hover {
      color: #fff;
    }
  }
}

.v-data-table {
  margin: 0 auto;
  max-width: 1280px;
}

.header {
  align-items: center;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 0 20px;

  @media only screen and (min-width: 768px) {
    padding: 0 0 40px;
  }
}

.v-dialog {
  .v-card-title {
    font-size: 30px;
  }
}
</style>

<script setup lang="ts">
useSeoMeta({
  title: "My recipes",
  description: "This is the recipes pages.",
})
</script>

<script lang="ts">
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      apiEndpoint: "https://dummyjson.com/recipes",
      headers: [
        {
          title: "Name",
          key: "name",
          sortable: false,
        },
        {
          title: "Calories (kcal)",
          key: "caloriesPerServing",
        },
        {
          title: "Difficulty",
          key: "difficulty",
        },
        {
          title: "Timing (min)",
          key: "prepTimeMinutes",
        },
        { title: "", key: "actions", sortable: false, width: 105 },
      ],
      recipes: [],
      itemsPerPage: 10,
      loading: true,
      editedIndex: -1,
      editedItem: {
        name: 0,
        caloriesPerServing: 0,
        difficulty: 0,
        prepTimeMinutes: 0,
      },
      defaultItem: {
        name: 0,
        caloriesPerServing: 0,
        difficulty: 0,
        prepTimeMinutes: 0,
      },
      formValid: false,
      formLoading: false,
      rules: {
        required: (value) => !!value || "The field is mandatory.",
      },
      snackbar: false,
      snackbarColor: "error",
      snackbarMessage: "",
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New recipe" : "Edit recipe"
    },
  },

  created() {
    // Called after the instance has finished processing all state-related options
    this.initialize()
  },

  methods: {
    async loadData() {
      try {
        const response = await fetch(this.apiEndpoint)
        const data = await response.json()
        this.recipes = data.recipes
        this.loading = false
      } catch (error) {
        this.snackbarMessage = "Error fetching data:" + error
        this.snackbarColor = "error"
        this.snackbar = true
      }
    },

    async addElement() {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.editedItem),
        })

        if (!response.ok) {
          throw new Error("Recipe creation failed, please try again later.")
        }

        this.formLoading = false
        this.close()

        return await response.json()
      } catch (error) {
        this.formLoading = false
        this.close()
        this.snackbarMessage = error
        this.snackbarColor = "error"
        this.snackbar = true
        throw error
      }
    },

    async editElement() {
      try {
        const response = await fetch(`${this.apiEndpoint}/${this.editedIndex}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.editedItem),
        })

        if (!response.ok) {
          throw new Error("Recipe editing failed, please try again later.")
        }

        this.formLoading = false
        this.close()

        return await response.json()
      } catch (error) {
        this.formLoading = false
        this.close()
        this.snackbarMessage = error
        this.snackbarColor = "error"
        this.snackbar = true
        throw error
      }
    },

    async deleteElement() {
      try {
        const response = await fetch(`${this.apiEndpoint}/${this.editedIndex}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Unsuccessful deletion of recipe, please try again later.")
        }

        this.closeDelete()

        return await response.json()
      } catch (error) {
        this.closeDelete()
        this.snackbarMessage = error
        this.snackbarColor = "error"
        this.snackbar = true
        throw error
      }
    },

    initialize() {
      this.loadData()
    },

    editItem(item) {
      this.editedIndex = this.recipes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.recipes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.recipes.splice(this.editedIndex, 1)
      this.deleteElement()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        setTimeout(() => {
          //  nextTick allows you to execute code after you have changed some data
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        setTimeout(() => {
          //  nextTick allows you to execute code after you have changed some data
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      })
    },

    onFormSubmit() {
      if (!this.formValid) return

      this.formLoading = true

      this.save()
    },

    save() {
      if (this.editedIndex > -1) {
        // Edit
        Object.assign(this.recipes[this.editedIndex], this.editedItem)
        this.editElement()
      } else {
        // Create
        this.recipes.push(this.editedItem)
        this.addElement()
      }
    },

    getCaloriesColor(calories) {
      if (calories > 300) return "red"
      else if (calories > 200) return "orange"
      else return "green"
    },
  },
}
</script>
