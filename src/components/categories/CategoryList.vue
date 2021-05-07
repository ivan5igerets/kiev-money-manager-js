<template>
  <div>
    <v-list-item-group color="primary">
      <v-list-item
        v-for="(a_category, i_index) in a_category_list"
        :key="i_index"
        @click="categoryEdit(a_category.k_category)"
      >
        <v-list-item-icon class="mr-3">
          <category_icon v-bind:a_icon="{s_icon_class: a_category.s_icon_class, s_icon_color: a_category.s_icon_color}"/>
        </v-list-item-icon>
        <v-list-item-title v-text="a_category.text_category"></v-list-item-title>
        <v-list-item-action>
          <v-btn v-on:click.stop="categoryShowDeleteDialog(a_category.k_category, a_category.text_category)" icon>
            <v-icon color="red lighten-1">mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
    <delete_dialog_window
      event_name="delete-item"
      v-bind:callbackSubmit="categoryDelete"
      v-bind:is_open="a_category_delete.is_delete"
      v-bind:text_title="'Удалить категорию ' + a_category_delete.text_category + '?'"
    />
  </div>
</template>

<script>
import category_icon from '@/components/categories/IconShow'
import delete_dialog_window from '@/components/DeleteDialogWindow'

import categoryApi from '@/api/category'

export default {
  components: {
    category_icon,
    delete_dialog_window
  },

  props: {
    a_category_list: {
      type: Array,
      required: true,
    }
  },
  
  data() {
    return {
      a_category_delete: {
        is_delete: false,
        k_category: 0,
        text_category: ''
      }
    }
  },

  methods: {
    categoryDelete() {
      categoryApi.destroy(this.a_category_delete.k_category).then(() => {
        this.a_category_list.forEach((a_category, i_index) => {
          if(a_category.k_category === this.a_category_delete.k_category)
            this.a_category_list.splice(i_index, 1)
        })
        this.a_category_delete.is_delete = false
        this.$root.$emit('delete-item', false)
      })
    },

    categoryShowDeleteDialog(k_category, text_category) {
      this.a_category_delete = {
        is_delete: true,
        k_category: k_category,
        text_category: text_category
      };
    },

    categoryEdit(k_category) {
      this.$router.push({ name: 'CategoryEdit', params: {k_category: k_category}})
    },
  },

  created() {
    this.$root.$on('delete-item', is_delete => {
      this.a_category_delete.is_delete = is_delete
    });
  },
}
</script>