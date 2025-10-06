'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Heart, Users, Globe, ArrowRight } from 'lucide-react'
import { mockProducts } from '@/lib/data'
import { Product } from '@/types'
import DonationForm from '@/components/DonationForm'

export default function HomePage() {
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [donationFormOpen, setDonationFormOpen] = useState(false)

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-blue-600">Soles4Souls</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Who We Are</Link>
              <Link href="#work" className="text-gray-700 hover:text-blue-600 transition-colors">Our Work</Link>
              <Link href="#involve" className="text-gray-700 hover:text-blue-600 transition-colors">Get Involved</Link>
              <Link href="#resources" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="#donate" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Donate
              </Link>
              <button 
                onClick={() => setDonationFormOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Give Shoes
              </button>
              
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Soles4Souls
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            Soles4Souls creates opportunity for people through shoes and clothing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#involve" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Involved
            </Link>
            <button 
              onClick={() => setDonationFormOpen(true)}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Give Shoes
            </button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We can do more good when we do it together
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              When people lack the resources to get through today, it's difficult for them to focus on tomorrow. 
              Soles4Souls turns shoes and clothing into opportunities for education and employment so they can have a more hopeful future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Improve lives locally and globally</h3>
              <p className="text-gray-600">Our impact reaches communities worldwide, from local neighborhoods to international partnerships.</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Where social impact meets sustainability</h3>
              <p className="text-gray-600">We give goods a second life—and people a second chance through circular fashion.</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make a difference you can measure</h3>
              <p className="text-gray-600">Track the real impact of your donations with our transparent reporting system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section id="work" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creating opportunity for people through shoes and clothing
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              By diverting shoes and clothing from landfills, we turn what's unwanted into relief for those in crisis, 
              opportunity for communities, confidence for kids, and a healthier planet for all.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* 4Opportunity */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-lg">4</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4Opportunity</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">A step towards self-sufficiency.</h4>
              <p className="text-gray-600 mb-4">
                When we equip entrepreneurs in low-income countries with donated shoes and clothing to sell, 
                we help them create sustainable small businesses that lift families out of poverty and drive community growth.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* 4Relief */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">4</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4Relief</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">A fresh start begins with the basics.</h4>
              <p className="text-gray-600 mb-4">
                We provide new shoes and clothing to people facing hardship—from survivors of natural disasters 
                to those rebuilding their lives after homelessness or domestic violence.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* 4EveryKid */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">4</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4EveryKid</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Confidence from the ground up.</h4>
              <p className="text-gray-600 mb-4">
                We partner with schools and community organizations to provide new athletic shoes to children 
                experiencing homelessness, removing barriers to school participation, sports, and a brighter future.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Circularity */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold text-lg">♻</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Circularity</h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">From waste to worth.</h4>
              <p className="text-gray-600 mb-4">
                Through sorting, grading, recommerce, repurposing, repairing, and responsible end of life solutions, 
                we extend the life of shoes and clothing to maximize their impact while reducing environmental waste.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-2">83.1 MILLION</h3>
            <p className="text-xl mb-4">pairs of donated shoes and pieces of clothing.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <p className="text-lg">You've saved them from going to <strong>waste.</strong></p>
              <p className="text-lg">We've put them to <strong>good use.</strong></p>
            </div>
            <button 
              onClick={() => setDonationFormOpen(true)}
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold mt-6 hover:bg-gray-100 transition-colors"
            >
              Give Shoes
            </button>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="involve" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Make a difference—it's easier than you think.
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Whether it's a single pair of shoes or a commitment of your time, your actions can change lives. 
              Here's how you can make an impact:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Donate shoes</h3>
              <p className="text-gray-600 mb-4">
                When you donate shoes or clothing, you're caring for the planet and changing someone's life.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a Shoe Drive</h3>
              <p className="text-gray-600 mb-4">
                Most people own many more pairs of shoes than they wear. By hosting a shoe drive, you put all of that unused footwear to work—literally!
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Volunteer with us</h3>
              <p className="text-gray-600 mb-4">
                Whether you're looking for a place to volunteer on your own, or you have an entire group motivated to serve people, we have a place for you to plug in.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold text-xl">$</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ways to give</h3>
              <p className="text-gray-600 mb-4">
                When you give to Soles4Souls, you provide relief, create jobs, and empower people to break the cycle of poverty.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Partner with us</h3>
              <p className="text-gray-600 mb-4">
                Partnering with Soles4Souls is a great way to connect with your customers, engage your employees, and support a great cause.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel with us</h3>
              <p className="text-gray-600 mb-4">
                When you join Soles4Souls on a trip, you get to meet new people, explore vibrant cultures, and see just how much good shoes can do.
              </p>
              <Link href="#learn-more" className="text-blue-600 hover:text-blue-700 font-semibold">
                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Items Section */}
      <section id="donate" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What can you donate?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Every item you donate helps create opportunities for people in need. Here's what we accept:
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Donation Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
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
                    <span className="text-gray-400 text-sm">Donation Item</span>
                  </div>
                </div>
                
                <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-green-600">FREE DONATION</span>
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Donate This Item
                </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No donation items found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Soles4Souls</h3>
              <p className="text-gray-300">Creating opportunity for people through shoes and clothing.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#donate" className="hover:text-white">Donation Drop-offs</Link></li>
                <li><Link href="#volunteer" className="hover:text-white">Volunteer Opportunities</Link></li>
                <li><Link href="#shoe-drive" className="hover:text-white">Host a Shoe Drive</Link></li>
                <li><Link href="#partner" className="hover:text-white">Partner With Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Our Programs</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#4relief" className="hover:text-white">4Relief</Link></li>
                <li><Link href="#4opportunity" className="hover:text-white">4Opportunity</Link></li>
                <li><Link href="#4everykid" className="hover:text-white">4EveryKid</Link></li>
                <li><Link href="#circularity" className="hover:text-white">Circularity</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>(615) 391-5723</li>
                <li>info@soles4souls.org</li>
                <li>319 Martingale Dr</li>
                <li>Old Hickory, TN 37138</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Soles4Souls is a registered 501(c)3 Non-profit Organization.</p>
            <p className="mt-2">Copyright © 2025. Soles4Souls</p>
          </div>
        </div>
      </footer>
      
      {/* Donation Form Modal */}
      <DonationForm 
        isOpen={donationFormOpen} 
        onClose={() => setDonationFormOpen(false)} 
      />
    </div>
  )
}