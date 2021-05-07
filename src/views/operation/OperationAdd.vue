<template>
  <div>
    <categories @category_select="categorySelect" v-bind:is_income="is_income"/>
    <calculate
      v-bind:dl_operation="dl_operation"
      v-bind:is_show="!!k_category"
      v-bind:m_sum="m_sum"
      v-bind:text_comment="text_comment"
      @operation_save="save"
    />
  </div>
</template>

<script>
import calculate from '@/components/operations/edit/Calculate'
import categories from '@/components/operations/edit/Categories'

import operationApi from '@/api/operation'

import {CoreDate} from '/src/date/CoreDate.js'

export default {
  components: {
    calculate,
    categories
  },

  data() {
    return {
      a_categories: [],
      dl_operation: CoreDate.now(),
      is_income: this.$route.query.is_income,
      k_category: 0,
      loading: true,
      m_sum: 0,
      text_comment: '',
    }
  },

  methods: {
    categorySelect(k_category) {
      this.k_category = k_category
    },

    save(a_operation) {
      operationApi.post({
        dl_operation: a_operation['dl_operation'],
        k_category: this.k_category,
        m_sum: a_operation['m_sum'],
        text_comment: a_operation['text_comment']
      }).then(() => {
        CoreDate.systemSet(a_operation['dl_operation'])
        this.$router.go(-1)
      }).catch((o_error) => {
        console.log(o_error)
      });
    }
  },

  mounted() {
    operationApi.categoriesGet({is_income: this.$route.query.is_income}).then((a_response) => {
      this.a_categories = a_response.data
      this.loading = false
    })
  }
}
</script>