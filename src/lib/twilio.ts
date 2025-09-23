import { Twilio } from 'twilio'

// Initialize Twilio client
const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export interface TwilioConfig {
  accountSid: string
  authToken: string
  assistantSid: string
  webhookUrl: string
}

export const twilioConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  assistantSid: process.env.TWILIO_AI_ASSISTANT_SID!,
  webhookUrl: process.env.TWILIO_WEBHOOK_URL!,
}

// AI Assistant Tools Configuration
export const assistantTools = {
  order_lookup: {
    name: 'order_lookup',
    description: 'Look up order status and details by order ID',
    parameters: {
      type: 'object',
      properties: {
        order_id: {
          type: 'string',
          description: 'The order ID to look up'
        }
      },
      required: ['order_id']
    }
  },
  return_request: {
    name: 'return_request',
    description: 'Process return requests for orders',
    parameters: {
      type: 'object',
      properties: {
        order_id: {
          type: 'string',
          description: 'The order ID for the return'
        },
        reason: {
          type: 'string',
          description: 'Reason for the return'
        }
      },
      required: ['order_id', 'reason']
    }
  },
  store_hours: {
    name: 'store_hours',
    description: 'Get current store hours and location information',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  }
}

// Knowledge Base Configuration
export const knowledgeBase = {
  faq: [
    {
      question: "What are your store hours?",
      answer: "Our store hours are Monday-Thursday: 9AM-8PM, Friday: 9AM-9PM, Saturday: 10AM-8PM, Sunday: 11AM-6PM. We're located at 789 Fashion Blvd, San Francisco, CA 94102."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order by providing your order ID. I can look up the current status and provide tracking information for you."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items in original packaging. Returns are free and can be processed through our online system or in-store."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes! We offer free shipping on orders over $100. Standard shipping is $9.99 for orders under $100."
    },
    {
      question: "How do I contact customer service?",
      answer: "You can reach our customer service team at (555) 123-4567 or email us at support@levelpathshoes.com. Our AI assistant can also help with many common questions!"
    }
  ],
  policies: [
    {
      topic: "Shipping",
      content: "We ship to all 50 states. Standard shipping takes 3-5 business days, expedited shipping takes 1-2 business days. International shipping is available to select countries."
    },
    {
      topic: "Returns",
      content: "30-day return policy. Items must be unworn and in original packaging. Free return shipping. Refunds processed within 5-7 business days."
    },
    {
      topic: "Size Guide",
      content: "Our shoes run true to size. If you're between sizes, we recommend sizing up. Check our detailed size guide on each product page for specific measurements."
    }
  ]
}

export default twilio
