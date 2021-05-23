<template>
    <div class="auth">
        <div class="auth_top">

            <img src="@/assets/images/main_image.svg" alt="">

        </div>

        <!-- тут должны быть вкладки -->
        <div class="auth_tabs">

            <span class="left_tab" @click="toggle('SignIn')"> Авторизация </span>
            <span class="right_tab" @click="toggle('SignUp')"> Регистрация </span>
            <span ref="line" class="line"></span>

        </div>

        <!-- это надо исправить -->
        <transition :name="animName"  mode="out-in">
            <component v-on:success="fetchUserData" :is="Tab"> </component>
        </transition>

    </div>
</template>


<script>
import SignIn from '@/components/SignIn.vue'
import SignUp from '@/components/SignUp.vue'
import { mapActions } from 'vuex'

export default {
    components: {
        SignIn,
        SignUp,
    },

    data() {
        return {
            Tab: 'SignIn',
            animName: 'slide-right',
        }
    },

    methods: {
        toggle(to) {

            if (to == 'SignIn') {
                this.animName = 'slide-right'
                this.move(false)
            } else {
                this.animName = 'slide-left'
                this.move(true)
            }
            this.Tab = to;
            console.log(this.animName);
        },

        move(flag) {        
            const line = this.$refs.line;

            if (flag) {
                let i = 0
                const time = setInterval(() => {
                    if (line.style.left != '50%') {
                        line.style.left = (i++) + '%';
                    } else {
                        clearInterval(time)
                    }
                }, 7)
            } else {
                let i = 50
                const time = setInterval(() => {
                    if (line.style.left != '0%') {
                        line.style.left = (i--) + '%';
                    } else {
                        clearInterval(time)
                    }
                }, 7)
            }
        
        },

        ...mapActions('auth',{
            fetchUserData: 'FETCH_DATA'
        }),
    },
}
</script>

<style lang="scss" scoped>
.auth {

  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  font-family: 'Rubik', sans-serif;
  font-style: normal;
  font-weight: normal;
  text-align: center;

    &_top {
        margin-top: 20px;
        margin-bottom: 5px;
    }


    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
      will-change: transform;
      transition: all 300ms;
      position: absolute;
    }
    .slide-right-enter {
    //   opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
    //   opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
    //   opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
    //   opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }

    //

    &_tabs {
        display: flex;
        justify-content: space-between;
        // background: red;
        align-items: center;
        width: 100vw;
        height: 35px;
        border-bottom: 1px solid #B6B6B6;
        margin-bottom: 20px;
        
        .left_tab {
            // margin-left: 40px;
            width: 100%;
        }

        .right_tab {
            // margin-right: 40px;
            width: 100%;
        }

        .line {
            position: absolute;
            left: 0;
            // top: 0;
            transform: translateY(17px);
            border-bottom: 4px solid #FFF84D;
            width: 50%;
        }
    }
}
</style>