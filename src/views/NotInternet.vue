<template>
  <div class="text-center align-center css-not-internet-container ml-auto mr-auto mt-16">
    <v-img src="../assets/images/not-internet.jpg" class="css-wifi-image"></v-img>
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

    .css-wifi-image {
      font-size: 200px;
    }
   }
</style>