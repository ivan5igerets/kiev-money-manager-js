<template>
  <div class="grey--text width-100 box-shadow css-budget-statistic-container">
    <div class="black--text css-category-title">{{text_category}}</div>
    <div v-show="!show_budget_statistic">Всего: {{m_sum_total}}</div>
    <div v-show="show_budget_statistic">
      <div class="mb-2">Бюджет: {{m_budget}}</div>
      <div class="d-flex">
        <div>{{sumTotalPercentCalculate(m_sum_total)}}%</div>
        <div class="ml-auto">{{sumTotalPercentLeft()}}%</div>
      </div>
      <category_line_diagram :color="color" v-bind:m_budget="m_budget" v-bind:m_sum_total="m_sum_total"/>
      <div class="d-flex">
        <div>Расходов: {{m_sum_total}}</div>
        <div class="ml-auto">
          Остаток:
          <span v-bind:class="{'red--text': (m_budget - m_sum_total) < 0}">{{m_budget - m_sum_total}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import category_line_diagram from '@/components/reports/CategoryBudgetLineDiagram'

export default {
  components: {
    category_line_diagram
  },

  props: {
    m_budget: {
      type: Number,
      required: true,
    },
    m_sum_total: {
      type: Number,
      required: true,
    },
    show_budget_statistic: {
      type: Boolean,
      required: true,
    },
    text_category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'yellow'
    }
  },

  methods: {
    sumTotalPercentCalculate(m_sum) {
      return this.m_budget ? this.round((m_sum*100) / this.m_budget) : 0
    },

    sumTotalPercentLeft() {
      const m_budget_left = this.m_budget - this.m_sum_total
      return this.round(m_budget_left<0 ? 0 : this.sumTotalPercentCalculate(m_budget_left))
    },

    round(m_sum) {
      return Math.round((m_sum+Number.EPSILON)*100) / 100
    }
  }
}
</script>

<style lang="scss" scoped>
.css-progress-linear {
  border-radius: 10px;
}

.css-budget-statistic-container {
  font-size: 12px;
  padding: 12px 12px 2px;
}

.css-category-title {
  font-size: 16px;
}

</style>