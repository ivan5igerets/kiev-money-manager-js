<template>
  <div>
    <v-btn
      @click="openOperationAddPage(1)"
      class="mx-2 button-add button-add-income green lighten-1"
      fab
      v-show="is_button_show"
    >
      <v-icon color="white">mdi-plus</v-icon>
    </v-btn>
    <v-btn
      @click="openOperationAddPage(0)"
      class="mx-2 button-add button-add-spend red lighten-1"
      fab
      v-show="is_button_show"
    >
      <v-icon color="white">mdi-minus</v-icon>
    </v-btn>
  </div>
</template>

<script>

export default {
  data() {
    return {
      is_button_show: true
    }
  },

  methods: {
    openOperationAddPage(is_income) {
      this.$router.push({name: 'OperationAdd', query: {is_income: is_income}})
    }
  },

  created() {
    this.$root.$on('scroll-content', o_event => {
      this.is_button_show = o_event.target.scrollTop === 0
    })
  },
}

</script>

<style lang="scss">
.button-add {
  position: fixed;
  bottom: 65px;

  &.button-add-income {
    right: 10px;
  }
  &.button-add-spend {
    left: 10px;
  }
}
</style>