<template>
  <v-text-field
    :error-messages="error_message"
    :label="text_label"
    :rules="a_rules"
    :value="text_value"
    autocomplete="off"
    @input="input"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    error_message: {
      type: String,
      required: true,
    },
    text_value: {
      type: String,
      required: true
    },
    text_label: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      a_rules: [value => !!value || 'Поле не может быть пустым'],
    }
  },

  methods: {
    input(value) {
      this.$emit('input', value)
    }
  }
}
</script>