const config = {
  global: {
    API_ROOT: "https://api.techbikers.com"
  },
  production: {
    AUTH0_CLIENT_ID: "CZuJ8UsHJfF4Xbz4gukAVXC8YlQ2knUC",
    AUTH0_DOMAIN: "techbikers.eu.auth0.com",
    SEGMENT_TRACKING_KEY: "URQvrM6okB7zRxfTdU6B7apD1Rrl7X5j",
    SENTRY_DSN: "https://eb262b12f8b64d2e895b13e4524e39dd@app.getsentry.com/77036",
    OAUTH_REDIRECT_URI: "https://techbikers.com/oauth/callback",
    JUSTGIVING_AUTH_URL: "https://identity.justgiving.com/connect/authorize",
    JUSTGIVING_CLIENT_ID: "7af4ae12"
  },
  development: {
    AUTH0_CLIENT_ID: "IbwUfAd0PX46jll5tDxmU6ARqnJ9HwUO",
    AUTH0_DOMAIN: "techbikers.eu.auth0.com",
    OAUTH_REDIRECT_URI: "http://localhost:3000/oauth/callback",
    JUSTGIVING_AUTH_URL: "https://identity.staging.justgiving.com/connect/authorize",
    JUSTGIVING_CLIENT_ID: "b1533b12"
  }
};

// Copy global and environment config into exports
Object.assign(module.exports, config.global, config[process.env.NODE_ENV]);

if (process.env.NODE_ENV === "development") {
  // Attempt to load and copy over the local config, if it exists...
  try {
    const localConfig = require("./local");
    Object.assign(module.exports, localConfig);
  } catch (e) {
    // That's fine - no local config exists...
  }
}
