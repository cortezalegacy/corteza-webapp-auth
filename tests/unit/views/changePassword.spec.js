/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import ChangePassword from 'corteza-webapp-auth/src/views/ChangePassword'
import { stdReject, shallowMount } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/ChangePassword.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $auth, $SystemAPI, $router, propsData
  beforeEach(() => {
    $auth = { is: sinon.stub().returns(true), user: {} }
    $SystemAPI = { authInternalChangePassword: sinon.stub().resolves() }
    $router = { push: sinon.fake() }
    propsData = { internalEnabled: true }
  })

  const mountCP = (opt) => shallowMount(ChangePassword, {
    mocks: { $auth, $SystemAPI, $router },
    propsData,
    ...opt,
  })

  it('internal disabled - redirect', () => {
    propsData.internalEnabled = false
    mountCP()

    sinon.assert.calledOnce($router.push)
  })

  it('not authenticated - redirect', () => {
    $auth.is = sinon.stub().returns(false)
    mountCP()

    sinon.assert.calledOnce($router.push)
  })

  it('if anonymous - redirect', () => {
    const gotoLoginFormIfAnonymous = sinon.fake()
    mountCP({ methods: { gotoLoginFormIfAnonymous } })

    sinon.assert.calledOnce(gotoLoginFormIfAnonymous)
  })

  describe('change password', () => {
    it('verify password matching', () => {
      let local = { form: { newPassword: 'new', newPasswordCheck: '' } }
      expect(ChangePassword.computed.passwordCheckMatch.call(local)).to.be.false

      local.form.newPasswordCheck = 'new'
      expect(ChangePassword.computed.passwordCheckMatch.call(local)).to.be.true
    })

    it('password mismatch - don\'t process input', () => {
      const computed = {
        passwordCheckMatch: sinon.stub().returns(false),
      }
      const wrap = mountCP({ computed })
      wrap.vm.changePassword()

      fp()
      sinon.assert.notCalled($SystemAPI.authInternalChangePassword)
    })

    it('internal disabled - don\'t process input', () => {
      propsData.internalEnabled = false
      const wrap = mountCP()
      wrap.vm.changePassword()

      fp()
      sinon.assert.notCalled($SystemAPI.authInternalChangePassword)
    })

    it('not authenticated - don\'t process input', () => {
      $auth.is = sinon.stub().returns(false)
      const wrap = mountCP()
      wrap.vm.changePassword()

      fp()
      sinon.assert.notCalled($SystemAPI.authInternalChangePassword)
    })

    it('on success - notify user', async () => {
      const wrap = mountCP()
      wrap.vm.changePassword()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalChangePassword)
      expect(wrap.find('.change-success').exists()).to.be.true
    })

    it('on error - notify user', async () => {
      $SystemAPI.authInternalChangePassword = stdReject()
      const wrap = mountCP()
      wrap.vm.changePassword()

      await fp()
      sinon.assert.calledOnce($SystemAPI.authInternalChangePassword)
      expect(wrap.find('.error').exists()).to.be.true
      expect(wrap.find('.change-success').exists()).to.be.false
    })
  })
})
