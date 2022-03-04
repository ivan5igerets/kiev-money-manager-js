<template>
  <div>
    <v-switch
      v-if="show_inactive_category_checkbox"
      class="ml-4"
      v-model="show_inactive_category"
      label="Показать неактивные категории"
      @change="toggleInactiveCategory"
    ></v-switch>
    <div class="css-categories">
      <v-tabs grow v-model="tab">
        <v-tab>Затраты</v-tab>
        <v-tab>Доход</v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <loader v-if="loading" />
      <v-tabs-items v-model="tab" v-else>
        <v-tab-item v-if="show_spending_group || show_spending_category">
          <v-list v-if="show_spending_group">
            <v-subheader class="css-height-category">Группы</v-subheader>
            <group_list v-bind:a_group_list="spending.groups" v-bind:show_inactive_category="show_inactive_category"/>
          </v-list>
          <v-list v-if="show_spending_category">
            <v-subheader class="css-height-category">Категории</v-subheader>
            <category_list v-bind:a_category_list="spending.categories" v-bind:show_inactive_category="show_inactive_category"/>
          </v-list>
        </v-tab-item>
        <v-tab-item class="mt-4 text-center" v-else>
          Нет ни одной категориий
        </v-tab-item>
        <v-tab-item v-if="show_income_group || show_income_category">
          <v-list v-if="show_income_group">
            <v-subheader>Группы</v-subheader>
            <group_list v-bind:a_group_list="income.groups" v-bind:show_inactive_category="show_inactive_category"/>
          </v-list>
          <v-list v-if="show_income_category">
            <v-subheader>Категории</v-subheader>
            <category_list v-bind:a_category_list="income.categories" v-bind:show_inactive_category="show_inactive_category"/>
          </v-list>
        </v-tab-item>
        <v-tab-item class="mt-4 text-center" v-else>
          Нет ни одной категориий
        </v-tab-item>
      </v-tabs-items>
      <button_add v-bind:is_income="tab"/>
    </div>
  </div>
</template>

<script>
import button_add from '@/components/categories/ButtonAdd'
import category_list from '@/components/categories/CategoryList'
import group_list from '@/components/categories/GroupList'
import loader from '@/components/Loader'

import categoriesApi from '../../api/categories'
import groupsApi from '../../api/groups'

export default {
  components: {
    button_add,
    category_list,
    group_list,
    loader,
  },

  data() {
    return {
      tab: Number(this.$route.query.is_income ?? 0),
      loading: true,
      show_inactive_category_checkbox: false,
      show_inactive_category: false,
      income: {
        categories: [],
        groups: [],
      },
      spending: {
        categories: [],
        groups: [],
      },
      show_spending_category: false,
      show_spending_group: false,
      show_income_category: false,
      show_income_group: false,
    }
  },
  methods: {
    toggleInactiveCategory(show_inactive_category) {
      this.show_income_category = false
      this.show_income_group = false
      this.show_spending_category = false
      this.show_spending_group = false

      this.income.categories.forEach((a_category) => {
        if(show_inactive_category || a_category.is_active) {
          this.show_income_category = true
          return true
        }
      })

      this.income.groups.forEach((a_group) => {
        a_group.a_category.forEach((a_category) => {
          if(show_inactive_category || a_category.is_active) {
            this.show_income_group = true
            return true
          }
        })
      })

      this.spending.categories.forEach((a_category) => {
        if(show_inactive_category || a_category.is_active) {
          this.show_spending_category = true
          return true
        }
      })

      this.spending.groups.forEach((a_group) => {
        a_group.a_category.forEach((a_category) => {
          if(show_inactive_category || a_category.is_active) {
            this.show_spending_group = true
            return true
          }
        })
      })
    },

    sort(a_left, a_right) {
      if(a_left.is_active < a_right.is_active)
        return 1

      if(a_left.is_active > a_right.is_active)
        return -1

      if(a_left.is_active === a_right.is_active)
        return 0
    }
  },

  mounted() {
  Promise.all([groupsApi.get(), categoriesApi.get()]).then(a_response => {
    a_response[0].data.forEach(a_group => {
      a_group.a_category.forEach((a_category) => {
        if(!a_category.is_active) {
          this.show_inactive_category_checkbox = true
          return true
        }
      });

      let is_active_group = false
      a_group.a_category.forEach((a_category) => {
        if(a_category.is_active) {
          is_active_group = true
          return true
        }
      });

      a_group['is_active'] = is_active_group;

      if(a_group.is_income)
        this.income.groups.push(a_group)
      else
        this.spending.groups.push(a_group)
    })

    a_response[1].data.forEach(a_category => {
      if(!a_category.is_active && !this.show_inactive_category_checkbox)
        this.show_inactive_category_checkbox = true

      if(a_category.is_income)
        this.income.categories.push(a_category)
      else
        this.spending.categories.push(a_category)

      this.toggleInactiveCategory(false)
    });

    this.income.categories.sort(this.sort);
    this.income.groups.sort(this.sort)
    this.income.groups.forEach((a_group) => {
      a_group.a_category.sort(this.sort)
    })

    this.spending.categories.sort(this.sort);
    this.spending.groups.sort(this.sort)
    this.spending.groups.forEach((a_group) => {
      a_group.a_category.sort(this.sort)
    })

    this.loading = false
  })
},
}
</script>
<style lang="scss">
.css-categories {
  .v-list-item__action {
    min-width: 0!important;
    margin-right: 10px!important;
  }

  .v-list-item {
    height: 50px;
  }

  .css-height-category {
    height: 30px !important;
  }

  .v-list-item__icon {
    margin: 11px 12px 0 0 !important;
  }
}
</style>