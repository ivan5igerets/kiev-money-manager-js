<template>
  <v-dialog @input="update" :value="is_open">
    <v-card>
      <v-card-title>
        {{text_title}}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancel">Отмена</v-btn>
        <v-btn color="red darken-1" text @click="callbackSubmit">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    is_open: {
      type: Boolean,
      required: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    callbackSubmit: {
      type: Function,
      required: true,
    },
    text_title: {
      type: String,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$root.$emit(this.event_name, false)
    },

    update(value) {
      this.$root.$emit(this.event_name, value)
    }
  }
}

</script>