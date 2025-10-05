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
  donation_lookup: {
    name: 'donation_lookup',
    description: 'Look up donation status and details by donation ID',
    parameters: {
      type: 'object',
      properties: {
        donation_id: {
          type: 'string',
          description: 'The donation ID to look up'
        }
      },
      required: ['donation_id']
    }
  },
  volunteer_scheduler: {
    name: 'volunteer_scheduler',
    description: 'Schedule volunteer opportunities and shifts',
    parameters: {
      type: 'object',
      properties: {
        opportunity_id: {
          type: 'string',
          description: 'The volunteer opportunity ID to schedule'
        },
        volunteer_name: {
          type: 'string',
          description: 'Name of the volunteer'
        },
        contact_info: {
          type: 'string',
          description: 'Contact information for the volunteer'
        }
      },
      required: ['opportunity_id', 'volunteer_name']
    }
  },
  impact_report: {
    name: 'impact_report',
    description: 'Retrieve recent impact stories and success metrics',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by program category: 4Relief, 4Opportunity, or 4EveryKid'
        },
        location: {
          type: 'string',
          description: 'Filter by location'
        }
      },
      required: []
    }
  },
  dropoff_locations: {
    name: 'dropoff_locations',
    description: 'Get donation drop-off locations and hours',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City to search for drop-off locations'
        }
      },
      required: []
    }
  }
}

// Knowledge Base Configuration
export const knowledgeBase = {
  faq: [
    {
      question: "Where can I drop off donated shoes?",
      answer: "We have multiple drop-off locations across Tennessee and partner locations nationwide. Our main facility is at 319 Martingale Dr, Old Hickory, TN 37138, open Mon-Fri 8AM-5PM, Sat 9AM-3PM. You can also search for locations near you using our drop-off finder tool."
    },
    {
      question: "How do I become a volunteer?",
      answer: "We'd love to have you volunteer with us! You can help with warehouse sorting, organizing shoe drives, or assisting at distribution events. Use our volunteer scheduler tool to find opportunities that match your interests and schedule. All skill levels are welcome!"
    },
    {
      question: "Can I host a shoe drive in my city?",
      answer: "Absolutely! Shoe drives are one of the most impactful ways to help. We provide all the materials you need including collection boxes, flyers, and guidance. Contact us at info@soles4souls.org to get started with your community shoe drive."
    },
    {
      question: "Do you accept clothing donations?",
      answer: "Yes! We accept shoes, clothing, and accessories in good condition. Items should be clean and wearable. We distribute these items through our 4Relief program to people in need and use them in our 4Opportunity micro-enterprise program."
    },
    {
      question: "How are donations used to support small businesses?",
      answer: "Through our 4Opportunity program, we provide shoes and clothing to entrepreneurs in developing countries who use them to start small businesses. This creates sustainable income and helps break the cycle of poverty. Each donation can help multiple families!"
    },
    {
      question: "What is the 4EveryKid program?",
      answer: "Our 4EveryKid program provides new shoes to children experiencing homelessness in the United States. We partner with schools and shelters to ensure every child has proper footwear for school and daily activities."
    },
    {
      question: "How can I track my donation?",
      answer: "When you make a donation, you'll receive a donation ID. You can use this ID with our donation lookup tool to see the status of your donation and learn about its impact. We'll also send you updates about how your donation is helping others."
    },
    {
      question: "Do you accept monetary donations?",
      answer: "Yes! Monetary donations help us cover shipping costs, purchase new shoes for children, and support our operations. You can donate online through our website or by calling (615) 391-5723. Every dollar makes a difference!"
    }
  ],
  policies: [
    {
      topic: "Donation Guidelines",
      content: "We accept shoes, clothing, and accessories in good, wearable condition. Items should be clean and free of major damage. We accept all sizes and styles - from children's shoes to work boots."
    },
    {
      topic: "Volunteer Opportunities",
      content: "Volunteer opportunities include warehouse sorting, shoe drive coordination, distribution event assistance, and administrative support. Flexible scheduling available with opportunities for individuals and groups."
    },
    {
      topic: "Impact Measurement",
      content: "We track every donation and provide regular impact reports. Our programs have distributed over 73 million pairs of shoes and pieces of clothing, helping millions of people worldwide."
    }
  ]
}

export default twilio
