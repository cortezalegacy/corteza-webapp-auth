import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function view (name) {
  return function (resolve) {
    return require([`./views/${name}.vue`], resolve)
  }
}

export default new Router({
  base: '/auth',
  mode: 'history',
  routes: [
    { path: '/',
      name: 'login',
      component: view('Login') },

    { path: '/logout',
      name: 'logout',
      component: view('Logout') },

    { path: '/signup',
      name: 'signup',
      component: view('Signup') },

    // {
    //   path: '/request-password-reset',
    //   name: 'request-password-reset',
    //   component: view('RequestPasswordReset') },

    // {
    //   path: '/password-reset',
    //   name: 'password-reset',
    //   component: view('PasswordReset') },

    // { path: '/confirm-email',
    //   name: 'confirm-email',
    //   component: view('ConfirmEmail') },

    { path: '*',
      redirect: { name: 'login' },
    },
  ],
})
