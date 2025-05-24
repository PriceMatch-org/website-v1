
module.exports = {
  apps: [
    {
      name: 'dzdx-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1, // or 'max' for cluster mode
      exec_mode: 'fork', // or 'cluster' for load-balancing
      cwd: '/home/dzdx/website-v1',
      env: {
        NODE_ENV: 'production',
        PORT: 3000 // Change if needed
      }
    }
  ]
}
