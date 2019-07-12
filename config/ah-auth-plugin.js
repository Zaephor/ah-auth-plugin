'use strict'

exports['default'] = {
  'ah-auth-plugin': (api) => {
    return {
      // domain: enable or disables domain-scoped authentication
      domain: true,
      // localAuth: enables or disables localized authentication
      localAuth: true
    }
  }
}

exports['test'] = {
  'ah-auth-plugin': (api) => {
    return {
      // domain: enable or disables domain-scoped authentication
      domain: true,
      // localAuth: enables or disables localized authentication
      localAuth: true
    }
  }
}
