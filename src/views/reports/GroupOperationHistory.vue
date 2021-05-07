<template>
  <loader v-if="loading"/>
  <div v-else>
    <category_budget
      :color="a_group.s_icon_color"
      v-bind:m_budget="m_budget"
      v-bind:m_sum_total="m_sum_total"
      v-bind:text_category="text_group"
      v-bind:show_budget_statistic="show_budget_statistic"
    />
    <v-list class="mt-4 box-shadow pt-0 pb-0" v-if="!!a_categories.length">
      <v-list-item-group>
        <div :key="i" v-for="(a_category, i) in a_categories">
          <v-list-item :to="{name: 'CategoryOperationHistory', params: {k_category: a_category.k_category}}">
            <v-list-item-content>
              <div class="d-flex">
                <category_icon v-bind:a_icon="a_category.a_icon"/>
                <div class="width-100 align-self-center">
                  <div class="d-flex">
                    {{a_category.text_category}}
                    <div class="grey--text ml-2">{{a_category.m_sum_percent}}%</div>
                    <div class="ml-auto">{{a_category.m_sum}}</div>
                  </div>
                  <group_budget_line_diagram
                    :color="a_category.a_icon.s_icon_color"
                    v-bind:i_height="5"
                    v-bind:m_budget="a_category.m_budget"
                    v-bind:m_sum_total="a_category.m_sum"
                    v-show="a_category.m_budget !== 0 && enable_budget_mode && !a_category.is_income"
                  />
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="d-block"></v-divider>
        </div>
      </v-list-item-group>
    </v-list>
    <div class="mt-2 text-center" v-else>Нет не одной операции</div>
  </div>
</template>
<script>
import category_icon from '@/components/categories/IconShow'
import loader from '@/components/Loader'
import category_budget from '@/components/reports/CategoryBudget'
import group_budget_line_diagram from '@/components/reports/CategoryBudgetLineDiagram'


import {CoreDate} from '/src/date/CoreDate.js'

import groupApi from '@/api/group'
import historyApi from '@/api/history'
import userApi from '@/api/auth'

export default {
  components: {
    category_budget,
    category_icon,
    group_budget_line_diagram,
    loader
  },

  data() {
    return {
      a_categories: [],
      a_group: {},
      dl_filter: CoreDate.systemNow(),
      enable_budget_mode: false,
      k_category_group: this.$route.params.k_category_group,
      loading: true,
      m_budget: 0,
      m_budget_percent: 0,
      m_sum_total: 0,
      show_budget_statistic: false,
      text_group: '',
    }
  },

  methods: {
    operationSumTotal(a_operations) {
      let m_sum_total = 0;
      a_operations.forEach((a_operation) => {
        m_sum_total += a_operation.m_sum
      });

      return m_sum_total
    },

    budgetPercentCalculate(a_operations) {
      let m_sum_operation_total = 0
      a_operations.forEach((a_operation) => {
        if(a_operation.is_income)
          m_sum_operation_total += a_operation.m_sum
      })

      return m_sum_operation_total ?
        Math.round(((m_sum_operation_total * (this.a_group.m_budget_percent/100)) + Number.EPSILON)*100) / 100 :
        0
    }
  },

  mounted() {
    Promise.all([
      historyApi.groupOperationHistory(this.k_category_group, {dl_filter: this.dl_filter}),
      groupApi.get(this.k_category_group),
      userApi.getUser()
    ]).then((a_response) => {
      this.a_group = a_response[1].data
      this.a_categories = a_response[0].data
      this.m_sum_total = this.operationSumTotal(this.a_categories)
      this.text_group = a_response[1].data.text_group
      this.enable_budget_mode = a_response[2].data.setups.enable_budget_mode

      if(this.enable_budget_mode && !a_response[1].data.is_income)
      {
        if(a_response[1].data.m_budget_float !== 0)
        {
          this.m_budget = a_response[1].data.m_budget_float
          this.show_budget_statistic = true
          this.loading = false
        }
        else if(a_response[1].data.m_budget_percent !== 0)
        {
          historyApi.day({dl_filter: this.dl_filter, is_income: 1}).then((o_response) => {
            this.m_budget = this.budgetPercentCalculate(o_response.data)
            this.show_budget_statistic = true
            this.loading = false
          })
        }
        else
        {
          this.show_budget_statistic = false
          this.loading = false
        }
      }
      else
      {
        this.show_budget_statistic = false
        this.loading = false
      }
    });
  },

  created() {
    this.$root.$on('change-date', (dl_filter) => {
      this.dl_filter = dl_filter
      this.loading = true
      Promise.all([
        historyApi.groupOperationHistory(this.k_category_group, {dl_filter: this.dl_filter}),
        historyApi.day({dl_filter: this.dl_filter, is_income: 1})
      ]).then(o_response => {
        this.a_categories = o_response[0].data
        this.m_sum_total = this.operationSumTotal(this.a_categories)
        this.m_budget = this.budgetPercentCalculate(o_response[1].data)
        this.loading = false
      })
    })
  },
}

</script>

<style lang="scss" scoped>
.css-date-operation {
  font-size: 12px;
}

</style>