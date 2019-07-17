/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import Logout from 'corteza-webapp-auth/src/views/Logout'
import { shallowMount, stdReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('views/Logout.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $auth, $router, propsData
  beforeEach(() => {
    $auth = { logout: sinon.stub().resolves() }
    $router = { push: sinon.fake() }
    propsData = { afterLogout: sinon.fake() }
  })

  const mountLogout = (opt) => shallowMount(Logout, {
    mocks: { $auth, $router },
    ...opt,
  })

  it('$SystemAPI not provided - prevent logout', () => {
    mountLogout({ mocks: { $SystemAPI: undefined } })

    sinon.assert.notCalled($auth.logout)
  })

  it('on success - redirect', async () => {
    mountLogout()

    await fp()
    sinon.assert.calledOnce($auth.logout)
    sinon.assert.calledOnce($router.push)
    sinon.assert.calledWith($router.push, { name: 'auth:login' })
  })

  it('on success - callback', async () => {
    mountLogout({ propsData })

    await fp()
    sinon.assert.calledOnce($auth.logout)
    sinon.assert.calledOnce(propsData.afterLogout)
  })

  it('on error - notify user', async () => {
    const $auth = { logout: stdReject() }
    const wrap = mountLogout({ mocks: { $auth } })

    await fp()
    sinon.assert.calledOnce($auth.logout)
    expect(wrap.vm.error).to.not.be.undefined
  })
})
