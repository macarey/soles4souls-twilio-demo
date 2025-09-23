# Twilio AI Assistant Integration Guide

## Overview
This guide explains how to set up and configure Twilio AI Assistants for the Levelpath Shoes demo.

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
3. Name: "Levelpath Shoes Support"
4. Description: "AI Assistant for Levelpath Shoes customer support"

### 2. Configure Tools

#### Order Lookup Tool
```json
{
  "name": "order_lookup",
  "description": "Look up order status and details by order ID",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "The order ID to look up"
      }
    },
    "required": ["order_id"]
  }
}
```

#### Return Request Tool
```json
{
  "name": "return_request",
  "description": "Process return requests for orders",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "The order ID for the return"
      },
      "reason": {
        "type": "string",
        "description": "Reason for the return"
      }
    },
    "required": ["order_id", "reason"]
  }
}
```

#### Store Hours Tool
```json
{
  "name": "store_hours",
  "description": "Get current store hours and location information",
  "parameters": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

### 3. Configure Knowledge Base

#### FAQ Knowledge
- **Question**: "What are your store hours?"
- **Answer**: "Our store hours are Monday-Thursday: 9AM-8PM, Friday: 9AM-9PM, Saturday: 10AM-8PM, Sunday: 11AM-6PM. We're located at 789 Fashion Blvd, San Francisco, CA 94102."

- **Question**: "How do I track my order?"
- **Answer**: "You can track your order by providing your order ID. I can look up the current status and provide tracking information for you."

- **Question**: "What is your return policy?"
- **Answer**: "We offer a 30-day return policy for unworn items in original packaging. Returns are free and can be processed through our online system or in-store."

- **Question**: "Do you offer free shipping?"
- **Answer**: "Yes! We offer free shipping on orders over $100. Standard shipping is $9.99 for orders under $100."

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

### 1. Test Order Lookup
Send message: "Where is my order ORD-001?"
Expected: AI should look up the order and provide status information.

### 2. Test Return Processing
Send message: "I want to return my shoes"
Expected: AI should ask for order ID and guide through return process.

### 3. Test Store Hours
Send message: "What are your store hours?"
Expected: AI should provide store hours and location information.

### 4. Test Escalation
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
