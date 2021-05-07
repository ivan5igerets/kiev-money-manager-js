<template>
  <div>
    <v-progress-linear
      :background-color="(m_budget - m_sum_total) >= 0 ? '#e0dfdf' : 'red'"
      :value="budgetValue()"
      class="css-progress-linear"
      :color="color"
      :height="i_height"
    >
    </v-progress-linear>
  </div>
</template>
<script>
export default {
  props: {
    i_height: {
      default: 50,
      type: Number,
      required: false,
    },
    m_budget: {
      type: Number,
      required: true,
    },
    m_sum_total: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default:'yellow'
    },
  },
  methods: {
    budgetValue() {
      const i_diff = this.m_budget - this.m_sum_total
      return i_diff>0 ?
        (this.m_sum_total*100)/this.m_budget :
        ((this.m_budget-(i_diff*-1))*100) / this.m_budget
    },
  }
}
</script>

<style lang="scss" scoped>
.css-progress-linear {
  border-radius: 10px;
}
</style>