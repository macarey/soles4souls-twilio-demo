export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: 'running' | 'casual' | 'formal' | 'athletic'
  description: string
  sizes: number[]
  colors: string[]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: number
  color: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  shippingAddress: Address
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
