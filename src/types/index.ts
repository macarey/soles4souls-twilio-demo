export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: 'running' | 'casual' | 'formal' | 'athletic'
  description: string
  sizes: string[]
  colors: string[]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'distributed' | 'received' | 'cancelled'
  orderDate: string
  shippingAddress: Address
}

export interface VolunteerOpportunity {
  id: string
  title: string
  description: string
  location: string
  timeCommitment: string
  skills: string[]
  status: 'available' | 'filled' | 'completed'
}

export interface ImpactStory {
  id: string
  title: string
  description: string
  location: string
  date: string
  category: '4Relief' | '4Opportunity' | '4EveryKid'
}

export interface DropOffLocation {
  id: string
  name: string
  address: string
  hours: string
  phone: string
  acceptsItems: string[]
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'agent'
  timestamp: string
  type?: 'text' | 'tool' | 'escalation'
}
