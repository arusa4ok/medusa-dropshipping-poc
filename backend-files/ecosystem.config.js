module.exports = {
  apps: [
    {
      name: 'medusa-backend',
      script: 'node_modules/.bin/medusa',
      args: 'develop',
      cwd: '/var/www/medusa-store',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
      },
    },
  ],
};
