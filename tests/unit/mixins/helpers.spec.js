/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import helpers from 'corteza-webapp-auth/src/mixins/helpers'
import { stdReject } from 'corteza-webapp-auth/tests/lib/helpers'
import fp from 'flush-promises'

describe('mixins/helpers.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $router, local
  beforeEach(() => {
    $router = { push: sinon.fake() }
    local = {
      $router,
      $auth: { check: sinon.stub().resolves({ name: 'username' }) },
    }
  })

  describe('gotoProfileIfAuthenticated', () => {
    it('on resolve and user valid - redirect to profile', async () => {
      helpers.methods.gotoProfileIfAuthenticated.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.calledOnce($router.push)
    })

    it('on resolve and user not valid - do nothing', async () => {
      local.$auth.check = sinon.stub().resolves()
      helpers.methods.gotoProfileIfAuthenticated.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.notCalled($router.push)
    })

    it('on error - do nothing', async () => {
      local.$auth.check = stdReject()
      helpers.methods.gotoProfileIfAuthenticated.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.notCalled($router.push)
    })
  })

  describe('gotoLoginFormIfAnonymous', () => {
    it('on resolve and user not valid - redirect to login', async () => {
      local.$auth.check = sinon.stub().resolves()
      helpers.methods.gotoLoginFormIfAnonymous.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.calledOnce($router.push)
    })

    it('on error - do nothing', async () => {
      local.$auth.check = stdReject()
      helpers.methods.gotoLoginFormIfAnonymous.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.notCalled($router.push)
    })

    it('on resolve and user valid - do nothing', async () => {
      helpers.methods.gotoLoginFormIfAnonymous.call(local)

      await fp()
      sinon.assert.calledOnce(local.$auth.check)
      sinon.assert.notCalled($router.push)
    })
  })
})
