import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Login from '@/views/Login'
import { mount, writeableWindowLocation } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/Login.vue', () => {
  const isFalse = sinon.stub().returns(false)
  const isTrue = sinon.stub().returns(true)

  const mocks = { $route: { query: {} }, $auth: { is: isFalse } }
  const common = { localVue, propsData: { internalEnabled: true }, stubs: ['router-view', 'router-link'], mocks }
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('disabledSubmit', () => {
      wrapper = mount(Login, common)
      expect(wrapper.vm.disabledSubmit).to.eq(false)

      wrapper.setData({ processing: true })
      expect(wrapper.vm.disabledSubmit).to.eq(true)
    })
  })

  describe('created', () => {
    it('finishesExternal', () => {
      const finishExternal = sinon.fake()
      wrapper = mount(Login, { ...common, methods: { finishExternal } })

      assert(finishExternal.calledOnce)
    })
  })

  describe('methods', () => {
    describe('finishExternal', () => {
      const exchangeToken = sinon.fake()
      const push = sinon.fake()
      beforeEach(() => {
        exchangeToken.resetHistory()
        push.resetHistory()
      })

      it('token.valid', () => {
        let token = `${(new Array(33)).join('a')}123`

        wrapper = mount(Login, { ...common, methods: { exchangeToken }, mocks: { ...mocks, $route: { query: { token } }, $router: { push } } })
        assert(exchangeToken.calledOnceWith(token))
        assert(push.notCalled)
      })

      it('token.invalid', () => {
        let token = `invalid`

        wrapper = mount(Login, { ...common, methods: { exchangeToken }, mocks: { ...mocks, $route: { query: { token } }, $router: { push } } })
        assert(exchangeToken.notCalled)
        assert(push.calledOnceWith({ name: 'login' }))
      })

      it('token.missing.authenticated', () => {
        wrapper = mount(Login, { ...common, methods: { exchangeToken }, mocks: { ...mocks, $auth: { is: isTrue }, $router: { push } } })
        assert(exchangeToken.notCalled)
        assert(push.calledOnceWith({ name: 'profile' }))
      })

      it('token.missing.anonymous', () => {
        wrapper = mount(Login, { ...common, methods: { exchangeToken }, mocks: { ...mocks, $router: { push } } })
        assert(exchangeToken.notCalled)
        assert(push.notCalled)
      })
    })

    describe('exchangeToken', () => {
      let token = 'token'
      const params = { jwt: 'jwt', user: 'user' }
      const systemResolve = sinon.stub().resolves(params)
      const systemReject = sinon.stub().rejects(new Error('reject'))
      const finalize = sinon.fake()

      afterEach(() => {
        finalize.resetHistory()
      })

      it('resolve', (done) => {
        wrapper = mount(Login, { ...common, methods: { finalize }, mocks: { ...mocks, $SystemAPI: { authExchangeAuthToken: systemResolve } } })
        wrapper.vm.exchangeToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.processing).to.eq(false)
          assert(finalize.calledOnceWith(params))
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(Login, { ...common, methods: { finalize }, mocks: { ...mocks, $SystemAPI: { authExchangeAuthToken: systemReject } } })
        wrapper.vm.exchangeToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.error).to.eq('reject')
          assert(finalize.notCalled)
          done()
        })
      })
    })

    describe('internalLogin', () => {
      const jwt = 'jwt'
      const user = 'user'
      let systemResolve
      let systemReject
      const finalize = sinon.fake()
      beforeEach(() => {
        finalize.resetHistory()
        systemResolve = sinon.stub().resolves({ jwt, user })
        systemReject = sinon.stub().rejects(new Error('reject'))
      })

      it('disabled', () => {
        wrapper = mount(Login, { ...common, propsData: { internalEnabled: false }, methods: { finalize }, mocks: { ...mocks, $SystemAPI: { authInternalLogin: systemResolve } } })
        wrapper.vm.internalLogin()
        assert(systemResolve.notCalled)
      })

      it('resolve', (done) => {
        wrapper = mount(Login, { ...common, methods: { finalize }, mocks: { ...mocks, $SystemAPI: { authInternalLogin: systemResolve } } })
        wrapper.vm.internalLogin()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.processing).to.eq(false)
          assert(finalize.calledOnceWith({ jwt, user }))
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(Login, { ...common, methods: { finalize }, mocks: { ...mocks, $SystemAPI: { authInternalLogin: systemReject } } })
        wrapper.vm.internalLogin()
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.error).to.eq('reject')
          assert(finalize.notCalled)
          done()
        })
      })
    })

    describe('finalize', () => {
      let afterLogin
      let params = { jwt: 'jwt', user: 'user', redirectTo: 'redirectTo' }

      beforeEach(() => {
        writeableWindowLocation({ path: '/' })
        afterLogin = sinon.fake()
      })

      it('afterLogin', () => {
        wrapper = mount(Login, { ...common, propsData: { afterLogin } })

        wrapper.vm.finalize(params)
        assert(afterLogin.calledOnce)
        expect(wrapper.vm.$auth.JWT).to.eq(params.jwt)
        expect(wrapper.vm.$auth.user).to.eq(params.user)
        expect(window.location).to.eq('/')
      })

      it('redirect', () => {
        wrapper = mount(Login, common)

        wrapper.vm.finalize(params)
        assert(afterLogin.notCalled)
        expect(wrapper.vm.$auth.JWT).to.eq(params.jwt)
        expect(wrapper.vm.$auth.user).to.eq(params.user)
        expect(window.location).to.eq(params.redirectTo)
      })
    })
  })
})
