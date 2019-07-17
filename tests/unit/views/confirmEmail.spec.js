/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import ConfirmEmail from 'corteza-webapp-auth/src/views/ConfirmEmail'
import { shallowMount, stdReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/ConfirmEmail.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $SystemAPI, $auth, propsData, $route, afterConfirm
  const makeToken = () => '0'.repeat(33)
  beforeEach(() => {
    $auth = {}
    $SystemAPI = { authInternalConfirmEmail: sinon.stub().resolves() }
    propsData = {}
    $route = { query: { token: makeToken() } }
    afterConfirm = sinon.fake()
  })

  const mountCE = (opt) => shallowMount(ConfirmEmail, {
    mocks: { $SystemAPI, $auth, $route },
    methods: { afterConfirm },
    propsData,
    ...opt,
  })

  describe('confirmation', () => {
    it('no token provided - cancel process and notify user', () => {
      $route.query.token = undefined
      const wrap = mountCE()

      sinon.assert.notCalled($SystemAPI.authInternalConfirmEmail)
      expect(wrap.find('.error').exists()).to.be.true
    })

    it('invalid token - cancel process and notify user', () => {
      $route.query.token = 'invalid'
      const wrap = mountCE()

      sinon.assert.notCalled($SystemAPI.authInternalConfirmEmail)
      expect(wrap.find('.error').exists()).to.be.true
    })

    it('on success - redirect', async () => {
      mountCE()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalConfirmEmail)
      // redirect + timeout is wrapped inside this function
      sinon.assert.calledOnce(afterConfirm)
    })

    it('on success - callback', async () => {
      propsData.afterConfirmEmail = sinon.fake()
      mountCE()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalConfirmEmail)
      sinon.assert.calledOnce(propsData.afterConfirmEmail)
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalConfirmEmail = stdReject()
      const wrap = mountCE()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalConfirmEmail)
      expect(wrap.find('.error').exists()).to.be.true
    })
  })
})
