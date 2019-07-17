/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import Signup from 'corteza-webapp-auth/src/views/Signup'
import { writeableWindowLocation, shallowMount, stdReject, makeJWT } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/Signup.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $SystemAPI, $auth, propsData
  beforeEach(() => {
    $SystemAPI = { authInternalSignup: sinon.stub().resolves({ jwt: makeJWT() }) }
    $auth = {}
    propsData = { externalEnabled: true, internalSignUpEnabled: true, externalProviders: [] }
  })

  const mountSignup = (opt) => shallowMount(Signup, {
    mocks: { $SystemAPI, $auth },
    propsData,
    ...opt,
  })

  it('authenticated - redirect', () => {
    const gotoProfileIfAuthenticated = sinon.fake()
    mountSignup({ methods: { gotoProfileIfAuthenticated } })

    sinon.assert.calledOnce(gotoProfileIfAuthenticated)
  })

  describe('internal signup', () => {
    it('disabled - don\'t render form', () => {
      propsData.internalSignUpEnabled = false
      const wrap = mountSignup()

      expect(wrap.find('.signup-form').exists()).to.be.false
    })

    it('enabled - render form', () => {
      propsData.internalSignUpEnabled = true
      const wrap = mountSignup()

      expect(wrap.find('.signup-form').exists()).to.be.true
    })

    it('disabled - don\'t process input', () => {
      propsData.internalSignUpEnabled = false
      const wrap = mountSignup()
      wrap.vm.internalSignup()

      sinon.assert.notCalled($SystemAPI.authInternalSignup)
    })

    it('on success - email confirmation pending', async () => {
      $SystemAPI.authInternalSignup = sinon.stub().resolves()
      const wrap = mountSignup()
      wrap.vm.internalSignup()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalSignup)
      expect(wrap.find('.email-pending').exists()).to.be.true
    })

    it('on success - redirect', async () => {
      writeableWindowLocation({ path: '/dirty' })
      const wrap = mountSignup()
      wrap.vm.internalSignup()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalSignup)
      expect(window.location).to.not.eq('/dirty')
    })

    it('on success - callback', async () => {
      propsData.afterSignup = sinon.fake()
      const wrap = mountSignup()
      wrap.vm.internalSignup()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalSignup)
      sinon.assert.calledOnce(propsData.afterSignup)
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalSignup = stdReject()
      const wrap = mountSignup()
      wrap.vm.internalSignup()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalSignup)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })

  describe('external signup', () => {
    it('disabled - don\'t render provider list', () => {
      propsData.externalEnabled = false
      const wrap = mountSignup()

      expect(wrap.find('.external-providers').exists()).to.be.false
    })

    it('enabled with no providers - don\'t render provider list', () => {
      propsData.externalEnabled = true
      propsData.externalProviders = undefined
      const wrap = mountSignup()

      expect(wrap.find('.external-providers').exists()).to.be.false
    })

    it('enabled with providers - render provider list', () => {
      propsData.externalEnabled = true
      propsData.externalProviders = [{}, {}]
      const wrap = mountSignup()

      expect(wrap.find('.external-providers').exists()).to.be.true
    })
  })
})
