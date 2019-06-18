import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Signup from '@/views/Signup'
import { mount, writeableWindowLocation } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/Signup.vue', () => {
  const isFalse = sinon.stub().returns(false)
  const isTrue = sinon.stub().returns(true)

  const mocks = { $auth: { is: isFalse } }
  let common = { localVue, stubs: ['router-view', 'router-link'], mocks }
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('disabledSubmit', () => {
      wrapper = mount(Signup, common)

      wrapper.setData({ processing: true })
      expect(wrapper.vm.disabledSubmit).to.eq(true)

      wrapper.setData({ processing: false })
      expect(wrapper.vm.disabledSubmit).to.eq(false)
    })
  })

  describe('created', () => {
    let push = sinon.fake()
    beforeEach(() => {
      push.resetHistory()
    })

    it('push.profile', () => {
      wrapper = mount(Signup, { ...common, mocks: { $auth: { is: isTrue }, $router: { push } } })
      assert(push.calledOnceWith({ name: 'profile' }))
    })

    it('allowSignup', () => {
      wrapper = mount(Signup, { ...common, mocks: { $auth: { is: isFalse } } })
      assert(push.notCalled)
    })
  })

  describe('methods', () => {
    describe('internalSignup', () => {
      let systemResolve, systemReject
      let form = { email: 'email', password: 'password' }
      const params = { jwt: 'jwt', user: 'user' }
      const finalize = sinon.fake()
      beforeEach(() => {
        systemResolve = sinon.stub().resolves(params)
        systemReject = sinon.stub().rejects(new Error('reject'))
        finalize.resetHistory()
      })

      it('resolve', (done) => {
        wrapper = mount(Signup, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalSignup: systemResolve } }, methods: { finalize }, data: () => ({ form }) })

        wrapper.vm.internalSignup()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)

        setTimeout(() => {
          assert(finalize.calledOnceWith(params))
          expect(wrapper.vm.error).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)

          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(Signup, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalSignup: systemReject } }, methods: { finalize }, data: () => ({ form }) })

        wrapper.vm.internalSignup()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)

        setTimeout(() => {
          assert(finalize.notCalled)
          expect(wrapper.vm.error).to.eq('reject')
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)

          done()
        })
      })
    })

    describe('finalize', () => {
      let $auth
      let afterSignup = sinon.stub()
      beforeEach(() => {
        $auth = { is: isFalse }
        afterSignup.resetHistory()
        writeableWindowLocation()
      })

      it('jwt.valid.afterSignup', () => {
        let params = { jwt: 'jwt', user: 'user', redirectTo: 'redirectTo' }
        wrapper = mount(Signup, { ...common, propsData: { afterSignup }, mocks: { $auth } })

        wrapper.vm.finalize(params)
        expect($auth.JWT).to.eq(params.jwt)
        expect($auth.user).to.eq(params.user)
        assert(afterSignup.calledOnce)
        expect(window.location).to.eq('/')
        expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)
      })

      it('jwt.valid.redirect', () => {
        let params = { jwt: 'jwt', user: 'user', redirectTo: 'redirectTo' }
        wrapper = mount(Signup, { ...common, mocks: { $auth } })

        wrapper.vm.finalize(params)
        expect($auth.JWT).to.eq(params.jwt)
        expect($auth.user).to.eq(params.user)
        assert(afterSignup.notCalled)
        expect(window.location).to.eq(params.redirectTo)
        expect(wrapper.vm.pendingEmailConfirmation).to.eq(false)
      })

      it('jwt.invalid')

      it('jwt.missing', () => {
        let params = { user: 'user', redirectTo: 'redirectTo' }
        wrapper = mount(Signup, { ...common, mocks: { $auth } })

        wrapper.vm.finalize(params)
        expect($auth.JWT).to.eq(undefined)
        expect($auth.user).to.eq(undefined)
        assert(afterSignup.notCalled)
        expect(window.location).to.eq('/')
        expect(wrapper.vm.pendingEmailConfirmation).to.eq(true)
      })
    })
  })
})
