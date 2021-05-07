<template>
  <v-text-field
    aria-autocomplete="none"
    :error-messages="error_message"
    :rules="rules"
    :value="email"
    @input="update"
    label="Email"
  ></v-text-field>
</template>

<script>
export default {
  props: ['email', 'error_message'],

  data() {
    return {
      rules: [
        value => !!value || 'Поле не может быть пустым',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Введен некорректный E-mail'
        }
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