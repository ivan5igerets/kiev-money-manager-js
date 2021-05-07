<template>
  <div class="css-group-list">
    <v-list-group v-for="(a_group, i_index) in a_group_list" :key="i_index" no-action flat>
      <template v-slot:activator>
        <category_icon v-bind:a_icon="{s_icon_class: a_group.s_icon_class, s_icon_color: a_group.s_icon_color}" />
        <v-list-item-title>{{a_group.text_group}}</v-list-item-title>
        <v-menu bottom left>
          <template v-slot:activator="{on, attrs}">
            <v-btn color="grey" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item key="1" @click="groupEdit(a_group.k_category_group)">
              <v-list-item-title>Редактировать</v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="groupShowDeleteDialog(a_group.k_category_group, a_group.text_group)">
              <v-list-item-title>Удалить</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <v-list-item
        class="pl-14"
        v-for="(a_category, k_category) in a_group.a_category"
        :key="k_category"
        @click="categoryEdit(a_category.k_category)"
        link
      >
        <v-list-item-icon class="mr-3">
          <category_icon v-bind:a_icon="{s_icon_class: a_category.s_icon_class, s_icon_color: a_category.s_icon_color}"/>
        </v-list-item-icon>
        <v-list-item-title v-text="a_category.text_category"></v-list-item-title>
          <v-list-item-action>
            <v-btn
              @click.stop="categoryShowDeleteDialog(a_category.k_category, a_category.text_category, a_group.k_category_group)"
              icon
            >
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
      </v-list-item>
    </v-list-group>
    <category_delete_dialog
      event_name="delete-item"
      v-bind:callbackSubmit="categoryDelete"
      v-bind:is_open="a_category_delete.is_delete"
      v-bind:text_title="'Удалить категорию ' + a_category_delete.text_category + '?'"
    />
    <group_delete_dialog
      v-bind:callbackAfterDelete="groupCallbackAfterDelete"
      v-bind:is_open="a_group_delete.is_delete"
      v-bind:k_category_group="a_group_delete.k_category_group"
      v-bind:text_group="a_group_delete.text_group"
    />
  </div>
</template>

<script>
import category_icon from '@/components/categories/IconShow'
import category_delete_dialog from '@/components/DeleteDialogWindow'
import group_delete_dialog from '@/components/categories/edit/group/DeleteDialogWindow'

import categoryApi from '@/api/category'

export default {
  components: {
    category_icon,
    category_delete_dialog,
    group_delete_dialog
  },

  data() {
    return {
      a_category_delete: {
        is_delete: false,
        k_category: 0,
        k_category_group: 0,
        text_category: '',
      },
      a_group_delete: {
        is_delete: false,
        k_category_group: 0,
        text_group: '',
      },
    }
  },

  props: {
    a_group_list: {
      type: Array,
      required: true,
    }
  },

  methods: {
    categoryEdit(k_category) {
      this.$router.push({name: 'CategoryEdit', params: {k_category: k_category}})
    },

    categoryShowDeleteDialog(k_category, text_category, k_category_group) {
      this.a_category_delete = {
        is_delete: true,
        k_category: k_category,
        k_category_group: k_category_group,
        text_category: text_category
      };
    },

    categoryDelete() {
      categoryApi.destroy(this.a_category_delete.k_category).then(() => {
        this.a_group_list.forEach((a_group, i_group_index) => {
          if(a_group.k_category_group !== this.a_category_delete.k_category_group)
            return false;

          if(a_group.a_category.length === 1) {
            this.a_group_list.splice(i_group_index, 1)
            return true;
          }
          else {
            this.a_group_list[i_group_index].a_category = this.a_group_list[i_group_index].a_category.filter(
              a_category => a_category.k_category !== this.a_category_delete.k_category
            )
          }
        })

        this.a_category_delete.is_delete = false
        this.$root.$emit('delete-item', false)
      })
    },

    groupEdit(k_category_group) {
      this.$router.push({name: 'GroupEdit', params: {k_category_group: k_category_group}})
    },

    groupCallbackAfterDelete() {
      window.location.reload()
    },

    groupShowDeleteDialog(k_category_group, text_group) {
      this.a_group_delete = {
        is_delete: true,
        k_category_group: k_category_group,
        text_group: text_group
      };
    },
  },

  created() {
    this.$root.$on('delete-item', is_delete => {
      this.a_category_delete.is_delete = is_delete
      this.a_group_delete.is_delete = is_delete
    });
  },
}
</script>

<style lang="scss">
.css-group-list {
  .v-list-group__header__append-icon {
    display: none !important;
  }
  .v-list-item__action {
    padding-right: 2px!important;
  }
}
</style>