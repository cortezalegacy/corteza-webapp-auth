/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import ViewProfile from 'corteza-webapp-auth/src/views/ViewProfile'
import { shallowMount } from 'corteza-webapp-auth/tests/lib/helpers'

describe('views/ViewProfile.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let $auth, propsData
  beforeEach(() => {
    $auth = { user: {} }
    propsData = {}
  })

  const mountVP = (opt) => shallowMount(ViewProfile, {
    mocks: { $auth },
    propsData,
    ...opt,
  })

  it('anonymous - redirect', () => {
    const gotoLoginFormIfAnonymous = sinon.fake()
    mountVP({ methods: { gotoLoginFormIfAnonymous } })

    sinon.assert.calledOnce(gotoLoginFormIfAnonymous)
  })
})
