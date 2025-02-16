module.exports = {
  apps : [{
    name   : "Backend_Gocnhinkhacbiet",
    script : "./dist/src/main.js",
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
  }]
}
