# Twilio AI Assistant Tools Setup Guide

## Overview
This guide explains how to configure the Tools in Twilio AI Assistant Console for the **Soles4Souls** demo.

## Tool Architecture

### How Tools Work:
1. **Tool Definition** - Defined in Twilio Console with parameters
2. **Tool Execution** - AI calls your webhook when tool is needed
3. **Data Processing** - Your API processes the request and returns data
4. **AI Response** - AI uses the data to respond to customer

### Current Tool Endpoints:
- **Donation Lookup**: `/api/tools/donation-lookup`
- **Volunteer Scheduler**: `/api/tools/volunteer-scheduler`  
- **Impact Report**: `/api/tools/impact-report`
- **Drop-off Locations**: `/api/tools/dropoff-locations`
- **Gift Card**: `/api/tools/gift-card`

## Tool Configuration in Twilio Console

### 1. Donation Lookup Tool

**Tool Name**: `donation_lookup`

**Description**: Look up donation status and details by donation ID

**Input Schema** (TypeScript format):
```typescript
export type Data = { 
  donation_id: string 
}
```

**Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/donation-lookup`

**Example Usage**:
- Customer: "Where is my donation DON-001?"
- AI calls tool with: `{"donation_id": "DON-001"}`
- Returns donation status, impact metrics, distribution details

### 2. Volunteer Scheduler Tool

**Tool Name**: `volunteer_scheduler`

**Description**: Schedule volunteer opportunities and shifts

**Input Schema** (TypeScript format):
```typescript
export type Data = { 
  opportunity_id: string,
  volunteer_name: string,
  contact_info?: string 
}
```

**Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/volunteer-scheduler`

**Example Usage**:
- Customer: "I want to volunteer for opportunity VOL-001"
- AI calls tool with: `{"opportunity_id": "VOL-001", "volunteer_name": "John Smith"}`
- Returns confirmation details, next steps, contact info

### 3. Impact Report Tool

**Tool Name**: `impact_report`

**Description**: Retrieve recent impact stories and success metrics

**Input Schema** (TypeScript format):
```typescript
export type Data = {
  category?: string,
  location?: string
}
```

**Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/impact-report`

**Example Usage**:
- Customer: "Show me recent impact stories"
- AI calls tool with: `{}`
- Returns impact stories, program breakdown, global stats

### 4. Drop-off Locations Tool

**Tool Name**: `dropoff_locations`

**Description**: Get donation drop-off locations and hours

**Input Schema** (TypeScript format):
```typescript
export type Data = {
  city?: string
}
```

**Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/dropoff-locations`

**Example Usage**:
- Customer: "Where can I drop off donations in Nashville?"
- AI calls tool with: `{"city": "Nashville"}`
- Returns locations, hours, donation guidelines

### 5. Gift Card Tool

**Tool Name**: `gift_card`

**Description**: Check gift card balance, purchase new gift cards, or redeem gift cards

**Input Schema** (TypeScript format):
```typescript
export type Data = { 
  action: "check_balance" | "purchase" | "redeem",
  cardNumber?: string,
  amount?: number,
  recipientEmail?: string,
  purchaserEmail?: string
}
```

**Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/gift-card`

**Example Usage**:
- Customer: "What's the balance on my gift card GC-1234-5678-9012?"
- AI calls tool with: `{"action": "check_balance", "cardNumber": "GC-1234-5678-9012"}`
- Returns balance, expiry date, status

- Customer: "I want to buy a $50 gift card for my friend"
- AI calls tool with: `{"action": "purchase", "amount": 50, "recipientEmail": "friend@email.com"}`
- Returns new gift card details and delivery info

- Customer: "I want to redeem $25 from my gift card"
- AI calls tool with: `{"action": "redeem", "cardNumber": "GC-1234-5678-9012", "amount": 25}`
- Returns redemption confirmation and remaining balance

## Data Sources

### Current Mock Data Location:
- **File**: `/src/lib/data.ts`
- **Donations**: `mockOrders` array (used for donation lookup)
- **Volunteer Opportunities**: `mockVolunteerOpportunities` array
- **Impact Stories**: `mockImpactStories` array
- **Drop-off Locations**: `mockDropOffLocations` array

### Sample Donation Data:
```typescript
{
  id: 'DON-001',
  items: [
    {
      product: { name: 'Athletic Running Shoes', category: 'running' },
      quantity: 3,
      size: '10',
      color: 'Black'
    }
  ],
  total: 0,
  status: 'distributed',
  orderDate: '2024-09-28',
  shippingAddress: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    country: 'USA'
  }
}
```

### Sample Volunteer Opportunity Data:
```typescript
{
  id: 'VOL-001',
  title: 'Warehouse Sorting Volunteer',
  description: 'Help sort and organize donated shoes and clothing',
  location: 'Nashville Distribution Center',
  timeCommitment: '4 hours',
  skills: ['Organization', 'Physical activity'],
  status: 'available'
}
```

## Step-by-Step Setup

### 1. Create Tools in Twilio Console

1. Go to **Twilio Console** > **AI Assistants**
2. Select your **Soles4Souls Support** assistant
3. Go to **Tools** tab
4. Click **Add Tool** for each tool:

#### Donation Lookup Tool:
- **Name**: `donation_lookup`
- **Description**: `Look up donation status and details by donation ID`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { donation_id: string }`
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/donation-lookup`

#### Volunteer Scheduler Tool:
- **Name**: `volunteer_scheduler`
- **Description**: `Schedule volunteer opportunities and shifts`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { opportunity_id: string, volunteer_name: string, contact_info?: string }`
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/volunteer-scheduler`

#### Impact Report Tool:
- **Name**: `impact_report`
- **Description**: `Retrieve recent impact stories and success metrics`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { category?: string, location?: string }`
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/impact-report`

#### Drop-off Locations Tool:
- **Name**: `dropoff_locations`
- **Description**: `Get donation drop-off locations and hours`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { city?: string }`
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/dropoff-locations`

#### Gift Card Tool:
- **Name**: `gift_card`
- **Description**: `Check gift card balance, purchase new gift cards, or redeem gift cards`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { action: "check_balance" | "purchase" | "redeem", cardNumber?: string, amount?: number, recipientEmail?: string, purchaserEmail?: string }`
- **Webhook URL**: `https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/gift-card`

