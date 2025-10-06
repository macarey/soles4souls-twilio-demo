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

## Demo Customer Journeys

### 1️⃣ Donor Journey – "I want to donate shoes."

**Goal**: Show how the AI Assistant simplifies donations and reduces staff workload.

**Flow**:
1. User opens the chat widget and types, "I want to donate shoes."
2. Assistant thanks them and asks for their location or ZIP code.
3. Uses the `dropoff_locations` tool to find the nearest donation site.
4. Provides address, hours, and optional "Mail-in Donation" info.
5. Ends with a thank-you message and impact statement like:
   "Every pair you donate helps create jobs and fight poverty — thank you for making a difference!"

**Value**: Instant donor support, fewer missed donations, improved donor experience.

### 2️⃣ Volunteer Journey – "I want to help this weekend."

**Goal**: Demonstrate how AI automates volunteer scheduling and coordination.

**Flow**:
1. User says, "I'd like to volunteer."
2. Assistant asks which city or program (e.g., warehouse sorting, shoe drive).
3. Uses `volunteer_scheduler` tool to show available slots.
4. Confirms the shift and provides next steps or a contact link.
5. Ends with a warm, motivational line like:
   "Amazing! Volunteers like you make everything we do possible."

**Value**: Less manual coordination, better volunteer retention, real-time engagement.

### 3️⃣ Donor Impact Journey – "Where did my donation go?"

**Goal**: Show how Soles4Souls can provide transparency and emotional connection through Twilio AI Assistants.

**Flow**:
1. Donor says, "I donated last month — what happened to my shoes?"
2. Assistant looks up a donation ID or name using the `donation_lookup` or `impact_report` tool.
3. Returns a personalized impact summary like:
   "Your donation helped support micro-enterprise programs in Haiti, giving new life to gently used shoes."
4. Offers a follow-up call to action: "Would you like to read more stories from that program?"

**Value**: Increases donor satisfaction and retention through meaningful feedback loops.

### 4️⃣ Awareness Journey – "What programs do you have?"

**Goal**: Highlight the assistant's ability to educate and inspire.

**Flow**:
1. User asks, "What programs does Soles4Souls run?"
2. Assistant pulls from the knowledge base and summarizes:
   - **4Relief**: disaster recovery
   - **4Opportunity**: job creation  
   - **4EveryKid**: school shoe donations
   - **Circularity**: sustainability initiatives
3. Offers links or next steps for getting involved.

**Value**: Strengthens brand awareness and drives participation in new programs.

### ✅ Journey Value Arc:
- **Automation** (reduce workload)
- **Engagement** (increase participation)  
- **Transparency** (build trust)
- **Education** (expand awareness)

## Testing the Integration

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
