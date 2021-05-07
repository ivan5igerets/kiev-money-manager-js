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
      :items="a_categories_select"
      :rules="a_categories_rules"
      label="Категории"
      multiple
      v-model="a_categories"
    ></v-select>
    <button_save_form id_form="category_add"/>
  </v-form>
</template>

<script>
import button_save_form from '@/components/ButtonSaveForm'
import group_budget from '@/components/categories/edit/Budget'
import group_icon from '@/components/categories/edit/Icon'
import group_name from '@/components/categories/edit/Name'
import loader from '@/components/Loader'

import groupApi from '@/api/group'
import categoriesApi from '@/api/categories'
import userApi from '@/api/auth'

export default {
  components: {
    button_save_form,
    group_budget,
    group_icon,
    group_name,
    loader,
  },
  data() {
    return {
      a_categories_rules: [value => value.length > 0 || 'Поле не может быть пустым'],
      a_budget: {'is_percent': false, 'm_budget': 0},
      a_categories: [],
      a_categories_select: [],
      a_icon: {'s_icon_class': 'mdi-food', 's_icon_color': '#f44336FF'},
      error_message_budget: '',
      error_message_name: '',
      is_budget_show: false,
      loading: true,
      text_group: '',
    }
  },

  mounted() {
    Promise.all([categoriesApi.get({is_income: this.$route.query.is_income}), userApi.getUser()]).then(a_response => {
      a_response[0].data.forEach((a_group) => {
        this.a_categories_select.push({
          'text': a_group['text_category'],
          'value': a_group['k_category']
        })
      });

      this.is_budget_show = a_response[1].data.setups.enable_budget_mode && !this.$route.query.is_income
      this.loading = false
    });
  },

  methods: {
    errorReset() {
      this.error_message_budget = '';
      this.error_message_name = '';
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
        }
      }
    },

    save() {
      if(!this.$refs.form.validate())
        return;

      groupApi.post({
        a_category: this.a_categories,
        is_income: this.$route.query.is_income,
        m_budget_float: this.a_budget.is_percent ? 0 : this.a_budget.m_budget,
        m_budget_percent: this.a_budget.is_percent ? this.a_budget.m_budget : 0,
        s_icon_class: this.a_icon.s_icon_class,
        s_icon_color: this.a_icon.s_icon_color,
        text_group: this.text_group
      }).then(() => {
        this.$router.push({name: 'Categories', query: {is_income: this.$route.query.is_income}})
      })
      .catch(o_response => {
        this.errorShow(o_response.response.data.errors)
      })
    }
  }
}
</script>