module.exports = {
  apps: [
    {
      name: 'fitcorn-api',
      script: 'dist/main.js',
      cwd: '/var/www/fitcorn/fitcorn-api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'fitcorn-web',
      script: 'dist/fitcorn-web/server/server.mjs',
      cwd: '/var/www/fitcorn/fitcorn-web',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
