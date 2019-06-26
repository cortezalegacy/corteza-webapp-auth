// Route creation helper
const r = (name, component) => ({
  name: `auth:${name}`,
  path: `/${name}`,
  component: (resolve) => require([`./${component}.vue`], resolve),
})

export default [
  r('login', 'Login'),
  r('logout', 'Logout'),
  r('signup', 'Signup'),
  r('request-password-reset', 'RequestPasswordReset'),
  r('reset-password', 'ResetPassword'),
  r('confirm-email', 'ConfirmEmail'),
  r('profile', 'ViewProfile'),
  r('change-password', 'ChangePassword'),

  { path: '*',
    redirect: { name: 'auth:login' } },
]
