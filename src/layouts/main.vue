<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app width="300">
      <div class="top-part">
        <img src="../assets/images/logo2.png" alt="">
        <div class="user-info">
          <div class="field">{{name}}</div>
          <div class="field">{{email}}</div>
        </div>
      </div>
      <div class="body-part">
        <v-list flat>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, i) in items"
              @click="moveTo(item.route)"
              :key="i"
            >
              <v-list-item-avatar width="30" min-width="30">
                <v-img :src="item.icon" height="30" width="30" min-width="30"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div class="footer">
          <v-divider></v-divider>
          <v-list flat>
            <v-list-item-group color="red">
              <v-list-item @click="logout">
                <v-list-item-avatar>
                  <v-img src="../assets/images/logout.png"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="'Выход'"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-btn v-if="$route.meta.is_back" icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-app-bar-nav-icon v-else @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="pl-0">{{$route.meta.title}}</v-toolbar-title>

      <v-spacer />

      <MonthPicker />
    </v-app-bar>
    <v-sheet
      class="overflow-y-auto"
      id="scroll-area"
      max-height="92vh"
      v-if="$route.meta.is_nav_menu"
      v-on:scroll.passive="scroll"
    >
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-sheet>
    <v-main v-else>
      <router-view></router-view>
    </v-main>
    <v-bottom-navigation
      grow color="primary"
      v-if="$route.meta.is_nav_menu"
      croll-target="#scroll-area"
      fixed
    >
      <v-btn :to="{name: 'OperationHistoryDay'}">
        <span>Главная</span>
        <v-icon>mdi-credit-card</v-icon>
      </v-btn>
      <v-btn :to="{name: 'Categories'}">
        <span>Категории</span>
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
      <v-btn :to="{name: 'Diagram'}">
        <span>Диаграмма</span>
        <v-icon>mdi-chart-arc</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import MonthPicker from '@/components/operations/MonthPicker'
import {Token} from '/src/session/Token.js';

export default {

  components: {
    MonthPicker
  },

  data: () => ({
    drawer: null,
    selectedItem: null,
    items: [
      { text: 'Профиль', icon: require('@/assets/images/profile.png'), route: 'profile' },
      { text: 'Настройки', icon: require('@/assets/images/settings.png'), route: 'settings'},
    ],
  }),

  methods: {
    moveTo(route) {
      setTimeout(() => {
        this.selectedItem = null
        this.drawer = null
        this.$router.push(route)
      }, 300)
    },
    back() {
      this.$router.go(-1)
    },
    logout() {
      Token.reset()
      this.$router.push({name: 'Auth'})
    },
    scroll(o_event) {
      this.$root.$emit('scroll-content', o_event)
    }
  },

  watch: {
    $route(to) {
      document.title = to.meta.title || 'Money Manager';
    },
  },

  computed: {
    ...mapState('auth',{
      name:'name',
      email:'email'
    })
  }
}
</script>

<style lang="scss" scoped>

.top-part {
  background: #FFD630;
  width: 100%;
  height: 120px;
  display: flex;
  padding: 20px;

  img {
    margin-right: 20px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .field {
      text-align: left;

      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 23px;

      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      color: #000000;
    }
  }

}

.body-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
}

.v-list-item__title {
  text-align: left;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 21px;

  color: #000000;
}

.scroll-area {
  max-height: 400px;
}
</style>