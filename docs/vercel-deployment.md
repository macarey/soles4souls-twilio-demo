# Vercel Deployment Configuration

## Branch Strategy

### Production Environment (master branch)
- **Branch**: `master`
- **Domain**: `soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app` (production)
- **Environment**: Production
- **Purpose**: Live demo for interviews and presentations

### Staging Environment (stage branch)
- **Branch**: `stage`
- **Domain**: `soles4souls-demo-git-stage-macarey.vercel.app` (preview)
- **Environment**: Staging
- **Purpose**: Testing and development with real Twilio integration

## Environment Variables

### Production Environment Variables
```bash
# Twilio Configuration (Production)
TWILIO_ACCOUNT_SID=your_production_account_sid
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_AI_ASSISTANT_SID=your_production_assistant_sid
TWILIO_WEBHOOK_URL=https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/webhooks/twilio

# Application Configuration
NEXT_PUBLIC_APP_URL=https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app
NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID=your_production_assistant_sid
NODE_ENV=production
```

### Staging Environment Variables
```bash
# Twilio Configuration (Staging)
TWILIO_ACCOUNT_SID=your_staging_account_sid
TWILIO_AUTH_TOKEN=your_staging_auth_token
TWILIO_AI_ASSISTANT_SID=your_staging_assistant_sid
TWILIO_WEBHOOK_URL=https://soles4souls-demo-git-stage-macarey.vercel.app/api/webhooks/twilio

# Application Configuration
NEXT_PUBLIC_APP_URL=https://soles4souls-demo-git-stage-macarey.vercel.app
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
- **Name**: "Soles4Souls Support (Staging)"
- **Webhook URL**: `https://soles4souls-demo-git-stage-macarey.vercel.app/api/webhooks/twilio`
- **Tools**: Configure with staging endpoints

### Production AI Assistant
- **Name**: "Soles4Souls Support (Production)"
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/webhooks/twilio`
- **Tools**: Configure with production endpoints

## Tool Endpoints

### Staging
- Donation Lookup: `https://soles4souls-demo-git-stage-macarey.vercel.app/api/tools/donation-lookup`
- Volunteer Scheduler: `https://soles4souls-demo-git-stage-macarey.vercel.app/api/tools/volunteer-scheduler`
- Impact Report: `https://soles4souls-demo-git-stage-macarey.vercel.app/api/tools/impact-report`
- Drop-off Locations: `https://soles4souls-demo-git-stage-macarey.vercel.app/api/tools/dropoff-locations`

### Production
- Donation Lookup: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/donation-lookup`
- Volunteer Scheduler: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/volunteer-scheduler`
- Impact Report: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/impact-report`
- Drop-off Locations: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/dropoff-locations`

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
