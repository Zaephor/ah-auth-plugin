// Compound Action with Shared Inputs//
const validator = require('validator')
const { Action, api } = require('actionhero')

exports.UserRegister = class UserRegister extends Action {
  constructor () {
    super()
    this.name = 'user:register'
    this.version = 1
    this.description = 'New user registration'
    this.tags = ['auth']
    this.inputs = {
      domain: {
        formatter: (param, connection, actionTemplate) => {
          return ('' + param).toLowerCase()
        },
        validator: (param, connection, actionTemplate) => {
        },
        required: false
      },
      email: {
        formatter: (param, connection, actionTemplate) => {
          return ('' + param).toLowerCase()
        },
        validator: (param, connection, actionTemplate) => {
          if (!validator.isEmail(param)) { throw new Error(`Email format is invalid.`) }
        },
        required: true
      },
      password: {
        validator: (param, connection, actionTemplate) => {
          if (param.length < 8) { throw new Error(`Password length too short.`) }
          if (param.length > 50) { throw new Error(`Password length too long.`) }
        },
        required: true
      }
    }
  }

  async run (data) {
    data.response.success = false
    let result
    try {
      result = await api.models.user.query().insert({
        domain: data.params.domain,
        email: data.params.email,
        password: data.params.password
      })
    } catch (e) {
      data.response.error = e // TODO: set better error language
    }
    if (result.uuid && validator.isUUID(result.uuid)) {
      data.response.success = true
    }
  }
}

exports.UserLogin = class UserLogin extends Action {
  constructor () {
    super()
    this.name = 'user:login'
    this.version = 1
    this.description = 'User login'
    this.tags = ['auth']
    this.inputs = {
      domain: {
        default: (param) => { return '' },
        formatter: (param, connection, actionTemplate) => {
          return ('' + param).toLowerCase()
        },
        validator: (param, connection, actionTemplate) => {
        },
        required: false
      },
      email: {
        formatter: (param, connection, actionTemplate) => {
          return ('' + param).toLowerCase()
        },
        validator: (param, connection, actionTemplate) => {
          if (!validator.isEmail(param)) { throw new Error(`Email format is invalid.`) }
        },
        required: true
      },
      password: {
        required: true
      }
    }
  }

  async run (data) {
    data.response.success = false
    let result
    try {
      result = await api.models.user.query().where({
        domain: data.params.domain,
        email: data.params.email
      }).limit(1).first()
      if (!result.email || result.email !== data.params.email || !validator.isUUID(result.uuid) || !(await result.verifyPassword(data.params.password))) {
        throw new Error('Credentials invalid.')
      } else {
        let userSession = await api.session.create(data.connection, result.uuid) // Create a new user session, middleware will load this globally as data.session
        data.response.session = userSession
        data.response.success = true
      }
    } catch (e) {
      data.response.error = e // TODO: set better error language
    }
  }
}
