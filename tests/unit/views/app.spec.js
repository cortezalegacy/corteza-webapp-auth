/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import App from 'corteza-webapp-auth/src/views/App'
import { shallowMount, stdReject, networkReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/App.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $SystemAPI, $auth, propsData
  beforeEach(() => {
    $SystemAPI = { authSettings: sinon.stub().resolves() }
    $auth = {}
    propsData = {}
  })

  const mountApp = (opt) => shallowMount(App, {
    mocks: { $SystemAPI, $auth },
    propsData,
    ...opt,
  })

  describe('configuration', () => {
    it('$SystemAPI not provided - prevent config', () => {
      $SystemAPI = undefined
      mountApp()
      // app would crash if this check wasn't implemented, so no assertion needed
    })

    it('on success - apply configuration', async () => {
      const settings = { internalEnabled: true, externalEnabled: false }
      const externalProviders = [{ label: 'b' }, { label: 'a' }]
      $SystemAPI.authSettings = sinon.stub().resolves({ ...settings, externalProviders })
      const wrap = mountApp()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authSettings)
      expect(wrap.vm.settings).to.include({ ...settings, internalPasswordResetEnabled: null })
      expect(wrap.vm.settings.externalProviders).to.deep.eq([{ label: 'a' }, { label: 'b' }])
    })

    it('on general error - invalidate auth and set flag', async () => {
      $SystemAPI.authSettings = stdReject()
      const wrap = mountApp()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authSettings)
      expect(wrap.vm.error).to.not.be.null
      expect($auth).to.not.deep.eq({})
    })

    it('on network error - set flag', async () => {
      $SystemAPI.authSettings = networkReject()
      const wrap = mountApp()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authSettings)
      expect(wrap.vm.error).to.not.be.null
      expect($auth).to.deep.eq({})
    })
  })
})
