<template>
  <v-list class="pa-0">
    <v-list-item-group color="primary">
      <v-list-item :to="{name: 'CategoryOperationHistory', params: {k_category: data.k_category}}">
        <v-list-item-content>
          <div class="item align-center">
            <category_icon v-bind:a_icon="data.a_icon"/>
            <div class="main-part">
              <div class="text">
                <div class="css-category-title"> {{ data.text_category }}</div>
                <span class="grey--text ml-2"> {{ data.m_sum_percent }} % </span>
                <div class="ml-auto"> {{ data.m_sum }} </div>
              </div>
              <category_budget_line_diagram
                :color="data.a_icon.s_icon_color"
                v-bind:i_height="5"
                v-bind:m_budget="data.m_budget"
                v-bind:m_sum_total="data.m_sum"
                v-show="data.m_budget !== 0 && enable_budget_mode && !data.is_income"
              />
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import category_icon from '@/components/categories/IconShow'
import category_budget_line_diagram from '@/components/reports/CategoryBudgetLineDiagram'

export default {
  components: {
    category_icon,
    category_budget_line_diagram
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
    enable_budget_mode: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      power: 50
    }
  },
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
}

.percents {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #787676;
}

.main-part {
  width: 100%;
}

.text {
  display: flex;
  margin-bottom: 6px;
}

.css-category-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}
</style>