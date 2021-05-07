<template>
  <div>
    <v-bottom-sheet v-model="is_open">
      <template v-slot:activator="{on, attrs}">
        <v-btn class="mx-2 button-add" fab color="primary" v-bind="attrs" v-on="on" v-show="is_button_show">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="a_button in a_buttons"
          :key="a_button.to"
          @click="is_open = false"
          :to="{name: a_button.to, query: {is_income: is_income}}"
        >
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon color="primary">{{a_button.icon}}</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{a_button.text_title}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>

export default {
  props: {
    is_income: {
      type: Number,
      required: true,
    }
  },

  data: () => ({
    is_open: false,
    is_button_show: true,
    a_buttons: [
      {icon: 'mdi-view-list', to: 'CategoryAdd', text_title: 'Добавить категорию'},
      {icon: 'mdi-folder', to: 'GroupAdd', text_title: 'Добавить группу'},
    ],
  }),

  created() {
    this.$root.$on('scroll-content', o_event => {
      this.is_button_show = o_event.target.scrollTop === 0
    })
  },
}

</script>

<style>
.button-add {
  position: fixed;
  bottom: 65px;
  right: 10px;
}

</style>