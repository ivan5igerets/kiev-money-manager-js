<template>
  <div id="app">
    <component :is="layout">
    </component>
  </div>
</template>

<script>
import authApi from '@/api/auth'
import additional from '@/layouts/additional.vue'
import edit from '@/layouts/edit.vue'
import empty from '@/layouts/empty.vue'
import mainn from '@/layouts/main.vue'
import { mapMutations } from 'vuex'

import {Token} from '/src/session/Token.js';

export default {
  components: {
    empty,
    edit,
    additional,
    mainn,
  },

  mounted() {
    if(window.navigator.onLine)
      this.getUser();
    else
      this.$router.push({name: 'NotInternet'})
  },

  computed: {
    layout: function() {
      return this.$route.meta.layout;
    }
  },

  methods: {

    getUser() {
      if(!Token.get())
      {
        this.$router.push({name: 'NotInternet'})
        return
      }

      this.loadingToggle(true);
      authApi.getUser()
      .then(res => {
          this.setName(res.data.name);
          this.setEmail(res.data.email);
          this.loadingToggle(false);
        })
      .catch(err => {
        console.log(err);
        Token.reset()
        this.$router.push('/')
        this.loadingToggle(false);
        })
    },

    ...mapMutations({
      setName: "auth/setName",
      setEmail: "auth/setEmail",
      loadingToggle: "auth/loadingToggle",
    }),

  },

}
</script>