### 2. Configure Webhook URLs

Update your `.env.local`:
```bash
TWILIO_WEBHOOK_URL=https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/webhooks/twilio
NEXT_PUBLIC_APP_URL=https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app
```

### 3. Test Tool Integration

#### Test Donation Lookup:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/donation-lookup \
  -H "Content-Type: application/json" \
  -d '{"donation_id": "DON-001"}'
```

#### Test Volunteer Scheduler:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/volunteer-scheduler \
  -H "Content-Type: application/json" \
  -d '{"opportunity_id": "VOL-001", "volunteer_name": "John Smith"}'
```

#### Test Impact Report:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/impact-report \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Test Drop-off Locations:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/dropoff-locations \
  -H "Content-Type: application/json" \
  -d '{"city": "Nashville"}'
```

#### Test Gift Card Balance Check:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "check_balance", "cardNumber": "GC-1234-5678-9012"}'
```

#### Test Gift Card Purchase:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "purchase", "amount": 50, "recipientEmail": "friend@email.com"}'
```

#### Test Gift Card Redemption:
```bash
curl -X POST https://soles4souls-demo-72ggp60me-marks-projects-a7b9c819.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "redeem", "cardNumber": "GC-1234-5678-9012", "amount": 25}'
```

## Demo Scenarios

### Scenario 1: Donation Tracking
**Customer**: "Where is my donation DON-001?"
**AI Process**:
1. Recognizes donation lookup intent
2. Calls `donation_lookup` tool with `{"donation_id": "DON-001"}`
3. Receives donation data from your API
4. Responds with donation status, impact metrics, distribution details

### Scenario 2: Volunteer Scheduling
**Customer**: "I want to volunteer for opportunity VOL-001"
**AI Process**:
1. Recognizes volunteer scheduling intent
2. Asks for volunteer name and contact info
3. Calls `volunteer_scheduler` tool with opportunity ID and volunteer details
4. Receives confirmation and next steps
5. Guides volunteer through scheduling process

### Scenario 3: Impact Stories
**Customer**: "Show me recent impact stories"
**AI Process**:
1. Recognizes impact report query
2. Calls `impact_report` tool
3. Receives recent stories, program breakdown, global stats
4. Provides comprehensive impact information

### Scenario 4: Drop-off Locations
**Customer**: "Where can I drop off donations in Nashville?"
**AI Process**:
1. Recognizes location query
2. Calls `dropoff_locations` tool with `{"city": "Nashville"}`
3. Receives locations, hours, donation guidelines
4. Provides detailed drop-off information

### Scenario 5: Gift Card Management
**Customer**: "What's the balance on my gift card GC-1234-5678-9012?"
**AI Process**:
1. Recognizes gift card balance query
2. Calls `gift_card` tool with `{"action": "check_balance", "cardNumber": "GC-1234-5678-9012"}`
3. Receives balance, expiry date, and status
4. Provides detailed gift card information

**Customer**: "I want to buy a $50 gift card for my friend"
**AI Process**:
1. Recognizes gift card purchase intent
2. Calls `gift_card` tool with `{"action": "purchase", "amount": 50, "recipientEmail": "friend@email.com"}`
3. Receives new gift card details and delivery info
4. Guides customer through gift card purchase process

## Production Considerations

### Database Integration
For production, replace mock data with real database:

```typescript
// Instead of mockOrders, connect to database
const order = await db.orders.findByOrderId(order_id)
```

### Error Handling
All tool endpoints include proper error handling:
- Invalid order IDs
- Return policy violations
- Network errors

### Security
- Validate webhook signatures
- Rate limiting
- Input sanitization
- Authentication for sensitive operations

## Troubleshooting

### Common Issues:

1. **Tool not executing**
   - Check webhook URL is accessible
   - Verify tool name matches exactly
   - Check parameter schema

2. **Donation not found**
   - Verify donation ID format (DON-001, DON-002)
   - Check mock data includes the donation

3. **Webhook timeout**
   - Ensure API responses are fast
   - Add proper error handling

### Debug Mode:
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

This will log all tool executions and responses.
