<template>
  <div class="text-center align-center css-not-internet-container ml-auto mr-auto mt-16">
    <v-icon size="200" color="primary">
      mdi-wifi-cancel
    </v-icon>
    <div class="grey--text">
      Нет интернет соединения
    </div>
    <button class="mt-4 saveForm" @click="tryAgain"> Попробовать снова </button>
  </div>
</template>

<script>
export default {
  methods: {
    tryAgain() {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
  .css-not-internet-container {
    width: 18em;
   }
</style>