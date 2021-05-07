<template>
  <v-text-field
    aria-autocomplete="none"
    :error-messages="error_message"
    :rules="rules"
    :value="name"
    @input="update"
    label="Имя"
  ></v-text-field>
</template>

<script>
export default {
  props: ['name', 'error_message'],

  data() {
    return {
      rules: [
        value => !!value || 'Поле не может быть пустым',
        value => (value && value.length >= 2) || 'Минимальная длинна 2 символа'
      ],
    }
  },

  methods: {
    update(value) {
      this.$emit("input", value);
    }
  }
}
</script>