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

**Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/donation-lookup`

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

**Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/volunteer-scheduler`

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

**Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/impact-report`

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

**Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/dropoff-locations`

**Example Usage**:
- Customer: "Where can I drop off donations in Nashville?"
- AI calls tool with: `{"city": "Nashville"}`
- Returns locations, hours, donation guidelines

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
- **Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/donation-lookup`

#### Volunteer Scheduler Tool:
- **Name**: `volunteer_scheduler`
- **Description**: `Schedule volunteer opportunities and shifts`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { opportunity_id: string, volunteer_name: string, contact_info?: string }`
- **Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/volunteer-scheduler`

#### Impact Report Tool:
- **Name**: `impact_report`
- **Description**: `Retrieve recent impact stories and success metrics`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { category?: string, location?: string }`
- **Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/impact-report`

#### Drop-off Locations Tool:
- **Name**: `dropoff_locations`
- **Description**: `Get donation drop-off locations and hours`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { city?: string }`
- **Webhook URL**: `https://soles4souls-demo.vercel.app/api/tools/dropoff-locations`

### 2. Configure Webhook URLs

Update your `.env.local`:
```bash
TWILIO_WEBHOOK_URL=https://soles4souls-demo.vercel.app/api/webhooks/twilio
NEXT_PUBLIC_APP_URL=https://soles4souls-demo.vercel.app
```

### 3. Test Tool Integration

#### Test Donation Lookup:
```bash
curl -X POST https://soles4souls-demo.vercel.app/api/tools/donation-lookup \
  -H "Content-Type: application/json" \
  -d '{"donation_id": "DON-001"}'
```

#### Test Volunteer Scheduler:
```bash
curl -X POST https://soles4souls-demo.vercel.app/api/tools/volunteer-scheduler \
  -H "Content-Type: application/json" \
  -d '{"opportunity_id": "VOL-001", "volunteer_name": "John Smith"}'
```

#### Test Impact Report:
```bash
curl -X POST https://soles4souls-demo.vercel.app/api/tools/impact-report \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Test Drop-off Locations:
```bash
curl -X POST https://soles4souls-demo.vercel.app/api/tools/dropoff-locations \
  -H "Content-Type: application/json" \
  -d '{"city": "Nashville"}'
```

## Demo Scenarios

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
