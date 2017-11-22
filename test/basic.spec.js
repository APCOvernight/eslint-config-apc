const config = require('../')
const chai = require('chai')
const expect = chai.expect

describe('Test basic properties of config', () => {
  it('Config extends standard', () => {
    expect(config.extends).to.equal('standard')
  })

  it('Config has an env object', () => {
    expect(config.env).to.be.an('object')
  })

  it('Config has a globals object', () => {
    expect(config.globals).to.be.an('object')
  })

  it('Config has a rules object', () => {
    expect(config.rules).to.be.an('object')
  })
})
