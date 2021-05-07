<template>
  <loader v-if="isLoading" />
  <v-form v-else ref="form" lazy-validation id="profile" @submit.prevent="profileUpdate">
    <div class="сss-profile-container pa-4">
      <name v-model="name" v-bind:name="name" v-bind:error_message="name_error_message"/>
      <email v-model="email" v-bind:email="email" v-bind:error_message="email_error_message"/>
      <div class="css-password">
        <div><p class="body-1 css-password-label">Пароль</p></div>
        <div><router-link :to="{name: 'ChangePassword'}">Изменить</router-link></div>
      </div>
    </div>
    <button_save_form id_form="profile"/>
  </v-form>
</template>

<script>

import button_save_form from '@/components/ButtonSaveForm'
import email from '@/components/profile/Email'
import loader from '@/components/Loader'
import name from '@/components/profile/Name'
import {mapState, mapMutations} from 'vuex'

import profileApi from '@/api/profile'

export default {
  components: {
    button_save_form,
    email,
    loader,
    name
  },

  data() {
    return {
      name: '',
      email: '',
      email_error_message: '',
      name_error_message: '',
    };
  },

  mounted() {
    this.updateComponentData();
  },

  methods: {

    updateComponentData() {
      this.name = this.nameS;
      this.email = this.emailS;
    },

    errorReset() {
      this.name_error_message = '';
      this.email_error_message = '';
    },

    errorShow(a_errors) {
      this.errorReset()
      for(const s_field in a_errors) {
        switch(s_field) {
          case 'name':
            this.name_error_message = a_errors[s_field][0];
            break;
          case 'email':
            this.email_error_message = a_errors[s_field][0];
            break;
        }
      }
    },

    profileUpdate() {
      if(!this.$refs.form.validate())
        return;

      profileApi.updateProfile({
        name: this.name,
        email: this.email
      }).then(() => {
        this.setName(this.name)
        this.setEmail(this.email)
        this.$router.go(-1)
      })
      .catch(o_response => {
        this.errorShow(o_response.response.data.errors)
      })
    },

    ...mapMutations({
      setName: "auth/setName",
      setEmail: "auth/setEmail",
    }),
  },

  watch: {
    isLoading: function(newVal) {
      if (!newVal) {
        this.updateComponentData();
      }
    }
  },

  computed: {
    ...mapState('auth',{
      nameS:'name',
      emailS:'email',
      isLoading: 'isLoading',
    })
  }
}

</script>

<style>
.css-password {
  display: flex;
}

.css-password-label {
  margin-right: 4px;
  color: grey;
}
</style>