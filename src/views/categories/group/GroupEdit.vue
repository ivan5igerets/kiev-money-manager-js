<template>
  <loader v-if="loading" />
  <v-form v-else ref="form" class="pa-4" id="category_add" @submit.prevent="save" lazy-validation>
    <div class="d-flex justify-center align-center">
      <group_icon v-bind:a_icon="a_icon" />
      <group_name
        v-bind:error_message="error_message_name"
        v-bind:text_value="text_group"
        text_label="Название группы"
        v-model="text_group"
      />
    </div>
    <group_budget
      v-bind:a_budget="a_budget"
      v-bind:error_message="error_message_budget"
      v-model="a_budget"
      v-show="is_budget_show"
    />
    <v-select
      :error-messages="error_message_category"
      :items="a_categories_select"
      :rules="a_categories_rules"
      :value="a_categories"
      label="Категории"
      multiple
      v-model="a_categories"
    ></v-select>
    <button_save_form id_form="category_add"/>
    <delete_dialog_window
      v-bind:callbackAfterDelete="callbackAfterDelete"
      v-bind:is_open="is_delete"
      v-bind:k_category_group="$route.params.k_category_group"
      v-bind:text_group="text_group"
    />
  </v-form>
</template>

<script>
import button_save_form from '@/components/ButtonSaveForm'
import delete_dialog_window from '@/components/categories/edit/group/DeleteDialogWindow'
import group_budget from '@/components/categories/edit/Budget'
import group_icon from '@/components/categories/edit/Icon'
import group_name from '@/components/categories/edit/Name'
import loader from '@/components/Loader'

import groupApi from '@/api/group'
import groupCategoriesApi from '@/api/groupCategories'
import userApi from '@/api/auth'

export default {
  components: {
    button_save_form,
    delete_dialog_window,
    group_budget,
    group_icon,
    group_name,
    loader,
  },

  created() {
    this.$root.$on('delete-item', is_delete => {
      this.is_delete = is_delete
    });
  },

  data() {
    return {
      a_budget: {'is_percent': 0, 'm_budget': 0},
      a_categories: [],
      a_categories_rules: [value => value.length > 0 || 'Поле не может быть пустым'],
      a_categories_select: [],
      a_group_info: [],
      a_icon: {},
      error_message_budget: '',
      error_message_category: '',
      error_message_name: '',
      is_budget_show: false,
      is_delete: false,
      loading: true,
      text_group: '',
    }
  },

  mounted() {
    Promise.all([
      groupApi.get(this.$route.params.k_category_group),
      groupCategoriesApi.get({k_category_group: this.$route.params.k_category_group}),
      userApi.getUser()
    ]).then(a_response => {
      this.a_group_info = a_response[0].data

      this.a_categories = this.a_group_info.a_category
      this.a_budget.is_percent = this.a_group_info.m_budget_percent !== 0 ? 1 : 0
      this.a_budget.m_budget = this.a_group_info.m_budget_percent || this.a_group_info.m_budget_float
      this.a_icon.s_icon_color = this.a_group_info.s_icon_color
      this.a_icon.s_icon_class = this.a_group_info.s_icon_class
      this.text_group = this.a_group_info.text_group

      a_response[1].data.forEach((a_group) => {
        this.a_categories_select.push({
          'text': a_group['text_category'],
          'value': a_group['k_category']
        })
      });

      this.is_budget_show = a_response[2].data.setups.enable_budget_mode && !this.a_group_info.is_income
      this.loading = false
    });
  },

  methods: {
    callbackAfterDelete() {
      this.$router.push({name: 'Categories', query: {is_income: this.a_group_info['is_income']}})
    },

    errorReset() {
      this.error_message_budget = '';
      this.error_message_name = '';
      this.error_message_category = '';
    },

    errorShow(a_errors) {
      this.errorReset()
      for(const s_field in a_errors) {
        switch(s_field) {
          case 'm_budget_float':
          case 'm_budget_percent':
            this.error_message_budget = a_errors[s_field][0];
            break;
          case 'text_group':
            this.error_message_name = a_errors[s_field][0];
            break;
          case 'a_category':
            this.error_message_category = a_errors[s_field][0];
            break;
        }
      }
    },

    save() {
      if(!this.$refs.form.validate())
        return;

      groupApi.put(this.$route.params.k_category_group, {
        a_category: this.a_categories,
        m_budget_float: this.a_budget.is_percent ? 0 : this.a_budget.m_budget,
        m_budget_percent: this.a_budget.is_percent ? this.a_budget.m_budget : 0,
        s_icon_class: this.a_icon.s_icon_class,
        s_icon_color: this.a_icon.s_icon_color,
        text_group: this.text_group
      }).then(() => {
        this.$router.push({name: 'Categories', query: {is_income: this.a_group_info['is_income']}})
      })
      .catch(o_response => {
        this.errorShow(o_response.response.data.errors)
      })
    }
  }
}
</script>