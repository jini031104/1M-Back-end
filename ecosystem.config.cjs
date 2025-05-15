// ecosystem.config.js
export default {
  apps: [
    {
      name: "1m-backend",
      script: "src/index.js",
      env: { NODE_ENV: "production" },
    },
  ],
};
