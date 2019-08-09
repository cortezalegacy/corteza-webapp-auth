import { expect } from 'chai'
import sinon from 'sinon'
import ExternalProvider from 'corteza-webapp-auth/src/components/ExternalProvider'
import { writeableWindowLocation, shallowMount } from 'corteza-webapp-auth/tests/lib/helpers'

describe('components/ExternalProvider.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $SystemAPI, $auth, propsData
  beforeEach(() => {
    $SystemAPI = { authSettingsEndpoint: () => undefined }
    $auth = {
      goto: (u) => { window.location = u },
      open: (u) => { window.location = u },
    }
    propsData = { pKind: 'pKind' }
  })

  const mountEP = (opt) => shallowMount(ExternalProvider, {
    mocks: { $SystemAPI, $auth },
    propsData,
    ...opt,
  })

  describe('determine icon class', () => {
    it('from icon name', () => {
      let local = { pIcon: 'icon' }
      expect(ExternalProvider.computed.iconClass.call(local)).to.eq('icon')
    })

    it('from provider kind', () => {
      let local = { pKind: 'icon' }
      expect(ExternalProvider.computed.iconClass.call(local)).to.eq('icon')
    })

    it('determine if openid connect', () => {
      let local = { pIcon: 'openid-connect.some-provider' }
      expect(ExternalProvider.computed.iconClass.call(local)).to.eq('openid')
    })
  })

  describe('determine auth url', () => {
    it('from provided url', () => {
      let local = { pUrl: 'some.url.com' }
      expect(ExternalProvider.computed.authUrl.call(local)).to.eq('some.url.com')
    })

    it('based on $SystemAPI and provider kind', () => {
      let local = {
        $SystemAPI: {
          baseURL: 'some.url.com',
          authSettingsEndpoint: () => '/settings/',
        },
        pKind: 'provider',
      }
      expect(ExternalProvider.computed.authUrl.call(local)).to.eq('some.url.com/settings/external/provider')
    })
  })

  describe('invocation', () => {
    it('redirect', () => {
      writeableWindowLocation({ path: '/dirty' })
      const wrap = mountEP()
      wrap.vm.redirect()

      expect(window.location).to.not.eq('/dirty')
    })

    it('callback', () => {
      propsData.onExternalAuth = sinon.fake()
      const wrap = mountEP()
      wrap.vm.redirect()

      sinon.assert.calledOnce(propsData.onExternalAuth)
    })
  })
})
