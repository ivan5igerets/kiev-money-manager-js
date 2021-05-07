<template>
  <div class="css-main-container">

    <form class="changePassForm" id="change_password" @submit.prevent="changePassword">

      <div class="input-wrap text-center">
        <input type="password" :class="{inp_error: isOldPasswordError}" v-model="oldPassword" name="oldPassword" placeholder="Введите старый пароль" />
        <div v-show="isOldPasswordError" class="errorInputText" ref="passwordErrorText"> {{ oldPasswordErrorText }} </div>  
      </div>
      
      <div class="input-wrap text-center">
        <input type="password" :class="{inp_error: isNewPassword2Error}" v-model="newPassword" name="newPassword" placeholder="Введите новый пароль" />
        <div v-show="isNewPasswordError" class="errorInputText" ref="passwordErrorText"> {{ newPasswordErrorText }} </div>  
      </div>
      
      <div class="input-wrap text-center">
        <input type="password" :class="{inp_error: isNewPassword2Error}" v-model="newPassword2" name="newPassword2" placeholder="Подтвердите новый пароль" />
        <div v-show="isNewPassword2Error" class="errorInputText" ref="passwordErrorText"> {{ newPassword2ErrorText }} </div>
      </div>
    </form>

    <div>
        <button ref="button" form="change_password" class="saveForm"> Сохранить </button>
    </div>

  </div>
</template>

<script>
import profileApi from '../api/profile'

export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      isOldPasswordError: false,
      oldPasswordErrorText: '',
      isNewPasswordError: false,
      newPasswordErrorText: '',
      isNewPassword2Error: false,
      newPassword2ErrorText: '',
    }
  },

  methods: {
    errorReset() {
      this.isNewPassword2Error = false;
      this.isNewPasswordError = false;
      this.isOldPasswordError = false;
      this.newPassword2ErrorText = '';
      this.newPasswordErrorText = '';
      this.oldPasswordErrorText = '';
    },

    errorShow(a_errors) {
      this.errorReset();

      for(const s_field in a_errors) {
        switch(s_field) {
          case 'password_old':
            this.isOldPasswordError = true;
            this.oldPasswordErrorText = a_errors[s_field][0];
            break;
          case 'password_new':
            this.isNewPasswordError = true;
            this.newPasswordErrorText = a_errors[s_field][0];
            break;
          case 'password_new_confirmation':
            this.isNewPassword2Error = true;
            this.newPassword2ErrorText = a_errors[s_field][0];
            break;
        }
      }
    },

    changePassword() {
      if (this.validation()) {
        profileApi.changePassword({
          "password_old": this.oldPassword,
          "password_new": this.newPassword,
          "password_new_confirmation": this.newPassword2,
        })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(err => {
          this.errorShow(err.response.data.errors)
        })
      }
    },

    validation() {

      let out = true;

      this.oldPassword = this.oldPassword.trim();
      if (this.oldPassword.length < 8) {
          this.isOldPasswordError = true;
          this.oldPasswordErrorText = 'Длинна пароля должна быть не менее 8 символов'
          out = false;
      } else {
          this.isOldPasswordError = false;
      }

      this.newPassword = this.newPassword.trim();
      this.newPassword2 = this.newPassword2.trim();

      if (this.newPassword.length < 8) {
          this.isNewPasswordError = true;
          this.newPasswordErrorText = 'Длинна пароля должна быть не менее 8 символов'
          out = false;
      } else {
          this.isNewPasswordError = false;
      }

      if (this.newPassword2.length < 8) {
          this.isNewPassword2Error = true;
          this.newPassword2ErrorText = 'Длинна пароля должна быть не менее 8 символов'
          out = false;
      } else {
          this.isNewPassword2Error = false;
      }

      if (this.newPassword.length > 7 && this.newPassword2.length > 7) {
          if (this.newPassword2 != this.newPassword) {
              this.isNewPasswordError = true;
              this.isNewPassword2Error = true;

              this.newPasswordErrorText = 'Пароли должны совпадать'
              this.newPassword2ErrorText = 'Пароли должны совпадать'
              out = false;
          } else {
              this.isNewPasswordError = false;
              this.isNewPassword2Error = false;
          }
      }

      return out
    }
  },
}
</script>

<style lang="scss" scoped>


.changePassForm {
  margin-top: 20px;
}

input {
  margin: 15px;
}

  button {
    position: absolute;
    left: 20px;
    bottom: 10px;
  }
</style>