// Compound Action with Shared Inputs//
const { Action } = require('actionhero')

exports.UserRegister = class UserRegister extends Action {
  constructor () {
    super()
    this.name = 'user:register'
    this.description = 'New user registration'
    this.inputs = {
      email: { required: true },
      password: { required: true },
      password_confirm: { required: true }
    }
  }

  async run (data) {
    // TODO
  }
}

exports.UserLogin = class UserLogin extends Action {
  constructor () {
    super()
    this.name = 'user:login'
    this.description = 'User login'
    this.inputs = {
      email: { required: true },
      password: { required: true }
    }
  }

  async run (data) {
    // TODO
  }
}
