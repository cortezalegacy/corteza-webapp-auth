import { expect, assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import Index from '@/views/Index'

const localVue = createLocalVue()

describe('views/Index.vue', () => {
  let wrapper
  const common = { localVue, stubs: ['router-view', 'router-link'], mocks: { $route: {} } }
  const mount = (props = {}) => shallowMount(Index, { ...common, ...props })

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    it('t', () => {
      wrapper = mount({ methods: { loadSettings: () => undefined } })

      // known key
      expect(wrapper.vm.t('dialog.login.title')).to.not.have.length(0)
      expect(wrapper.vm.t('dialog.login.title')).to.not.eq('dialog.login.title')

      // unknown key
      expect(wrapper.vm.t('unknown')).to.not.have.length(0)
      expect(wrapper.vm.t('unknown')).to.eq('unknown')
    })
  })

  describe('created', () => {
    it('loadsSettings', () => {
      const loadSettings = sinon.fake()
      wrapper = mount({ methods: { loadSettings } })
      assert(loadSettings.calledOnce)
    })
  })

  describe('methods', () => {
    // Called by created, so no invocations below
    describe('loadSettings', () => {
      it('resolve.settings', (done) => {
        const settings = { internalEnabled: true, externalEnabled: false }
        const unknown = { unknown: true }
        const systemResolve = sinon.mock().resolves({ ...settings, ...unknown })
        wrapper = mount({ mocks: { $route: {}, $SystemAPI: { authSettings: systemResolve } } })

        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        setTimeout(() => {
          expect(wrapper.vm.error).to.eq(null)
          expect(wrapper.vm.processing).to.eq(false)
          for (let k in settings) {
            expect(wrapper.vm.settings[k]).to.eq(settings[k])
          }
          for (let k in unknown) {
            expect(wrapper.vm.settings[k]).to.eq(undefined)
          }
          done()
        })
      })
      it('resolve.externalProviders', (done) => {
        const settings = { externalProviders: [{ label: 'b' }, { label: 'a' }] }
        const systemResolve = sinon.mock().resolves({ ...settings })
        wrapper = mount({ mocks: { $route: {}, $SystemAPI: { authSettings: systemResolve } } })

        expect(wrapper.vm.settings.externalProviders).to.have.length(0)
        setTimeout(() => {
          expect(wrapper.vm.settings.externalProviders).to.have.length(2)
          const [a, b] = wrapper.vm.settings.externalProviders
          expect(a.label).to.eq('a')
          expect(b.label).to.eq('b')
          done()
        })
      })
      it('reject.error.general', (done) => {
        const systemReject = sinon.mock().rejects(new Error('reject'))
        wrapper = mount({ mocks: { $route: {}, $SystemAPI: { authSettings: systemReject }, $auth: { JWT: 'jwt', user: 'user' } } })
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.$auth.JWT).to.not.eq(null)
        expect(wrapper.vm.$auth.user).to.not.eq(null)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq('reject')
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.$auth.JWT).to.eq(null)
          expect(wrapper.vm.$auth.user).to.eq(null)
          done()
        })
      })
      it('reject.error.network', (done) => {
        const systemReject = sinon.mock().rejects(new Error('Network Error'))
        wrapper = mount({ mocks: { $route: {}, $SystemAPI: { authSettings: systemReject }, $auth: { JWT: 'jwt', user: 'user' } } })
        expect(wrapper.vm.error).to.eq(null)
        expect(wrapper.vm.processing).to.eq(true)
        expect(wrapper.vm.$auth.JWT).to.not.eq(null)
        expect(wrapper.vm.$auth.user).to.not.eq(null)

        setTimeout(() => {
          expect(wrapper.vm.error).to.eq('Network Error')
          expect(wrapper.vm.processing).to.eq(false)
          expect(wrapper.vm.$auth.JWT).to.eq('jwt')
          expect(wrapper.vm.$auth.user).to.eq('user')
          done()
        })
      })
    })
  })
})
