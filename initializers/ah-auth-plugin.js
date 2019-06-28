// Duplicated and derived from https://github.com/actionhero/actionhero-angular-bootstrap-cors-csrf/blob/master/initializers/session.js
'use strict'
const { Initializer, api } = require('actionhero')
// const path = require('path')

// let config = ((api.config && api.config['ah-auth-plugin'])) ? api.config['ah-auth-plugin'] : require(path.join(__dirname, '..', 'config', 'ah-auth-plugin.js'))[process.env.NODE_ENV || 'development']['ah-auth-plugin'](api)

module.exports = class sessionInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'ah-auth-plugin'
    this.loadPriority = 1002
    this.startPriority = 1002
    this.stopPriority = 1002
  }

  async initialize () {
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
        }
      }
    }
    api.actions.addMiddleware(api.auth.middleware['auth:inject'])
    api.routes.registerRoute('post', '/user/register', 'user:register')
    api.routes.registerRoute('post', '/user/login', 'user:login')
  }
}
