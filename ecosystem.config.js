module.exports = {
  apps: [
    {
      name: 'dev-update-server',
      script: './dist/main.js',
      autostart: true,
      env_development: {
        API_PORT: 7070,
        API_HOST: '0.0.0.0',
      },
    },
  ],
};
