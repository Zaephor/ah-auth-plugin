// Duplicated and derived from https://github.com/actionhero/actionhero-angular-bootstrap-cors-csrf/blob/master/initializers/session.js
'use strict'
const { Initializer, api } = require('actionhero')
const path = require('path')

module.exports = class sessionInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'ah-auth-plugin'
    this.loadPriority = 1002
    this.startPriority = 1002
    this.stopPriority = 1002
  }

  async initialize () {
    if (api.config && !api.config[this.name]) {
      api.config[this.name] = require(path.join(api.config.plugins[this.name].path, 'config', this.name + '.js'))[process.env.NODE_ENV || 'default'][this.name](api)
    }
    const config = api.config[this.name]

    api.log('[' + this.loadPriority + '] ' + this.name + ': Initializing')
    api.auth = {
      middleware: {
        'auth:inject': {
          name: 'auth:inject',
          global: true,
          priority: 1001,
          preProcessor: async (data) => {
            if (data.session && data.session.user) {
              data.auth = await api.models.user.query().where('uuid', data.session.user).limit(1).first()
            } else {
              data.auth = false
            }
          }
        },
        'auth:logged_in': {
          name: 'auth:logged_in',
          global: false,
          priority: 1002,
          preProcessor: async (data) => {
            if (!data.auth) {
              data.connection.setStatusCode(403)
              throw new Error('Not logged in.')
            }
          }
        }
      }
    }
    api.actions.addMiddleware(api.auth.middleware['auth:inject'])
    api.actions.addMiddleware(api.auth.middleware['auth:logged_in'])
    if (config.localAuth.register === true) {
      api.routes.registerRoute('post', '/user/register', 'user:register')
    }
    if (config.localAuth.login === true) {
      api.routes.registerRoute('post', '/user/login', 'user:login')
    }
  }
}
