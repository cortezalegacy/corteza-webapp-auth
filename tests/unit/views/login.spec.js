/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import Login from 'corteza-webapp-auth/src/views/Login'
import { writeableWindowLocation, stdReject, shallowMount, makeToken } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/Login.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $auth, $router, $route, $SystemAPI
  let propsData

  beforeEach(() => {
    $auth = { login: sinon.stub().resolves() }
    $router = { push: sinon.fake() }
    $route = { query: {} }
    $SystemAPI = {
      authInternalLogin: sinon.stub().resolves(),
      authExchangeAuthToken: sinon.stub().resolves(),
    }
    propsData = { internalEnabled: true, externalEnabled: true }
  })

  const mountLogin = (opt) => shallowMount(Login, {
    mocks: { $auth, $router, $route, $SystemAPI },
    propsData,
    ...opt,
  })

  it('authenticated - redirect', () => {
    const gotoProfileIfAuthenticated = sinon.fake()
    mountLogin({ methods: { gotoProfileIfAuthenticated } })

    sinon.assert.calledOnce(gotoProfileIfAuthenticated)
  })

  describe('internal login', () => {
    it('disabled - don\'t render form', () => {
      propsData.internalEnabled = false
      const wrap = mountLogin()

      expect(wrap.find('.login-form').exists()).to.be.false
    })

    it('enabled - render form', () => {
      const wrap = mountLogin()

      expect(wrap.find('.login-form').exists()).to.be.true
    })

    it('disabled - don\'t process input', () => {
      propsData.internalEnabled = false
      const wrap = mountLogin()
      wrap.vm.internalLogin()

      sinon.assert.notCalled($SystemAPI.authInternalLogin)
    })

    it('on success - redirect', async () => {
      writeableWindowLocation({ path: '/dirty' })
      const wrap = mountLogin()
      wrap.vm.internalLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalLogin)
      expect(window.location).to.not.eq('/dirty')
    })

    it('on success - callback', async () => {
      propsData.afterLogin = sinon.fake()
      const wrap = mountLogin()
      wrap.vm.internalLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalLogin)
      sinon.assert.calledOnce(propsData.afterLogin)
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalLogin = stdReject()
      const wrap = mountLogin()
      wrap.vm.internalLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalLogin)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })

  describe('external login - invocation', () => {
    it('disabled - don\'t render provider list', () => {
      propsData.externalEnabled = false
      const wrap = mountLogin()

      expect(wrap.find('.external-providers').exists()).to.be.false
    })

    it('enabled with no providers - don\'t render provider list', () => {
      propsData.externalEnabled = true
      const wrap = mountLogin()

      expect(wrap.find('.external-providers').exists()).to.be.false
    })

    it('enabled with providers - render provider list', () => {
      propsData.externalEnabled = true
      propsData.externalProviders = [{}, {}]
      const wrap = mountLogin()

      expect(wrap.find('.external-providers').exists()).to.be.true
    })
  })

  describe('external login - completion', () => {
    it('disabled - don\'t process input', () => {
      propsData.externalEnabled = false
      mountLogin()

      sinon.assert.notCalled($SystemAPI.authExchangeAuthToken)
    })

    it('no token provided - cancel process', () => {
      mountLogin()

      sinon.assert.notCalled($SystemAPI.authExchangeAuthToken)
    })

    it('invalid token - cancel process and redirect', () => {
      $route.query.token = 'invalid'
      mountLogin()

      sinon.assert.calledOnce($router.push)
    })

    it('on success - redirect', async () => {
      $route.query.token = makeToken()
      writeableWindowLocation({ path: '/dirty' })
      mountLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authExchangeAuthToken)
      expect(window.location).to.not.eq('/dirty')
    })

    it('on success - callback', async () => {
      propsData.afterLogin = sinon.fake()
      $route.query.token = makeToken()
      mountLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authExchangeAuthToken)
      sinon.assert.calledOnce(propsData.afterLogin)
    })

    it('on error - notify user', async () => {
      $SystemAPI.authExchangeAuthToken = stdReject()
      $route.query.token = makeToken()
      const wrap = mountLogin()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authExchangeAuthToken)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })
})
