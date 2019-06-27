import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import RequestPasswordReset from '@/views/RequestPasswordReset'
import { mount } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/RequestPasswordReset.vue', () => {
  let isFalse = sinon.stub().returns(false)
  let isTrue = sinon.stub().returns(true)
  const mocks = {
    $auth: { is: isFalse },
    $t: (e) => e,
  }
  let common = {
    localVue,
    stubs: ['router-view', 'router-link'],
    propsData: { internalPasswordResetEnabled: true },
    mocks,
  }
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('disabledSubmit', () => {
      wrapper = mount(RequestPasswordReset, common)

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
      wrapper = mount(RequestPasswordReset, { ...common, mocks: { ...mocks, $auth: { is: isTrue }, $router: { push } } })
      assert(push.calledOnceWith({ name: 'auth:profile' }))
    })

    it('push.profile.internalDisabled', () => {
      wrapper = mount(RequestPasswordReset, { ...common, propsData: { internalPasswordResetEnabled: false }, mocks: { ...mocks, $auth: { is: isTrue }, $router: { push } } })
      assert(push.calledOnceWith({ name: 'auth:profile' }))
    })

    it('push.login', () => {
      wrapper = mount(RequestPasswordReset, { ...common, propsData: { internalPasswordResetEnabled: false }, mocks: { ...mocks, $auth: { is: isFalse }, $router: { push } } })
      assert(push.calledOnceWith({ name: 'auth:login' }))
    })

    it('allowReset', () => {
      wrapper = mount(RequestPasswordReset, { ...common, mocks: { ...mocks, $auth: { is: isFalse }, $router: { push } } })
      assert(push.notCalled)
    })
  })

  describe('methods', () => {
    const systemResolve = sinon.stub().resolves({ message: 'resolve' })
    const systemReject = sinon.stub().rejects(new Error('reject'))

    describe('requestPasswordReset', () => {
      it('resolve', (done) => {
        wrapper = mount(RequestPasswordReset, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalRequestPasswordReset: systemResolve } } })
        wrapper.vm.requestPasswordReset()

        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.done).to.eq(false)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.done).to.eq(true)
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount(RequestPasswordReset, { ...common, mocks: { ...mocks, $SystemAPI: { authInternalRequestPasswordReset: systemReject } } })
        wrapper.vm.requestPasswordReset()

        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.done).to.eq(false)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq('reject')
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.done).to.eq(false)
          done()
        })
      })
    })
  })
})
