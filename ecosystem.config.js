module.exports = {
  apps: [{
    name: 'work-website',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
}; 