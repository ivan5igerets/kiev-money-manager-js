<template>
  <loader v-if="loading"/>
  <div v-else>
    <category_budget
      :color="a_category.s_icon_color"
      v-bind:m_budget="m_budget"
      v-bind:m_sum_total="m_sum_total"
      v-bind:text_category="text_category"
      v-bind:show_budget_statistic="show_budget_statistic"
    />
    <v-list class="mt-4 box-shadow pt-0 pb-0" v-if="!!a_operations.length">
      <v-list-item-group>
        <div :key="i" v-for="(a_operation, i) in a_operations">
          <v-list-item :to="{name: 'OperationEdit', params: {k_operation: a_operation.k_operation}}">
            <v-list-item-content>
              <div class="d-flex">
                <category_icon v-bind:a_icon="a_operation.a_icon"/>
                <div class="width-100 d-flex align-center">
                  <div class="mr-2">
                    <div>{{a_operation.text_comment ? a_operation.text_comment : a_operation.text_category}}</div>
                    <div class="grey--text 12 css-date-operation">{{dateFormat(a_operation.dl_operation)}}</div>
                  </div>
                  <div class="grey--text">{{a_operation.m_sum_percent}}%</div>
                  <div class="ml-auto">{{a_operation.m_sum}}</div>
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

import {CoreDate} from '/src/date/CoreDate.js'

import categoryApi from '@/api/category'
import historyApi from '@/api/history'
import userApi from '@/api/auth'

export default {
  components: {
    category_budget,
    category_icon,
    loader
  },

  data() {
    return {
      a_category: {},
      a_operations: [],
      dl_filter: CoreDate.systemNow(),
      k_category: this.$route.params.k_category,
      loading: true,
      m_budget: 0,
      m_budget_percent: 0,
      m_sum_total: 0,
      show_budget_statistic: false,
      text_category: '',
    }
  },

  methods: {
    dateFormat(dl_date) {
      const a_date = CoreDate.toArray(dl_date)
      return a_date.reverse().join('/')
    },

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
        Math.round(((m_sum_operation_total * (this.a_category.m_budget_percent/100)) + Number.EPSILON)*100) / 100 :
        0
    }
  },

  mounted() {
    Promise.all([
      historyApi.categoryOperationHistory(this.k_category, {dl_filter: this.dl_filter}),
      categoryApi.get(this.k_category),
      userApi.getUser()
    ]).then((a_response) => {
      this.a_category = a_response[1].data
      this.a_operations = a_response[0].data
      this.m_sum_total = this.operationSumTotal(this.a_operations)
      this.text_category = a_response[1].data.text_category

      if(a_response[2].data.setups.enable_budget_mode && !a_response[1].data.is_income)
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
        historyApi.categoryOperationHistory(this.k_category, {dl_filter: this.dl_filter}),
        historyApi.day({dl_filter: this.dl_filter, is_income: 1})
      ]).then(o_response => {
        this.a_operations = o_response[0].data
        this.m_sum_total = this.operationSumTotal(this.a_operations)
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