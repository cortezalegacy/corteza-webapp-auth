import { expect, assert } from 'chai'
import { createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import ViewProfile from '@/views/ViewProfile'
import { mount } from '../../lib/helpers'

const localVue = createLocalVue()

describe('views/ViewProfile.vue', () => {
  const isFalse = sinon.stub().returns(false)
  const isTrue = sinon.stub().returns(true)

  const mocks = { $auth: { is: isFalse } }
  let common = { localVue, stubs: ['router-view', 'router-link'], mocks }
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  describe('computed', () => {
    describe('user', () => {
      it('$auth.user', () => {
        const user = { user: true }
        wrapper = mount(ViewProfile, { ...common, mocks: { $auth: { is: isTrue, user } } })
        expect(wrapper.vm.user).to.deep.eq(user)
      })

      it('default', () => {
        const user = {}
        wrapper = mount(ViewProfile, { ...common, mocks: { $auth: { is: isTrue } } })
        expect(wrapper.vm.user).to.deep.eq(user)
      })
    })
  })

  describe('beforeCreate', () => {
    let push = sinon.fake()
    beforeEach(() => {
      push.resetHistory()
    })

    it('push.login', () => {
      wrapper = mount(ViewProfile, { ...common, mocks: { ...mocks, $router: { push } } })
      assert(push.calledOnceWith({ name: 'login' }))
    })

    it('showProfile', () => {
      wrapper = mount(ViewProfile, { ...common, mocks: { $auth: { is: isTrue }, $router: { push } } })
      assert(push.notCalled)
    })
  })
})
