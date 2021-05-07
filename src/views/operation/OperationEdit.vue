<template>
  <loader v-if="loading"/>
  <div v-else>
    <categories @category_select="categorySelect" v-bind:is_income="is_income" v-bind:k_category="k_category"/>
    <calculate
      v-bind:dl_operation="dl_operation"
      v-bind:is_show="true"
      v-bind:m_sum="m_sum"
      v-bind:text_comment="text_comment"
      @operation_save="save"
    />
    <delete_dialog_window
      event_name="delete-item"
      v-bind:callbackSubmit="operationDelete"
      v-bind:is_open="is_delete"
      v-bind:text_title="'Удалить операцию?'"
    />
  </div>
</template>

<script>
import calculate from '@/components/operations/edit/Calculate'
import categories from '@/components/operations/edit/Categories'
import delete_dialog_window from '@/components/DeleteDialogWindow'
import loader from '@/components/Loader'

import {CoreDate} from '/src/date/CoreDate.js'

import operationApi from '@/api/operation'

export default {
  components: {
    calculate,
    categories,
    delete_dialog_window,
    loader
  },

  data() {
    return {
      a_categories: [],
      dl_operation: CoreDate.now(),
      is_delete: false,
      is_income: false,
      k_category: 0,
      m_sum: 0,
      text_comment: '',
      loading: true,
    }
  },

  methods: {
    categorySelect(k_category) {
      this.k_category = k_category

      const i_calculate_height = 251
      const i_wrap_height = document.getElementsByClassName('v-main__wrap')[0].offsetHeight
      const category_list = document.getElementById('category-list-container')
      const i_category_height = category_list.offsetHeight

      const i_delta = i_wrap_height - i_calculate_height
      if(i_delta < i_category_height) {
        const i_height_sub = i_category_height - i_delta
        category_list.style.height = (i_category_height-i_height_sub)+'px';
      }
    },

    save(a_operation) {
      operationApi.put(this.$route.params.k_operation,{
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
    },

    operationDelete() {
      operationApi.destroy(this.$route.params.k_operation).then(() => {
        this.$router.go(-1)
      })
    }
  },

  mounted() {
    operationApi.get(this.$route.params.k_operation).then(o_response => {
      this.dl_operation = o_response.data.dl_operation
      this.is_income = o_response.data.is_income
      this.k_category = o_response.data.k_category
      this.m_sum = o_response.data.m_sum
      this.text_comment = o_response.data.text_comment
      this.loading=false
    })
  },

  created() {
    this.$root.$on('delete-item', is_delete => {
      this.is_delete = is_delete
    });
  },
}
</script>