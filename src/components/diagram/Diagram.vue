<template>
  <div>   
    <PieChart 
      :data="data"
    />
    <v-divider />
    <div v-for="item in data" :key="item.id">
      <category v-if="item.k_category" :data="item" v-bind:enable_budget_mode="enable_budget_mode"/>
      <group v-if="item.k_category_group" :data="item" v-bind:enable_budget_mode="enable_budget_mode"/>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/diagram/charts/PieChart'
import category from '@/components/diagram/list/Category'
import group from '@/components/diagram/list/Group'

export default {
  components: {
    PieChart,
    category,
    group,
  },

  props: {
    data: {
      type: Array,
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
  justify-content: center;
}
</style>