<template>
  <loader v-if="loading" />
  <div class="css-main-container" v-else>
    <div class="css-settings-container ma-4">
      <v-switch
        id="save_balance_next_month"
        v-model="save_balance_next_month"
        @change="setupChange('save_balance_next_month', save_balance_next_month)"
        label="Переносить остаток на следующий месяц"
      ></v-switch>
      <v-switch
        id="enable_budget_mode"
        @change="setupChange('enable_budget_mode', enable_budget_mode)"
        v-model="enable_budget_mode"
        label="Включить режим 'Бюджет' для категорий расхода"
      ></v-switch>
    </div>
  </div>
</template>

<script>

  import loader from '@/components/Loader'
  import auth from '@/api/auth'
  import profileApi from '@/api/profile'

  export default {
    components: {
      loader
    },

    data() {
      return {
        loading: true,
        save_balance_next_month: null,
        show_button_add_operation_nav_menu: null,
        enable_budget_mode: null,
      };
    },

    mounted() {
      auth.getUser().then(response =>
      {
        this.loading = false
        this.save_balance_next_month = Boolean(response.data.setups.save_balance_next_month)
        this.show_button_add_operation_nav_menu = Boolean(response.data.setups.show_button_add_operation_nav_menu)
        this.enable_budget_mode = Boolean(response.data.setups.enable_budget_mode)
      })
    },

    methods: {
      setupChange(setup_name, setup_value) {

        profileApi.settings({
          setup_name: setup_name,
          setup_value: setup_value
        });
      }
    }
  }
</script>