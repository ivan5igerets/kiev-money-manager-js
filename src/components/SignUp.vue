<template>
    <div class="signIn">

        <form id="signUp" @submit.prevent="sendData">
            
            <div>
                <input type="text" name="name" v-model="name" :class="{error: isNameError}" placeholder="Имя">
                <div v-show="isNameError" class="errorInputText" ref="nameErrorText"> {{ nameErrorText }} </div>
            </div>

            <div>
                <input type="email" name="login" v-model="email" :class="{error: isEmailError}" placeholder="E-mail">
                <div v-show="isEmailError" class="errorInputText" ref="emailErrorText"> {{ emailErrorText }} </div>
            </div>

            <div>
                <input type="password" name="password" v-model="password" :class="{error: isPasswordError}" placeholder="Введите пароль">
                <div v-show="isPasswordError" class="errorInputText" ref="passwordErrorText"> {{ passwordErrorText }} </div>
            </div>

            <div>
                <input type="password" name="password2" v-model="password2" :class="{error: isPassword2Error}" placeholder="Повторить пароль">
                <div v-show="isPassword2Error" class="errorInputText" ref="password2ErrorText"> {{ password2ErrorText }} </div>
            </div>
        </form>

        <div>
            <button form="signUp" ref="button" class="saveForm"> Зарегистрироваться </button>
        </div>

    </div>
</template>

<script>
import authApi from '@/api/auth'
import {Token} from '/src/session/Token.js';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            password2: '',
            isSubmitting: false,
            isNameError: false,
            isEmailError: false,
            isPasswordError: false,
            isPassword2Error: false,
            nameErrorText: '',
            emailErrorText: '',
            passwordErrorText: '',
            password2ErrorText: '',
        }
    },

    methods: {
        sendData() {

            if (!this.validation()) {
                return
            }

            const btn = this.$refs.button;
            btn.disabled = true;

            authApi.register({
                name: this.name,
                email: this.email,
                password: this.password,
                "password_confirmation": this.password2,
            })
            .then(res => {
                btn.disabled = false;
                Token.set(res.data.token);
                this.$emit('success');
                this.$router.push({name: 'OperationHistoryDay'});
                })
            .catch(err => {
                btn.disabled = false;
                this.parsingErrors(err.response.data.errors);
                })
        },

        validation() {

            let out = true

            this.name = this.name.trim();
            if (this.name.length == 0) {
                this.isNameError = true;
                this.nameErrorText = 'Это обязательное поле'
                out = false;
            } else {
                this.isNameError = false;
            }

            this.email = this.email.trim();
            if (this.email.length == 0) {
                this.isEmailError = true;
                this.emailErrorText = 'Это обязательное поле'
                out = false;
            } else {
                this.isEmailError = false;
            }

            this.password = this.password.trim();
            this.password2 = this.password2.trim();

            if (this.password.length < 8) {
                this.isPasswordError = true;
                this.passwordErrorText = 'Длинна пароля должна быть не менее 8 символов'
                out = false;
            } else {
                this.isPasswordError = false;
            }

            if (this.password2.length < 8) {
                this.isPassword2Error = true;
                this.password2ErrorText = 'Длинна пароля должна быть не менее 8 символов'
                out = false;
            } else {
                this.isPassword2Error = false;
            }

            if (this.password.length > 7 && this.password2.length > 7) {
                if (this.password2 != this.password) {
                    this.isPasswordError = true;
                    this.isPassword2Error = true;

                    this.passwordErrorText = 'Пароли должны совпадать'
                    this.password2ErrorText = 'Пароли должны совпадать'
                    out = false;
                } else {
                    this.isPasswordError = false;
                    this.isPassword2Error = false;
                }
            }

            return out
        },

        parsingErrors(errors) {
            for(const item in errors) {
                switch(item) {
                    case 'name':
                        this.isNameError = true;
                        this.nameErrorText = errors[item][0];
                        break;
                    case 'email':
                        this.isEmailError = true;
                        this.emailErrorText = errors[item][0];
                        break;
                    case 'password':
                        this.isPasswordError = true;
                        this.passwordErrorText = errors[item][0];
                        break;
                    case 'password_confirmation':
                        this.isPassword2Error = true;
                        this.password2ErrorText = errors[item][0];
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