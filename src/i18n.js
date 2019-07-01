import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'

// Plugins for i18next
import lngDetector from 'i18next-browser-languagedetector'

import resources from './translations'

// Initializes i18n options, registers
// plugin on a given Vue instance and returns the options (to be used in new Vue({ i18n: ... })
//
// This approach is needed because we'll be reusing this in other
// projects too
export default (Vue) => {
  i18next
    .use(lngDetector)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      ns: ['auth'],
      debug: process.env.NODE_ENV !== 'production',
      detection: {
        // to overwrite, to use user defined, to guess user's lang
        order: ['querystring', 'localStorage', 'cookie', 'navigator'],
        caches: [/* 'localStorage', 'cookie' */],
      },
      resources,
    })

  Vue.use(VueI18Next)
  return new VueI18Next(i18next)
}
