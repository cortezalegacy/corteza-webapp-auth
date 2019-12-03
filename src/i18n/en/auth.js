export default {
  system: {
    repository: {
      UserNotFound: 'User doesn\'t exist',
    },
    service: {
      UserSuspended: 'User is suspended',
      UserDeleted: 'User is deleted ',
      ErrUserInvalid: 'User is invalid',
    },
  },
  general: {
    'error-tpl': 'Error: {{- error}}', // interporated & unescaped
    form: {
      submit: 'Submit',
    },
    'login-disabled': 'Login disabled. Contact your administrator.',
    'internal-external-separator': 'or select below:',
  },
  link: {
    'change-password': '$t(view.change-password.title)',
    logout: '$t(auth:view.logout.title)',
    'forgotten-password-cta': 'Forgot your password?',
    'login-cta': 'Login here',
    login: 'Login',
    'signup-cta': 'Create new account',
    'profile-cta': 'Back to profile',
  },
  components: {
    'external-provider': {
      'login-with': 'Login with',
    },
  },
  view: {
    'change-password': {
      title: 'Change your password',
      changed: 'Password changed.',
      form: {
        email: {
          label: 'Email:',
        },
        'old-password': {
          label: 'Old password:',
          placeholder: 'Your old password',
        },
        'new-password': {
          label: 'New password:',
          placeholder: 'Your new password',
        },
        'check-password': {
          label: 'Repeat your new password:',
          placeholder: 'Repeat',
        },
        handle: {
          label: 'Handle:',
          placeholder: 'Name, nickname, handle',
        },
        submit: 'Submit',
      },
    },
    'confirm-email': {
      title: 'Email confirmation',
      'check-or-repeat': 'Check your email again or try to login again to receive a new token.',
      sending: 'Sending confirmation token ...',
      confirmed: 'Email confirmed, redirecting.',
    },
    login: {
      title: 'Login',
      form: {
        email: {
          label: 'Email:',
          placeholder: 'email@domain.tld',
        },
        password: {
          label: 'Password:',
          placeholder: 'Your password',
        },
        name: {
          label: 'Full name:',
          placeholder: 'Your full name',
        },
        handle: {
          label: 'Handle:',
          placeholder: 'Name, nickname, handle',
        },
        submit: 'Login',
      },
    },
    logout: {
      title: 'Logout',
    },
    'request-password-reset': {
      title: 'Request password reset',
      'password-request-sent': 'Password reset request sent. Check your inbox.',
      form: {
        email: {
          label: 'Email:',
          placeholder: 'email@domain.tld',
        },
        send: 'Send',
      },
    },
    'reset-password': {
      title: 'Reset your password',
      'validating-token': 'Validating password reset token...',
      'set-new-password': 'Set new password for {{ user.email }}',
      error: {
        'invalid-token': 'Invalid token',
        'missing-token': 'Missing token',
      },
      form: {
        'new-password': {
          label: 'New password:',
          placeholder: 'Your new password',
        },
        reset: 'Reset',
      },
    },
    signup: {
      title: 'Sign up',
      'existing-account': 'Already have an account?',
      'pending-email-confirmation': 'Email confirmation link sent. Check your inbox.',
      form: {
        email: {
          label: 'Email:',
          placeholder: 'email@domain.tld',
        },
        password: {
          label: 'Password:',
          placeholder: 'Your password',
        },
        name: {
          label: 'Full name:',
          placeholder: 'Your full name',
        },
        handle: {
          label: 'Handle:',
          placeholder: 'Name, nickname, handle',
        },
        submit: '$t(auth:general.form.submit)',
      },
    },
    profile: {
      title: 'Your profile',
      fields: {
        email: {
          label: 'Email:',
        },
        name: {
          label: 'Full name:',
        },
        handle: {
          label: 'Name, nickname, handle:',
        },
        submit: '$t(auth:general.form.submit)',
      },
    },
  },
}
