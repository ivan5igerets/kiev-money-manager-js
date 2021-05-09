import Vue from 'vue'
import VueRouter from 'vue-router'
import {Token} from '/src/session/Token.js';

Vue.use(VueRouter)

const ifAuthenticated = (to, from, next) => {
  if(!window.navigator.onLine)
  {
    next('/not-internet')
    return
  }

  const token = Token.get()
  if (token) {
    next()
    return
  }
  next('/')
}

const ifNotAuthenticated = (to, from, next) => {
  if(!window.navigator.onLine)
  {
    next('/not-internet')
    return
  }

  const token = Token.get()
  if (token) {
    next('/operation-history-day')
    return
  }
  next()
}

const ifNotInternet = (to, from, next) => {
  if(!window.navigator.onLine)
  {
    next()
    return
  }

  const token = Token.get()
  if (token)
    next('/operation-history-day')
  else
    next('/')
}

const routes = [
  {
    path: '/',
    name: 'Auth',
    meta: {
      layout: 'empty'
    },
    beforeEnter: ifNotAuthenticated,
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/not-internet',
    name: 'NotInternet',
    meta: {
      layout: 'empty'
    },
    beforeEnter: ifNotInternet,
    component: () => import('../views/NotInternet.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      is_back: true,
      title: 'Настройки',
      layout: 'mainn'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      is_back: true,
      title: 'Профиль',
      layout: 'mainn'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/change_password',
    name: 'ChangePassword',
    meta: {
      is_back: true,
      title: 'Изменение пароля',
      layout: 'mainn'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/ChangePassword.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    meta: {
      is_nav_menu: true,
      title: 'Категории',
      layout: 'mainn'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/categories/Categories.vue')
  },
  {
    path: '/category-add',
    name: 'CategoryAdd',
    meta: {
      is_edit: false,
      title: 'Добавить категорию',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/categories/category/CategoryAdd.vue')
  },
  {
    path: '/category-edit/:k_category',
    name: 'CategoryEdit',
    props: true,
    meta: {
      title: 'Редактирование категории',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/categories/category/CategoryEdit.vue')
  },
  {
    path: '/group-add',
    name: 'GroupAdd',
    meta: {
      is_edit: false,
      title: 'Добавить группу',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/categories/group/GroupAdd.vue')
  },
  {
    path: '/group-edit/:k_category_group',
    name: 'GroupEdit',
    meta: {
      is_back: true,
      title: 'Редактирование группы',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/categories/group/GroupEdit.vue')
  },
  {
    path: '/operation-history-day',
    name: 'OperationHistoryDay',
    meta: {
      is_nav_menu: true,
      title: 'Главная',
      layout: 'mainn',
      isNeedDate: true,
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/reports/OperationHistoryDay.vue')
  },
  {
    path: '/operation-add',
    name: 'OperationAdd',
    meta: {
      is_edit: false,
      title: 'Добавить операцию',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/operation/OperationAdd.vue')
  },
  {
    path: '/operation-edit/:k_operation',
    name: 'OperationEdit',
    meta: {
      title: 'Редактирование операции',
      layout: 'edit'
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/operation/OperationEdit.vue')
  },
  {
    path: '/diagram',
    name: 'Diagram',
    meta: {
      is_nav_menu: true,
      title: 'Диаграмма',
      layout: 'mainn',
      isNeedDate: true,
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/diagram/DiagramPage.vue')
  },
  {
    path: '/category-operation-history/:k_category',
    name: 'CategoryOperationHistory',
    meta: {
      title: 'История операций',
      layout: 'mainn',
      is_back: true,
      isNeedDate: true,
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/reports/CategoryOperationHistory.vue')
  },
  {
    path: '/group-operation-history/:k_category_group',
    name: 'GroupOperationHistory',
    meta: {
      title: 'История операций',
      layout: 'mainn',
      is_back: true,
      isNeedDate: true,
    },
    beforeEnter: ifAuthenticated,
    component: () => import('../views/reports/GroupOperationHistory.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router