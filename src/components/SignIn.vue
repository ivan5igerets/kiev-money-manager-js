<template>
    <div class="signIn">

        <form id="signIn" @submit.prevent="sendData">
            <div>
                <input type="email" name="login" v-model="email" :class="{error: isEmailError}" placeholder="E-mail">
                <div v-show="isEmailError" class="errorInputText" ref="emailErrorText"> {{ emailErrorText }} </div>
            </div>

            <div>
                <input type="password" name="password" v-model="password" :class="{error: isPasswordError}" placeholder="Введите пароль">
                <div v-show="isPasswordError" class="errorInputText" ref="passwordErrorText"> {{ passwordErrorText }} </div>
            </div>
        </form>

        <div>
            <button ref="button" form="signIn" class="saveForm"> Войти </button>
        </div>

    </div>
</template>

<script>
import authApi from '@/api/auth'
import {Token} from '/src/session/Token.js';

export default {
    data() {
        return {
            email: '',
            password: '',
            isSubmitting: false,
            isEmailError: false,
            isPasswordError: false,
            emailErrorText: '',
            passwordErrorText: '',
        }
    },

    methods: {

        sendData() {

            if (!this.validation()) {
                return
            }

            const btn = this.$refs.button;
            btn.disabled = true;

            authApi.login({
                email: this.email,
                password: this.password
            }) 
            .then(res => {
                btn.disabled = false
                Token.set(res.data.token)
            this.$router.push({name: 'OperationHistoryDay'})
                })
            .catch(err => {
                btn.disabled = false
                this.parsingErrors(err.response.data.errors)
                })
        },

        validation() {

            let out = true
            this.email = this.email.trim();

            if (this.email.length == 0) {
                this.isEmailError = true;
                this.emailErrorText = 'Это обязательное поле'
                out = false;
            } else {
                this.isEmailError = false;
            }

            this.password = this.password.trim();

            if (this.password.length < 8) {
                this.isPasswordError = true;
                this.passwordErrorText = 'Длинна пароля должна быть не менее 8 символов'
                out = false;
            } else {
                this.isPasswordError = false;
            }

            return out
        },

        parsingErrors(errors) {
            for(const item in errors) {
                switch(item) {
                    case 'email':
                        this.isEmailError = true;
                        this.emailErrorText = errors[item][0];
                        break;
                    case 'password':
                        this.isPasswordError = true;
                        this.passwordErrorText = errors[item][0];
                        break;
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.signIn {
    height: calc(100vh - 215px);
    position: relative;
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