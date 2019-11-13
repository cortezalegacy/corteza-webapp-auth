/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import errors from 'corteza-webapp-auth/src/mixins/errors'
import sinon from 'sinon'

describe('mixins/errors.js', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $router, local
  beforeEach(() => {
    $router = { push: sinon.fake() }
    local = {
      $router,
      $auth: { check: sinon.stub().resolves({ name: 'username' }) },
      $t: e => e,
    }
  })

  it('parseError', () => {
    const tests = [
      {
        name: 'no need for parsing',
        error: 'Error Here',
        expected: 'Error Here',
      },
      {
        name: 'parse',
        error: 'Error: system.provider.error.code',
        expected: 'system.provider.error.code',
      },
      {
        name: 'no input',
        error: '',
        expected: '',
      },
    ]

    for (const t of tests) {
      const f = errors.methods.parseError.bind(local)
      expect(f(t.error), t.name).to.eq(t.expected)
    }
  })
})
