const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1600,
  viewportHeight: 1000,
  projectId: 'd2tg2b',
  retries: {
    runMode: 1,
    openMode: 1,
  },
  chromeWebSecurity: false,
  waitForAnimations: false,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl:
      'https://pa-prod-webapp-onboarding-binternacional-qa2fc5.azurewebsites.net',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
