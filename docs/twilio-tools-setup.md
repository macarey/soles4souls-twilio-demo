# Twilio AI Assistant Tools Setup Guide

## Overview
This guide explains how to configure the Tools in Twilio AI Assistant Console for the Levelpath Shoes demo.

## Tool Architecture

### How Tools Work:
1. **Tool Definition** - Defined in Twilio Console with parameters
2. **Tool Execution** - AI calls your webhook when tool is needed
3. **Data Processing** - Your API processes the request and returns data
4. **AI Response** - AI uses the data to respond to customer

### Current Tool Endpoints:
- **Order Lookup**: `/api/tools/order-lookup`
- **Return Request**: `/api/tools/return-request`  
- **Store Hours**: `/api/tools/store-hours`
- **Gift Card**: `/api/tools/gift-card`

## Tool Configuration in Twilio Console

### 1. Order Lookup Tool

**Tool Name**: `order_lookup`

**Description**: Look up order status and details by order ID

**Input Schema** (TypeScript format):
```typescript
export type Data = { 
  order_id: string 
}
```

**Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/order-lookup`

**Example Usage**:
- Customer: "Where is my order ORD-001?"
- AI calls tool with: `{"order_id": "ORD-001"}`
- Returns order status, tracking info, items, etc.

### 2. Return Request Tool

**Tool Name**: `return_request`

**Description**: Process return requests for orders

**Input Schema** (TypeScript format):
```typescript
export type Data = { 
  order_id: string,
  reason: string 
}
```

**Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/return-request`

**Example Usage**:
- Customer: "I want to return my shoes because they're too small"
- AI calls tool with: `{"order_id": "ORD-001", "reason": "too small"}`
- Returns return label, instructions, refund info

### 3. Store Hours Tool

**Tool Name**: `store_hours`

**Description**: Get current store hours and location information

**Input Schema** (TypeScript format):
```typescript
export type Data = {}
```

**Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/store-hours`

**Example Usage**:
- Customer: "What are your store hours?"
- AI calls tool with: `{}`
- Returns store hours, location, phone, current status

### 4. Gift Card Tool

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

**Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/gift-card`

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
- **Orders**: `mockOrders` array
- **Store Info**: `storeInfo` object

### Sample Order Data:
```typescript
{
  id: 'ORD-001',
  items: [
    {
      product: { name: 'Levelpath Runner Pro', price: 129.99 },
      quantity: 1,
      size: 10,
      color: 'Black'
    }
  ],
  total: 129.99,
  status: 'shipped',
  orderDate: '2024-12-01',
  shippingAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102'
  }
}
```

## Step-by-Step Setup

### 1. Create Tools in Twilio Console

1. Go to **Twilio Console** > **AI Assistants**
2. Select your **Levelpath Shoes Support** assistant
3. Go to **Tools** tab
4. Click **Add Tool** for each tool:

#### Order Lookup Tool:
- **Name**: `order_lookup`
- **Description**: `Look up order status and details by order ID`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { order_id: string }`
- **Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/order-lookup`

#### Return Request Tool:
- **Name**: `return_request`
- **Description**: `Process return requests for orders`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { order_id: string, reason: string }`
- **Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/return-request`

#### Store Hours Tool:
- **Name**: `store_hours`
- **Description**: `Get current store hours and location information`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = {}`
- **Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/store-hours`

#### Gift Card Tool:
- **Name**: `gift_card`
- **Description**: `Check gift card balance, purchase new gift cards, or redeem gift cards`
- **Type**: `WEBHOOK`
- **Method**: `POST`
- **Input Schema**: `export type Data = { action: "check_balance" | "purchase" | "redeem", cardNumber?: string, amount?: number, recipientEmail?: string, purchaserEmail?: string }`
- **Webhook URL**: `https://levelpath-shoes-demo.vercel.app/api/tools/gift-card`

### 2. Configure Webhook URLs

Update your `.env.local`:
```bash
TWILIO_WEBHOOK_URL=https://levelpath-shoes-demo.vercel.app/api/webhooks/twilio
NEXT_PUBLIC_APP_URL=https://levelpath-shoes-demo.vercel.app
```

### 3. Test Tool Integration

#### Test Order Lookup:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/order-lookup \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORD-001"}'
```

#### Test Return Request:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/return-request \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORD-001", "reason": "too small"}'
```

#### Test Store Hours:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/store-hours \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Test Gift Card Balance Check:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "check_balance", "cardNumber": "GC-1234-5678-9012"}'
```

#### Test Gift Card Purchase:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "purchase", "amount": 50, "recipientEmail": "friend@email.com"}'
```

#### Test Gift Card Redemption:
```bash
curl -X POST https://levelpath-shoes-demo.vercel.app/api/tools/gift-card \
  -H "Content-Type: application/json" \
  -d '{"action": "redeem", "cardNumber": "GC-1234-5678-9012", "amount": 25}'
```

## Demo Scenarios

### Scenario 1: Order Tracking
**Customer**: "Where is my order ORD-001?"
**AI Process**:
1. Recognizes order lookup intent
2. Calls `order_lookup` tool with `{"order_id": "ORD-001"}`
3. Receives order data from your API
4. Responds with order status, tracking number, delivery date

### Scenario 2: Return Processing
**Customer**: "I want to return my shoes because they don't fit"
**AI Process**:
1. Recognizes return intent
2. Asks for order ID
3. Calls `return_request` tool with order ID and reason
4. Receives return label and instructions
5. Guides customer through return process

### Scenario 3: Store Information
**Customer**: "What are your store hours?"
**AI Process**:
1. Recognizes store hours query
2. Calls `store_hours` tool
3. Receives current hours and location
4. Provides comprehensive store information

### Scenario 4: Gift Card Management
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

2. **Order not found**
   - Verify order ID format (ORD-001, ORD-002)
   - Check mock data includes the order

3. **Webhook timeout**
   - Ensure API responses are fast
   - Add proper error handling

### Debug Mode:
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

This will log all tool executions and responses.
