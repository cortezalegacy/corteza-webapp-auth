import { expect, assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import ConfirmEmail from '@/views/ConfirmEmail'
import { writeableWindowLocation } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/ConfirmEmail.vue', () => {
  let wrapper

  const t = { $t: (e) => e }
  const mocks = {
    ...t,
    $route: { query: {} },
    $auth: { user: {}, is: () => true },
  }

  const common = {
    localVue,
    stubs: ['router-view', 'router-link'],
    propsData: { internalEnabled: true },
    mocks,
  }
  const mount = (props = {}) => shallowMount(ConfirmEmail, { ...common, ...props })

  afterEach(() => {
    sinon.restore()
  })

  describe('created', () => {
    let token
    it('token.valid', () => {
      token = `${new Array(33).join('a')}123`
      const confirmToken = sinon.fake()
      wrapper = mount({ mocks: { ...mocks, $route: { query: { token } } }, methods: { confirmToken } })

      assert(confirmToken.calledOnceWith(token))
      expect(wrapper.vm.error).to.eq(null)
    })

    it('token.invalid', () => {
      // missing
      token = undefined
      const confirmToken = sinon.fake()
      wrapper = mount({ mocks: { ...t, $route: { query: { token } } }, methods: { confirmToken } })

      expect(confirmToken.calledOnce).to.eq(false)
      expect(wrapper.vm.error).to.not.eq(null)

      // invalid
      token = 'token'
      confirmToken.resetHistory()
      wrapper = mount({ mocks: { ...t, $route: { query: { token } } }, methods: { confirmToken } })

      expect(confirmToken.calledOnce).to.eq(false)
      expect(wrapper.vm.error).to.not.eq(null)
    })
  })

  describe('methods', () => {
    describe('confirmToken', () => {
      const token = 'token'
      const systemResolve = sinon.stub().resolves({ jwt: 'jwt', user: 'user' })
      const systemReject = sinon.stub().rejects(new Error('reject'))
      let afterConfirmEmail
      beforeEach(() => {
        writeableWindowLocation({ path: '/' })
        afterConfirmEmail = sinon.fake()
        systemResolve.resetHistory()
        systemReject.resetHistory()
      })

      it('resolve.afterConfirmEmail', (done) => {
        const $auth = { user: {}, is: () => true }
        wrapper = mount({ props: { afterConfirmEmail }, mocks: { ...mocks, $route: { query: {} }, $auth, $SystemAPI: { authInternalConfirmEmail: systemResolve } } })

        wrapper.vm.confirmToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect($auth.JWT).to.eq('jwt')
          expect($auth.user).to.eq('user')
          expect(wrapper.vm.error).to.eq(null)
          expect(window.location).to.eq('/')
          assert(systemResolve.calledOnce)
          done()
        })
      })
      it('resolve.redirect', (done) => {
        const $auth = { user: {}, is: () => true }
        const afterConfirm = sinon.fake()
        wrapper = mount({ mocks: { ...mocks, $route: { query: {} }, $auth, $SystemAPI: { authInternalConfirmEmail: systemResolve } }, methods: { afterConfirm } })

        wrapper.vm.confirmToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect($auth.JWT).to.eq('jwt')
          expect($auth.user).to.eq('user')
          expect(wrapper.vm.error).to.eq(null)
          assert(systemResolve.calledOnce)
          assert(afterConfirm.calledOnce)
          done()
        })
      })

      it('reject', (done) => {
        const $auth = { user: undefined, is: () => true }
        wrapper = mount({ mocks: { ...mocks, $route: { query: {} }, $auth, $SystemAPI: { authInternalConfirmEmail: systemReject } } })

        wrapper.vm.confirmToken(token)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)

        setTimeout(() => {
          expect($auth.JWT).to.eq(undefined)
          expect($auth.user).to.eq(undefined)
          expect(window.location).to.eq('/')
          expect(wrapper.vm.error).to.eq('reject')
          assert(systemReject.calledOnce)
          done()
        })
      })
    })
  })
})
