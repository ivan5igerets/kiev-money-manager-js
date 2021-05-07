<template>
  <v-dialog @input="update" :value="is_open">
    <v-card>
      <v-card-title>
        Удалить группу <b class="font-weight-bold ml-2">{{text_group}}</b>?
      </v-card-title>
      <v-card-text>
        <v-checkbox
            v-model="is_remove_category"
            label="Удалить добавленные категории в группе"
            color="primary"
            hide-details
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Отмена</v-btn>
        <v-btn color="red darken-1" text @click="deleteGroup">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import groupApi from '@/api/group'

export default {
  data() {
    return {
      is_remove_category: false
    }
  },

  props: {
    callbackAfterDelete: {
      type: Function,
      required: true,
    },
    is_open: {
      type: Boolean,
      required: true,
    },
    k_category_group: {
      type: Number,
      required: true,
    },
    text_group: {
      type: String,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.update(false)
    },

    update(value) {
      this.$root.$emit('delete-item', value)
    },

    deleteGroup() {
      groupApi.destroy(this.k_category_group, {
        is_remove_category: Number(this.is_remove_category)
      }).then(() => {
        this.$root.$emit('delete-item', false)
        this.callbackAfterDelete()
      })
    }
  }
}

</script>