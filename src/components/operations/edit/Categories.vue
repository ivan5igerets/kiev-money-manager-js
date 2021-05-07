<template>
  <loader v-if="loading"/>
  <v-card flat class="overflow-y-auto" id="category-list-container" v-else>
    <v-card-text>
      <div class="css-category-list-grid">
        <div class="ma-2 text-center" v-for="a_category in a_categories" :key="a_category.k_category">
          <v-avatar
            :color="k_category_select === a_category.k_category ? a_category.s_icon_color : 'grey'"
            :key="a_category.k_category"
            @click="categorySelect(a_category.k_category)"
            size="45"
          >
            <v-icon dark>{{a_category.s_icon_class}}</v-icon>
          </v-avatar>
          <div class="text-center text-no-wrap css-category-title">
            {{a_category.text_category}}
          </div>
        </div>
        <div class="ma-2 text-center">
          <v-avatar :color="'grey'" @click="categoryAdd" size="45">
            <v-icon dark class="css-category-add" color="white">mdi-plus</v-icon>
          </v-avatar>
          <div class="text-center text-no-wrap css-category-title">Добавить</div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import loader from '@/components/Loader'

import operationApi from '@/api/operation'

export default {
  components: {loader},
  props: {
    is_income: {
      type: Number,
      required: true
    },
    k_category: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      a_categories: [],
      k_category_select: this.k_category,
      loading: true,
    }
  },

  methods: {
    categoryAdd() {
      this.$router.push({name: 'CategoryAdd', query: {is_income: this.is_income}});
    },

    categorySelect(value) {
      this.k_category_select = value
      this.$emit('category_select', value)
    },

    categoryHeightResize() {
      const i_calculate_height = 251
      const i_wrap_height = document.getElementsByClassName('v-main__wrap')[0].offsetHeight
      const category_list = document.getElementById('category-list-container')
      const i_category_height = category_list.offsetHeight

      const i_delta = i_wrap_height - i_calculate_height
      if(i_delta < i_category_height) {
        const i_height_sub = i_category_height - i_delta
        category_list.style.height = (i_category_height-i_height_sub)+'px';
      }
    }
  },

  mounted() {
    operationApi.categoriesGet({is_income: this.is_income}).then((a_response) => {
      this.a_categories = a_response.data
      this.loading = false
    })
  },

  updated() {
    if(this.k_category_select)
      this.categoryHeightResize()
  },
}

</script>

<style scoped>
  .css-category-add {
    border: 2px dotted #ffffff;
  }

  .css-category-list-grid {
    display: grid;
    grid-template-columns: 80px repeat(auto-fill, 80px);
    justify-content: center;
  }

  .css-category-title {
    font-size: 13px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>