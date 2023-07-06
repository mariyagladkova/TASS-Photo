const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  //fullyParallel: true,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: false,
    viewport: null,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ["--start-maximized"]},
  },
 //projects: [
  //  {
  //    name: 'chromium',
  //    use: { 
  //      ...devices['Desktop Chrome'],
  //      headless: false,
  //      ignoreHTTPSErrors: true,
  //      launchOptions: {
  //      args: ["--start-maximized"]}, 
  //    },
  //  },
  //  {
  //    name: 'webkit',
  //    use: { ...devices['Desktop Safari'],
  //    headless: false,
  //    ignoreHTTPSErrors: true,
  //    launchOptions: {
  //    args: ["--start-maximized"]},
  //  },
  //   },
  //],
});
