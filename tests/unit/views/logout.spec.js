import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Logout from '@/views/Logout'
import { mount } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/Logout.vue', () => {
  let wrapper
  let common = { localVue, stubs: ['router-view', 'router-link'] }

  afterEach(() => {
    sinon.restore()
  })

  describe('created', () => {
    describe('logout', () => {
      let systemResolve, systemReject, $auth
      beforeEach(() => {
        systemResolve = sinon.stub().resolves({ message: 'resolve' })
        systemReject = sinon.stub().rejects(new Error('reject'))
        $auth = { JWT: 'JWT', user: 'user' }
      })

      it('resolve.afterLogout', (done) => {
        const afterLogout = sinon.fake()
        wrapper = mount(Logout, { ...common, propsData: { afterLogout }, mocks: { $auth, $SystemAPI: { authLogout: systemResolve } } })

        expect($auth.JWT).to.eq('JWT')
        expect($auth.user).to.eq('user')

        setTimeout(() => {
          expect($auth.JWT).to.eq(null)
          expect($auth.user).to.eq(null)
          assert(afterLogout.calledOnce)
          done()
        })
      })

      it('resolve.redirect', (done) => {
        const push = sinon.fake()
        wrapper = mount(Logout, { ...common, mocks: { $auth, $SystemAPI: { authLogout: systemResolve }, $router: { push } } })

        expect($auth.JWT).to.eq('JWT')
        expect($auth.user).to.eq('user')

        setTimeout(() => {
          expect($auth.JWT).to.eq(null)
          expect($auth.user).to.eq(null)
          assert(push.calledOnceWith({ name: 'login' }))
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(Logout, { ...common, mocks: { $auth, $SystemAPI: { authLogout: systemReject } } })

        expect($auth.JWT).to.eq('JWT')
        expect($auth.user).to.eq('user')

        setTimeout(() => {
          expect($auth.JWT).to.eq('JWT')
          expect($auth.user).to.eq('user')
          expect(wrapper.vm.error).to.eq('reject')
          done()
        })
      })
    })
  })
})
