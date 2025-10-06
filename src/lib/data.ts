import { Product, Order } from '@/types'

// Mock data for donation items that people can donate
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Running Shoes',
    price: 0, // Free donations
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
    category: 'running',
    description: 'Athletic running shoes - any brand, any condition. Perfect for our 4Relief program.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Any Color'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Dress Shoes',
    price: 0,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    category: 'formal',
    description: 'Professional dress shoes for job interviews and work. Help someone land their dream job.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Any Color'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Children\'s Shoes',
    price: 0,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center',
    category: 'casual',
    description: 'Kids\' shoes for our 4EveryKid program. Help children experiencing homelessness.',
    sizes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    colors: ['Any Color'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Work Boots',
    price: 0,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center',
    category: 'athletic',
    description: 'Sturdy work boots for our 4Opportunity micro-enterprise program.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Any Color'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Sandals',
    price: 0,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center',
    category: 'casual',
    description: 'Summer sandals and flip-flops for warm weather relief.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Any Color'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Clothing Items',
    price: 0,
    image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&crop=center',
    category: 'formal',
    description: 'Clothing donations - shirts, pants, jackets, and more. All items welcome.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Any Color'],
    inStock: true,
  },
]

// Mock data for donation records instead of orders
export const mockOrders: Order[] = [
  {
    id: 'DON-001',
    items: [
      {
        product: mockProducts[0],
        quantity: 3,
        size: '10',
        color: 'Black',
      },
    ],
    total: 0,
    status: 'distributed',
    orderDate: '2024-12-01',
    shippingAddress: {
      street: '123 Main St',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA',
    },
  },
  {
    id: 'DON-002',
    items: [
      {
        product: mockProducts[2],
        quantity: 5,
        size: '8',
        color: 'Various',
      },
    ],
    total: 0,
    status: 'processing',
    orderDate: '2024-11-28',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Memphis',
      state: 'TN',
      zipCode: '38101',
      country: 'USA',
    },
  },
  {
    id: 'DON-003',
    items: [
      {
        product: mockProducts[3],
        quantity: 2,
        size: '11',
        color: 'Brown',
      },
    ],
    total: 0,
    status: 'received',
    orderDate: '2024-11-25',
    shippingAddress: {
      street: '789 Pine St',
      city: 'Knoxville',
      state: 'TN',
      zipCode: '37901',
      country: 'USA',
    },
  },
]

export const storeInfo = {
  name: 'Soles4Souls',
  hours: {
    monday: '8:00 AM - 5:00 PM',
    tuesday: '8:00 AM - 5:00 PM',
    wednesday: '8:00 AM - 5:00 PM',
    thursday: '8:00 AM - 5:00 PM',
    friday: '8:00 AM - 5:00 PM',
    saturday: '9:00 AM - 3:00 PM',
    sunday: 'Closed',
  },
  phone: '(615) 391-5723',
  email: 'info@soles4souls.org',
  address: {
    street: '319 Martingale Dr',
    city: 'Old Hickory',
    state: 'TN',
    zipCode: '37138',
  },
}

// Mock data for volunteer opportunities
export const mockVolunteerOpportunities = [
  {
    id: 'VOL-001',
    title: 'Warehouse Sorting Volunteer',
    description: 'Help sort and organize donated shoes and clothing at our distribution center.',
    location: 'Old Hickory, TN',
    timeCommitment: '4 hours',
    skills: ['Organization', 'Physical Activity'],
    status: 'available'
  },
  {
    id: 'VOL-002',
    title: 'Shoe Drive Coordinator',
    description: 'Organize and run shoe drives in your community or workplace.',
    location: 'Remote',
    timeCommitment: 'Flexible',
    skills: ['Leadership', 'Community Outreach'],
    status: 'available'
  },
  {
    id: 'VOL-003',
    title: 'Distribution Event Helper',
    description: 'Assist at local distribution events, helping families find the right shoes.',
    location: 'Various Locations',
    timeCommitment: '6 hours',
    skills: ['Customer Service', 'Empathy'],
    status: 'available'
  }
]

// Mock data for impact stories
export const mockImpactStories = [
  {
    id: 'IMP-001',
    title: 'Maria\'s New Business',
    description: 'With shoes from Soles4Souls, Maria started a shoe repair business in Honduras, now employing 3 people.',
    location: 'Honduras',
    date: '2024-11-15',
    category: '4Opportunity'
  },
  {
    id: 'IMP-002',
    title: 'Children\'s First Day of School',
    description: '50 children in Nashville received new shoes for their first day of school through our 4EveryKid program.',
    location: 'Nashville, TN',
    date: '2024-11-10',
    category: '4EveryKid'
  },
  {
    id: 'IMP-003',
    title: 'Hurricane Relief Distribution',
    description: 'We distributed 2,000 pairs of shoes to families affected by recent hurricanes in Florida.',
    location: 'Miami, FL',
    date: '2024-11-05',
    category: '4Relief'
  }
]

// Mock data for donation drop-off locations
export const mockDropOffLocations = [
  {
    id: 'LOC-001',
    name: 'Soles4Souls Nashville Distribution Center',
    address: '319 Martingale Dr, Old Hickory, TN 37138',
    hours: 'Monday-Friday: 8:00AM-5:00PM, Saturday: 9:00AM-3:00PM, Sunday: Closed',
    phone: '(615) 391-5723',
    acceptsItems: ['Shoes', 'Clothing', 'Accessories'],
    specialInstructions: 'Our main Nashville location - accepts all donations and offers tours by appointment.'
  },
  {
    id: 'LOC-002',
    name: 'Memphis Partnership Location',
    address: '456 Partnership Blvd, Memphis, TN 38101',
    hours: 'Monday-Friday: 10:00AM-6:00PM',
    phone: '(901) 555-0456',
    acceptsItems: ['Shoes', 'Clothing', 'Accessories'],
    specialInstructions: 'Memphis area partner location.'
  }
]