# Vercel Deployment Configuration

## Branch Strategy

### Production Environment (master branch)
- **Branch**: `master`
- **Domain**: `levelpath-shoes-demo.vercel.app` (production)
- **Environment**: Production
- **Purpose**: Live demo for interviews and presentations

### Staging Environment (stage branch)
- **Branch**: `stage`
- **Domain**: `levelpath-shoes-demo-git-stage-macarey.vercel.app` (preview)
- **Environment**: Staging
- **Purpose**: Testing and development with real Twilio integration

## Environment Variables

### Production Environment Variables
```bash
# Twilio Configuration (Production)
TWILIO_ACCOUNT_SID=your_production_account_sid
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_AI_ASSISTANT_SID=your_production_assistant_sid
TWILIO_WEBHOOK_URL=https://levelpath-shoes-demo.vercel.app/api/webhooks/twilio

# Application Configuration
NEXT_PUBLIC_APP_URL=https://levelpath-shoes-demo.vercel.app
NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID=your_production_assistant_sid
NODE_ENV=production
```

### Staging Environment Variables
```bash
# Twilio Configuration (Staging)
TWILIO_ACCOUNT_SID=your_staging_account_sid
TWILIO_AUTH_TOKEN=your_staging_auth_token
TWILIO_AI_ASSISTANT_SID=your_staging_assistant_sid
TWILIO_WEBHOOK_URL=https://levelpath-shoes-demo-git-stage-macarey.vercel.app/api/webhooks/twilio

# Application Configuration
NEXT_PUBLIC_APP_URL=https://levelpath-shoes-demo-git-stage-macarey.vercel.app
NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID=your_staging_assistant_sid
NODE_ENV=staging
```

## Deployment Workflow

### 1. Development
- Work on `stage` branch
- Test features locally
- Push to `stage` branch for staging deployment

### 2. Staging Deployment
- Automatic deployment when pushing to `stage` branch
- Test Twilio integration with staging credentials
- Verify all tools and webhooks work

### 3. Production Deployment
- Merge `stage` → `master` when ready
- Automatic deployment to production domain
- Use production Twilio credentials

## Twilio Console Setup

### Staging AI Assistant
- **Name**: "Levelpath Shoes Support (Staging)"
- **Webhook URL**: `https://levelpath-shoes-demo-git-stage-macarey.vercel.app/api/webhooks/twilio`
- **Tools**: Configure with staging endpoints

### Production AI Assistant
- **Name**: "Levelpath Shoes Support (Production)"
- **Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/webhooks/twilio`
- **Tools**: Configure with production endpoints

## Tool Endpoints

### Staging
- Order Lookup: `https://levelpath-shoes-demo-git-stage-macarey.vercel.app/api/tools/order-lookup`
- Return Request: `https://levelpath-shoes-demo-git-stage-macarey.vercel.app/api/tools/return-request`
- Store Hours: `https://levelpath-shoes-demo-git-stage-macarey.vercel.app/api/tools/store-hours`

### Production
- Order Lookup: `https://levelpath-shoes-demo.vercel.app/api/tools/order-lookup`
- Return Request: `https://levelpath-shoes-demo.vercel.app/api/tools/return-request`
- Store Hours: `https://levelpath-shoes-demo.vercel.app/api/tools/store-hours`

## Testing Checklist

### Before Production Deployment
- [ ] Test all tools in staging environment
- [ ] Verify webhook endpoints are accessible
- [ ] Test AI Assistant integration
- [ ] Confirm environment variables are set
- [ ] Test both Basic AI and Twilio AI modes

### Production Readiness
- [ ] Production Twilio credentials configured
- [ ] Production AI Assistant created
- [ ] All tools configured in Twilio Console
- [ ] Webhook URLs updated to production
- [ ] Demo flow tested end-to-end
