/* eslint-env node, mocha */
const fs = require('fs')
const path = require('path')
const {expect} = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')
let knexConfig = require(path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..', 'config', 'ah-knex-plugin.js'))
let knexEnv = (process.env.NODE_ENV && knexConfig[process.env.NODE_ENV]) ? process.env.NODE_ENV : 'default'
let api

describe('ah-auth-plugin', () => {
  let configChanges = {
    'ah-knex-plugin': knexConfig[knexEnv]['ah-knex-plugin'](ActionHero.api),
    // 'ah-objection-plugin': config[environment]['ah-objection-plugin'](ActionHero.api),
    plugins: {
      'ah-knex-plugin': {path: path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..')},
      'ah-objection-plugin': {path: path.join(require.resolve('@zaephor-ah/ah-objection-plugin'), '..')},
      'ah-auth-plugin': {path: path.join(__dirname, '..')}
    }
  }

  before(async () => {
    api = await actionhero.start({configChanges})
  })

  after(async () => {
    await actionhero.stop()
    if (fs.existsSync(configChanges['ah-knex-plugin'].connection.filename)) { fs.unlinkSync(configChanges['ah-knex-plugin'].connection.filename) }
  })

  // Generic actionhero started check
  it('ActionHero server launches', () => {
    expect(api.running).to.equal(true)
  })

  // Generic module loaded check
  Array('knex', 'objection', 'models').forEach(function (attribute) {
    it(attribute + ' should be in api scope', async () => {
      expect(api[attribute]).to.exist
    })
  })

  it('should validate the user migrations were loaded/run')
  it('should validate the user model was loaded')

  // Create and retrieve user check directly from model
  let dummyUser = {email: 'test@domain.com', password: 'password123'}
  it('create user entry', async () => {
    let newUserObject = await api.models.user.query().insert(dummyUser)
    expect(newUserObject.email).to.equal(dummyUser.email)
    expect(await newUserObject.verifyPassword(dummyUser.password)).to.equal(true)
    expect(newUserObject.uuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    dummyUser.uuid = newUserObject.uuid
  })
  it('obtain user entry', async () => {
    let userObject = await api.models.user.query().where('email', dummyUser.email).limit(1).first()
    expect(userObject.email).to.equal(dummyUser.email)
    expect(await userObject.verifyPassword(dummyUser.password)).to.equal(true)
    expect(userObject.uuid).to.equal(dummyUser.uuid)
  })
})
