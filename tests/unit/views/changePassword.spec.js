import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import ChangePassword from '@/views/ChangePassword'

const localVue = createLocalVue()

describe('views/ChangePassword.vue', () => {
  let wrapper
  const common = {
    localVue,
    stubs: ['router-view', 'router-link'],
    propsData: { internalEnabled: true },
    mocks: { $auth: { user: {}, is: () => true } },
  }
  const mount = (props = {}) => shallowMount(ChangePassword, { ...common, ...props })

  beforeEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('passwordCheckMatch', () => {
      wrapper = mount()
      expect(wrapper.vm.passwordCheckMatch).to.eq(true)

      wrapper.vm.form.newPassword = 'new'
      expect(wrapper.vm.passwordCheckMatch).to.eq(false)

      wrapper.vm.form.newPasswordCheck = 'new'
      expect(wrapper.vm.passwordCheckMatch).to.eq(true)
    })

    it('disabledSubmit', () => {
      wrapper = mount()
      expect(wrapper.vm.disabledSubmit).to.eq(false)

      wrapper.vm.processing = true
      expect(wrapper.vm.disabledSubmit).to.eq(true)

      wrapper.vm.processing = false
      wrapper.vm.form.newPassword = 'new'
      expect(wrapper.vm.disabledSubmit).to.eq(true)

      wrapper.vm.form.newPasswordCheck = 'new'
      expect(wrapper.vm.disabledSubmit).to.eq(false)

      wrapper.vm.processing = true
      expect(wrapper.vm.disabledSubmit).to.eq(true)
    })

    it('user', () => {
      const user = { user: true }
      wrapper = mount({ mocks: { $auth: { user, is: () => true } } })
      expect(wrapper.vm.user).to.deep.eq(user)
    })
  })

  describe('created', () => {
    it('pushLogin', () => {
      // internal disabled
      let push = sinon.fake()
      wrapper = mount({
        mocks: { $auth: { user: {}, is: () => true }, $router: { push } },
        propsData: { internalEnabled: false },
      })

      expect(push.calledOnceWith({ name: 'login' }))

      // user not authenticated
      push = sinon.fake()
      wrapper = mount({
        mocks: { $auth: { user: {}, is: () => false }, $router: { push } },
        propsData: { internalEnabled: true },
      })

      expect(push.calledOnceWith({ name: 'login' }))
    })
  })

  describe('methods', () => {
    describe('changePassword', () => {
      const systemResolve = sinon.stub().resolves({ message: 'resolve' })
      const systemReject = sinon.stub().rejects(new Error('reject'))
      const form = { oldPassword: 'old', newPassword: 'new', newPasswordCheck: 'new' }

      it('resolve', (done) => {
        wrapper = mount({ mocks: { $auth: { user: {}, is: () => true }, $system: { authInternalChangePassword: systemResolve } }, data: () => ({ form }) })

        wrapper.vm.changePassword(wrapper.vm.form)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.passwordChanged).to.eq(false)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.passwordChanged).to.eq(true)
          done()
        })
      })

      it('reject', (done) => {
        wrapper = mount({ mocks: { $auth: { user: {}, is: () => true }, $system: { authInternalChangePassword: systemReject } }, data: () => ({ form }) })

        wrapper.vm.changePassword(wrapper.vm.form)
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.passwordChanged).to.eq(false)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq('reject')
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.passwordChanged).to.eq(false)
          done()
        })
      })
    })
  })
})
