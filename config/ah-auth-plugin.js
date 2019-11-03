'use strict'

exports.default = {
  'ah-auth-plugin': (api) => {
    return {
      // domain: domain-scoped authentication
      domain: {
        enabled: true
      },
      // localAuth: localized authentication
      localAuth: {
        register: true,
        login: true
      }
    }
  }
}

exports.test = {
  'ah-auth-plugin': (api) => {
    return {
      // domain: domain-scoped authentication
      domain: {
        enabled: true
      },
      // localAuth: localized authentication
      localAuth: {
        register: true,
        login: true
      }
    }
  }
}
