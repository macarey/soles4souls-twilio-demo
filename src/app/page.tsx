'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { mockProducts } from '@/lib/data'
import { Product } from '@/types'

export default function HomePage() {
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = ['all', 'running', 'casual', 'formal', 'athletic']

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    const newItem = {
      product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    }
    setCart([...cart, newItem])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-primary-600">Levelpath Shoes</h1>
              <Link 
                href="/admin" 
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                Admin
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search shoes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600">
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`capitalize font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Premium Footwear for Every Step</h2>
          <p className="text-xl mb-8">Discover our collection of high-quality shoes designed for comfort, style, and performance.</p>
          <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                      if (nextElement) {
                        nextElement.style.display = 'flex'
                      }
                    }}
                  />
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-gray-400 text-sm">Product Image</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                  <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Levelpath Shoes</h3>
              <p className="text-gray-300">Premium footwear for every occasion.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Order Status</li>
                <li>Returns & Exchanges</li>
                <li>Size Guide</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Store Hours</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Mon-Thu: 9AM-8PM</li>
                <li>Fri: 9AM-9PM</li>
                <li>Sat: 10AM-8PM</li>
                <li>Sun: 11AM-6PM</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>(555) 123-4567</li>
                <li>support@levelpathshoes.com</li>
                <li>789 Fashion Blvd</li>
                <li>San Francisco, CA 94102</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
