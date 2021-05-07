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
     v-show="show_budget"
   />
    <v-select
      :clearable="true"
      :items="a_groups"
      :value="k_category_group"
      label="Группа"
      v-model="k_category_group"
    ></v-select>
    <button_save_form id_form="category_add" />
    <delete_dialog_window
      event_name="delete-item"
      v-bind:callbackSubmit="categoryDelete"
      v-bind:is_open="is_delete"
      v-bind:text_title="'Удалить категорию ' + text_category + '?'"
    />
  </v-form>
</template>

<script>
import button_save_form from '@/components/ButtonSaveForm'
import category_budget from '@/components/categories/edit/Budget'
import category_icon from '@/components/categories/edit/Icon'
import category_name from '@/components/categories/edit/Name'
import delete_dialog_window from '@/components/DeleteDialogWindow'
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
    delete_dialog_window,
    loader,
  },

  created() {
    this.$root.$on('delete-item', is_delete => {
      this.is_delete = is_delete
    });
  },

  data() {
    return {
      a_budget: {'is_percent': false, 'm_budget': 0},
      a_category_info: {},
      a_groups: [],
      a_icon: {},
      error_message_budget: '',
      error_message_name: '',
      show_budget: false,
      is_delete: false,
      k_category_group: '',
      loading: true,
      text_category: '',
    }
  },

  mounted() {
    Promise.all([
      groupsApi.get({k_category: this.$route.params.k_category}),
      categoryApi.get(this.$route.params.k_category),
      userApi.getUser()
    ]).then(a_response => {
      this.a_category_info = a_response[1].data;

      this.a_budget.is_percent = Number(this.a_category_info.m_budget_percent !== 0)
      this.a_budget.m_budget = this.a_category_info.m_budget_percent || this.a_category_info.m_budget_float
      this.a_icon.s_icon_color = this.a_category_info.s_icon_color
      this.a_icon.s_icon_class = this.a_category_info.s_icon_class
      this.text_category = this.a_category_info.text_category;

      a_response[0].data.forEach((a_group) => {
        this.a_groups.push({
          'text': a_group.text_group,
          'value': a_group.k_category_group,
        })
      });

      if(this.a_category_info.k_category_group)
        this.k_category_group = this.a_category_info.k_category_group

      this.show_budget = a_response[2].data.setups.enable_budget_mode && !this.a_category_info.is_income
      this.loading = false
    });
  },

  methods: {
    categoryDelete() {
      categoryApi.destroy(this.$route.params.k_category).then(() => {
        this.$router.push({name: 'Categories', query: {is_income: this.a_category_info['is_income']}})
      })
    },

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

      categoryApi.put(this.$route.params.k_category, {
        k_category_group: this.k_category_group,
        m_budget_float: this.a_budget.is_percent ? 0 : this.a_budget.m_budget,
        m_budget_percent: this.a_budget.is_percent ? this.a_budget.m_budget : 0,
        s_icon_class: this.a_icon.s_icon_class,
        s_icon_color: this.a_icon.s_icon_color,
        text_category: this.text_category
      }).then(() => {
        this.$router.push({name: 'Categories', query: {is_income: this.a_category_info['is_income']}})
      })
      .catch(o_response => {
        this.errorShow(o_response.response.data.errors)
      })
    }
  }
}
</script>