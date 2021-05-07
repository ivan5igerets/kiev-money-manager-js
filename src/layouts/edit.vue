<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="d-flex align-center flex-grow-1">
        <v-toolbar-title class="pl-0">{{$route.meta.title}}</v-toolbar-title>
        <v-icon class="ml-auto" color="red lighten-1" @click="deleteItem" v-if="is_edit">mdi-delete</v-icon>
      </div>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  data() {
    document.title = this.$route.meta.title || 'Money Manager';

    return {
      is_edit: this.$route.meta.is_edit ?? true
    }
  },

  methods: {
    back() {
      this.$router.go(-1)
    },

    deleteItem() {
      this.$root.$emit('delete-item', true)
    }
  },
}
</script>

<style>

.v-icon.v-icon::after {
  display: none !important;
}

</style>