import { expect, assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import ExternalProvider from '@/components/ExternalProvider'
import { writeableWindowLocation } from '../../lib/helpers'

const localVue = createLocalVue()
describe('components/ExternalProvider.vue', () => {
  let wrapper
  const common = { localVue, propsData: { pKind: 'externalProvider', pUrl: 'pUrl' } }

  beforeEach(() => {
    writeableWindowLocation({ path: '/' })
  })

  describe('computed', () => {
    beforeEach(() => {
      wrapper = shallowMount(ExternalProvider, {
        ...common,
        mocks: {
          $SystemAPI: {
            baseURL: 'baseURL/',
            authSettingsEndpoint: () => 'authSettingsEndpoint/',
          },
        },
      })
    })

    it('iconClass', () => {
      let expected = 'icon-externalProvider'
      expect(wrapper.vm.iconClass).to.eq(expected)

      wrapper.setProps({ pIcon: 'icon' })
      expected = 'icon-icon'
      expect(wrapper.vm.iconClass).to.eq(expected)
    })

    it('authUrl', () => {
      let expected = 'pUrl'
      expect(wrapper.vm.authUrl).to.eq(expected)

      wrapper.setProps({ pUrl: undefined })
      expected = 'baseURL/authSettingsEndpoint/external/externalProvider'
      expect(wrapper.vm.authUrl).to.eq(expected)
    })
  })

  describe('methods', () => {
    const onExternalAuth = sinon.fake()
    beforeEach(() => {
      wrapper = shallowMount(ExternalProvider, {
        ...common,
      })
    })

    describe('redirect', () => {
      it('onExternalAuth', () => {
        wrapper.setProps({ onExternalAuth })
        wrapper.vm.redirect()
        assert(onExternalAuth.calledOnceWith('pUrl'))
      })

      it('onRedirect', () => {
        wrapper.vm.redirect()
        expect(window.location).to.eq('pUrl')
      })
    })
  })
})
