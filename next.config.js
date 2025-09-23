/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_AI_ASSISTANT_SID: process.env.TWILIO_AI_ASSISTANT_SID,
    TWILIO_WEBHOOK_URL: process.env.TWILIO_WEBHOOK_URL,
  },
}

module.exports = nextConfig
