import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import ResetPassword from '@/views/ResetPassword'
import { mount } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/ResetPassword.vue', () => {
  const mocks = { $route: { query: {} } }
  let common = { localVue, stubs: ['router-view', 'router-link'], propsData: { internalPasswordResetEnabled: true }, mocks }
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('disabledSubmit', () => {
      wrapper = mount(ResetPassword, common)

      wrapper.setData({ processing: true })
      expect(wrapper.vm.disabledSubmit).to.eq(true)

      wrapper.setData({ processing: false })
      expect(wrapper.vm.disabledSubmit).to.eq(false)
    })
  })

  describe('created', () => {
    let exchangeToken = sinon.fake()
    beforeEach(() => {
      exchangeToken.resetHistory()
    })

    it('validate.token.valid', () => {
      let token = `${(new Array(33)).join('a')}123`
      wrapper = mount(ResetPassword, { ...common, methods: { exchangeToken }, mocks: { ...mocks, $route: { query: { token } } } })
      expect(wrapper.vm.error).to.eq(null)
      assert(exchangeToken.calledOnceWith(token))
    })

    it('validate.token.invalid', () => {
      let token = `invalid`
      wrapper = mount(ResetPassword, { ...common, mocks: { ...mocks, $route: { query: { token } } } })
      expect(wrapper.vm.error).to.eq('Invalid token')
      assert(exchangeToken.notCalled)
    })

    it('validate.token.missing', () => {
      wrapper = mount(ResetPassword, common)
      expect(wrapper.vm.error).to.eq('Missing token')
      assert(exchangeToken.notCalled)
    })
  })

  describe('methods', () => {
    let systemResolve, systemReject
    let token = 'token'

    describe('exchangeToken', () => {
      const params = { token: 'token', user: 'user' }
      beforeEach(() => {
        systemResolve = sinon.stub().resolves(params)
        systemReject = sinon.stub().rejects(new Error('reject'))
      })

      it('resolve', (done) => {
        wrapper = mount(ResetPassword, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalExchangePasswordResetToken: systemResolve } } })

        wrapper.vm.exchangeToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.token).to.eq(params.token)
          expect(wrapper.vm.user).to.eq(params.user)
          expect(wrapper.vm.processing).to.eq(false)
          assert(systemResolve.calledOnceWith({ token }))
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(ResetPassword, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalExchangePasswordResetToken: systemReject } } })

        wrapper.vm.exchangeToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.token).to.eq(null)
          expect(wrapper.vm.user).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          assert(systemReject.calledOnceWith({ token }))
          done()
        })
      })
    })

    describe('changePassword', () => {
      const params = { jwt: 'jwt', user: 'user' }
      const form = { password: 'password' }
      const push = sinon.fake()
      let $auth
      beforeEach(() => {
        systemResolve = sinon.stub().resolves(params)
        systemReject = sinon.stub().rejects(new Error('reject'))
        push.resetHistory()
        $auth = {}
      })

      it('resolve', (done) => {
        wrapper = mount(ResetPassword, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalResetPassword: systemResolve }, $auth, $router: { push } }, data: () => ({ token, form }) })

        wrapper.vm.changePassword()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect($auth.JWT).to.eq(params.jwt)
          expect($auth.user).to.eq(params.user)
          expect(wrapper.vm.error).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          assert(systemResolve.calledOnceWith({ token, ...form }))
          assert(push.calledOnceWith({ name: 'profile' }))
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(ResetPassword, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalResetPassword: systemReject }, $auth, $router: { push } }, data: () => ({ token, form }) })

        wrapper.vm.changePassword()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect($auth.JWT).to.eq(undefined)
          expect($auth.user).to.eq(undefined)
          expect(wrapper.vm.error).to.eq('reject')
          expect(wrapper.vm.processing).to.eq(false)
          assert(systemReject.calledOnceWith({ token, ...form }))
          assert(push.notCalled)
          done()
        })
      })
    })
  })
})
