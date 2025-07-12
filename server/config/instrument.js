// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"



Sentry.init({
  dsn: "https://e89d1f9c99d17806a6c132e0876d79f8@o4509649631117312.ingest.us.sentry.io/4509649636163584",
  integrations:[

    Sentry.mongooseIntegration()
  ],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});