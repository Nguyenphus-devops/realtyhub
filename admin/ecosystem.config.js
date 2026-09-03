module.exports = {
  apps: [
    {
      name: "xgym-admin",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 5011
      }
    }
  ]
}