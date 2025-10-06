# Twilio AI Assistant Integration Guide

## Overview
This guide explains how to set up and configure Twilio AI Assistants for the **Soles4Souls** demo.

## Prerequisites
1. Twilio Account with AI Assistants enabled
2. Twilio Account SID and Auth Token
3. AI Assistant SID (created in Twilio Console)

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_AI_ASSISTANT_SID=your_assistant_sid_here
TWILIO_WEBHOOK_URL=https://your-domain.com/api/webhooks/twilio

# Public Configuration (for client-side)
NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID=your_assistant_sid_here
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Twilio AI Assistant Configuration

### 1. Create AI Assistant in Twilio Console
1. Go to Twilio Console > AI Assistants
2. Click "Create Assistant"
3. Name: "Soles4Souls Support"
4. Description: "AI Assistant for Soles4Souls customer support and volunteer coordination"

### 2. Configure Tools

#### Donation Lookup Tool
```json
{
  "name": "donation_lookup",
  "description": "Look up donation status and details by donation ID",
  "parameters": {
    "type": "object",
    "properties": {
      "donation_id": {
        "type": "string",
        "description": "The donation ID to look up"
      }
    },
    "required": ["donation_id"]
  }
}
```

#### Volunteer Scheduler Tool
```json
{
  "name": "volunteer_scheduler",
  "description": "Schedule volunteer opportunities and shifts",
  "parameters": {
    "type": "object",
    "properties": {
      "opportunity_id": {
        "type": "string",
        "description": "The volunteer opportunity ID to schedule"
      },
      "volunteer_name": {
        "type": "string",
        "description": "Name of the volunteer"
      },
      "contact_info": {
        "type": "string",
        "description": "Contact information for the volunteer"
      }
    },
    "required": ["opportunity_id", "volunteer_name"]
  }
}
```

#### Impact Report Tool
```json
{
  "name": "impact_report",
  "description": "Retrieve recent impact stories and success metrics",
  "parameters": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Filter by program category: 4Relief, 4Opportunity, or 4EveryKid"
      },
      "location": {
        "type": "string",
        "description": "Filter by location"
      }
    },
    "required": []
  }
}
```

#### Drop-off Locations Tool
```json
{
  "name": "dropoff_locations",
  "description": "Get donation drop-off locations and hours",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City to search for drop-off locations"
      }
    },
    "required": []
  }
}
```

### 3. Configure Knowledge Base

#### FAQ Knowledge
- **Question**: "How can I donate shoes and clothing?"
- **Answer**: "You can donate shoes and clothing by visiting one of our drop-off locations, shipping items to our distribution center, or organizing a shoe drive. All donations help fight poverty and create opportunity worldwide."

- **Question**: "How do I track my donation?"
- **Answer**: "You can track your donation by providing your donation ID. I can look up the current status and show you the impact your donation has made."

- **Question**: "What volunteer opportunities are available?"
- **Answer**: "We have various volunteer opportunities including warehouse sorting, distribution events, and administrative support. I can help you find and schedule volunteer opportunities in your area."

- **Question**: "Where can I drop off donations?"
- **Answer**: "We have drop-off locations in many cities. I can help you find the nearest location and provide hours of operation."

- **Question**: "What programs does Soles4Souls support?"
- **Answer**: "Soles4Souls operates three main programs: 4Relief (emergency relief and disaster response), 4Opportunity (micro-enterprise and job creation), and 4EveryKid (children experiencing homelessness)."

### 4. Configure Webhooks

#### Assistant Webhook URL
- URL: `https://your-domain.com/api/webhooks/twilio`
- Events: `assistant.message`, `tool.execution`

## API Endpoints

### POST /api/twilio/conversation
Creates a new conversation with the AI Assistant.

**Request Body:**
```json
{
  "assistantSid": "your_assistant_sid"
}
```

**Response:**
```json
{
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "active"
}
```

### POST /api/webhooks/twilio
Handles Twilio webhook events for AI Assistant interactions.

**Request Body:**
```json
{
  "type": "assistant.message",
  "message": "Where is my order?",
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Testing the Integration

### 1. Test Donation Lookup
Send message: "Where is my donation DON-001?"
Expected: AI should look up the donation and provide status and impact information.

### 2. Test Volunteer Scheduling
Send message: "I want to volunteer for opportunity VOL-001"
Expected: AI should ask for volunteer details and guide through scheduling process.

### 3. Test Impact Stories
Send message: "Show me recent impact stories"
Expected: AI should provide recent success stories and program metrics.

### 4. Test Drop-off Locations
Send message: "Where can I drop off donations in Nashville?"
Expected: AI should provide drop-off locations, hours, and donation guidelines.

### 5. Test Escalation
Send message: "I want to speak to a human agent"
Expected: AI should acknowledge and initiate escalation process.

## Demo Mode Fallback

If Twilio credentials are not configured, the chat widget will automatically fall back to demo mode with simulated responses. This ensures the demo works even without a live Twilio connection.

## Troubleshooting

### Common Issues

1. **"Failed to initialize conversation"**
   - Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
   - Verify AI Assistant SID is correct

2. **"No active conversation"**
   - Ensure conversation is created before sending messages
   - Check conversation SID is properly stored

3. **Webhook not receiving events**
   - Verify webhook URL is accessible
   - Check webhook configuration in Twilio Console

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will log all Twilio API calls and responses to the console.

## Security Considerations

1. Never expose TWILIO_AUTH_TOKEN in client-side code
2. Use environment variables for all sensitive configuration
3. Implement proper error handling for failed API calls
4. Validate webhook signatures in production

## Production Deployment

1. Set up proper environment variables in Vercel
2. Configure webhook URLs to point to production domain
3. Enable webhook signature validation
4. Set up monitoring and logging for AI Assistant interactions
