<template>
    <div class="mr-2">
        <template>
            <v-avatar :color="a_icon.s_icon_color" size="30">
          <v-icon dark>{{ a_icon.s_icon_class }}</v-icon>
        </v-avatar>
      </template>
    </div>
</template>

<script>
export default {
    props: {
        a_icon: {
            type: Object,
            required: true,
        }
    },
}
</script>