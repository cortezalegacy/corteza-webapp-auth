import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAt, faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebook, faGithub, faLinkedin, faOpenid } from '@fortawesome/free-brands-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(
  faAt,
  faUser,
  faKey,
  faGoogle,
  faFacebook,
  faGithub,
  faLinkedin,
  faOpenid,
)
