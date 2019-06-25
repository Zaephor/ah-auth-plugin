const uuidv4 = require('uuid/v4')
const Password = require('objection-password')()

module.exports = function (Model) {
  return class User extends Password(Model) {
    static get tableName () {
      return 'user'
    }

    static get jsonSchema () {
      return {
        type: 'object',
        required: ['email'],

        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          domain: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
          email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
          password: { type: 'string', minLength: 1, maxLength: 255 }
        }
      }
    }

    async $beforeInsert (queryContext) {
      await super.$beforeInsert(queryContext)
      if (this.uuid === undefined) {
        this.uuid = uuidv4()
      }
    }
  }
}
