/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import RequestPasswordReset from 'corteza-webapp-auth/src/views/RequestPasswordReset'
import { shallowMount, stdReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/RequestPasswordReset.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $router, $SystemAPI, propsData
  beforeEach(() => {
    $router = { push: sinon.fake() }
    $SystemAPI = { authInternalRequestPasswordReset: sinon.stub().resolves() }
    propsData = { internalPasswordResetEnabled: true }
  })

  const mountRPR = (opt) => shallowMount(RequestPasswordReset, {
    mocks: { $router, $SystemAPI },
    propsData,
    ...opt,
  })

  it('password reset disabled - redirect', () => {
    propsData.internalPasswordResetEnabled = false
    mountRPR()

    sinon.assert.calledOnce($router.push)
  })

  it('authenticated - redirect', () => {
    const methods = { gotoProfileIfAuthenticated: sinon.fake() }
    mountRPR({ methods })

    sinon.assert.calledOnce(methods.gotoProfileIfAuthenticated)
  })

  describe('request password reset', () => {
    it('password reset disabled - don\'t process input', () => {
      propsData.internalPasswordResetEnabled = false
      const wrap = mountRPR()
      wrap.vm.requestPasswordReset()

      sinon.assert.notCalled($SystemAPI.authInternalRequestPasswordReset)
    })

    it('on success - notify user', async () => {
      const wrap = mountRPR()
      wrap.vm.requestPasswordReset()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalRequestPasswordReset)
      expect(wrap.find('.request-success').exists()).to.be.true
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalRequestPasswordReset = stdReject()
      const wrap = mountRPR()
      wrap.vm.requestPasswordReset()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalRequestPasswordReset)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })
})
