<template>
  <div class="css-categories">
    <v-tabs grow v-model="tab">
      <v-tab>Затраты</v-tab>
      <v-tab>Доход</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <loader v-if="loading" />
    <v-tabs-items v-model="tab" v-else>
      <v-tab-item v-if="spending.groups.length || spending.categories.length">
        <v-list v-if="spending.groups.length">
          <v-subheader class="css-height-category">Группы</v-subheader>
          <group_list v-bind:a_group_list="spending.groups" />
        </v-list>
        <v-list v-if="spending.categories.length">
          <v-subheader class="css-height-category">Категории</v-subheader>
          <category_list v-bind:a_category_list="spending.categories" />
        </v-list>
      </v-tab-item>
      <v-tab-item class="mt-4 text-center" v-else>
        Нет ни одной категориий
      </v-tab-item>
      <v-tab-item v-if="income.groups.length || income.categories.length">
        <v-list v-if="income.groups.length">
          <v-subheader>Группы</v-subheader>
          <group_list v-bind:a_group_list="income.groups" />
        </v-list>
        <v-list v-if="income.categories.length">
          <v-subheader>Категории</v-subheader>
          <category_list v-bind:a_category_list="income.categories" />
        </v-list>
      </v-tab-item>
      <v-tab-item class="mt-4 text-center" v-else>
        Нет ни одной категориий
      </v-tab-item>
    </v-tabs-items>
  <button_add v-bind:is_income="tab"/>
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
      income: {
        categories: [],
        groups: [],
      },
      spending: {
        categories: [],
        groups: [],
      }
    }
  },

  mounted() {
    Promise.all([groupsApi.get(), categoriesApi.get()]).then(a_response => {
      a_response[0].data.forEach(a_group => {
        if(a_group.is_income)
          this.income.groups.push(a_group)
        else
          this.spending.groups.push(a_group)
      })

      a_response[1].data.forEach(a_group => {
        if(a_group.is_income)
          this.income.categories.push(a_group)
        else
          this.spending.categories.push(a_group)
      });

      this.loading = false
    })
  },
}
</script>
<style lang="scss">
.css-categories {
  .v-list-item__action {
    min-width: 0!important;
    margin-right: 14px!important;
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