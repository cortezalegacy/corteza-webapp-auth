/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import ResetPassword from 'corteza-webapp-auth/src/views/ResetPassword'
import { shallowMount, makeToken, stdReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/ResetPassword.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $SystemAPI, $router, $route, $auth
  beforeEach(() => {
    $SystemAPI = {
      authInternalExchangePasswordResetToken: sinon.stub().resolves({ user: {} }),
      authInternalResetPassword: sinon.stub().resolves(),
    }
    $router = { push: sinon.fake() }
    $route = { query: { token: makeToken() } }
    $auth = {}
  })

  const mountRP = (opt) => shallowMount(ResetPassword, {
    mocks: { $SystemAPI, $router, $route, $auth },
    ...opt,
  })

  describe('exchange for token', () => {
    it('no token provided - cancel process and notify user', () => {
      $route.query.token = undefined
      const wrap = mountRP()

      sinon.assert.notCalled($SystemAPI.authInternalExchangePasswordResetToken)
      expect(wrap.find('.error').exists()).to.be.true
      expect(wrap.find('.reset-form').exists()).to.be.false
    })

    it('invalid token - cancel process and notify user', () => {
      $route.query.token = 'invalid'
      const wrap = mountRP()

      sinon.assert.notCalled($SystemAPI.authInternalExchangePasswordResetToken)
      expect(wrap.find('.error').exists()).to.be.true
      expect(wrap.find('.reset-form').exists()).to.be.false
    })

    it('on success - allow password reset', async () => {
      const wrap = mountRP()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalExchangePasswordResetToken)
      expect(wrap.find('.error').exists()).to.be.false
      expect(wrap.find('.reset-form').exists()).to.be.true
    })

    it('on error - don\'t allow password reset', async () => {
      $SystemAPI.authInternalExchangePasswordResetToken = stdReject()
      const wrap = mountRP()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalExchangePasswordResetToken)
      expect(wrap.find('.error').exists()).to.be.true
      expect(wrap.find('.reset-form').exists()).to.be.false
    })
  })

  describe('password reset', () => {
    let created
    beforeEach(() => {
      created = sinon.fake()
    })

    it('no token - don\'t process input', () => {
      const wrap = mountRP({ created })
      wrap.vm.changePassword()

      sinon.assert.notCalled($SystemAPI.authInternalResetPassword)
    })

    it('on success - redirect', async () => {
      const wrap = mountRP({ created })
      wrap.setData({ token: makeToken() })
      wrap.vm.changePassword()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalResetPassword)
      sinon.assert.calledOnce($router.push)
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalResetPassword = stdReject()
      const wrap = mountRP({ created })
      wrap.setData({ token: makeToken() })
      wrap.vm.changePassword()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalResetPassword)
      sinon.assert.notCalled($router.push)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })
})
