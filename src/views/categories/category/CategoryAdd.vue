<template>
  <loader v-if="loading" />
  <v-form v-else ref="form" class="pa-4" id="category_add" @submit.prevent="save" lazy-validation>
    <div class="d-flex justify-center align-center">
      <category_icon v-bind:a_icon="a_icon" />
      <category_name
        v-bind:error_message="error_message_name"
        v-bind:text_value="text_category"
        text_label="Название категории"
        v-model="text_category"
      />
    </div>
    <category_budget
      v-bind:a_budget="a_budget"
      v-bind:error_message="error_message_budget"
      v-model="a_budget"
      v-show="is_budget_show"
    />
    <v-select :clearable="true" :items="a_groups" label="Группа" v-model="k_category_group"></v-select>
    <button_save_form id_form="category_add"/>
  </v-form>
</template>

<script>
import button_save_form from '@/components/ButtonSaveForm'
import category_budget from '@/components/categories/edit/Budget'
import category_icon from '@/components/categories/edit/Icon'
import category_name from '@/components/categories/edit/Name'
import loader from '@/components/Loader'

import categoryApi from '@/api/category'
import groupsApi from '@/api/groups'
import userApi from '@/api/auth'

export default {
  components: {
    button_save_form,
    category_budget,
    category_icon,
    category_name,
    loader,
  },
  data() {
    return {
      a_budget: {'is_percent': 0, 'm_budget': 0},
      a_groups: [],
      a_icon: {'s_icon_class': 'mdi-food', 's_icon_color': '#f44336FF'},
      error_message_budget: '',
      error_message_name: '',
      is_budget_show: false,
      k_category_group: '',
      loading: true,
      text_category: '',
    }
  },

  mounted() {
    Promise.all([userApi.getUser(), groupsApi.get({is_income: this.$route.query.is_income})]).then(a_response => {
      this.is_budget_show = a_response[0].data.setups.enable_budget_mode
      a_response[1].data.forEach((a_group) => {
        this.a_groups.push({
          'text': a_group['text_group'],
          'value': a_group['k_category_group']
        })
      });
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
          case 'text_category':
            this.error_message_name = a_errors[s_field][0];
            break;
        }
      }
    },

    save() {
      if(!this.$refs.form.validate())
        return;

      categoryApi.post({
        is_income: this.$route.query.is_income,
        k_category_group: this.k_category_group,
        m_budget_float: this.a_budget.is_percent ? 0 : this.a_budget.m_budget,
        m_budget_percent: this.a_budget.is_percent ? this.a_budget.m_budget : 0,
        s_icon_class: this.a_icon.s_icon_class,
        s_icon_color: this.a_icon.s_icon_color,
        text_category: this.text_category
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