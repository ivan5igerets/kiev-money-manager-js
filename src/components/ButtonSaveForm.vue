<template>
  <div>
    <button ref="button" :form="id_form" class="saveForm"> Сохранить </button>
  </div>
</template>

<script>
  export default {
    props: ['id_form']
  }
</script>

<style lang="scss" scoped>
button.saveForm {
  position: absolute;
  left: 20px;
  bottom: 10px;
}
</style>