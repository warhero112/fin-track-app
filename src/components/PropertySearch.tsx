'use client'

import { useState } from 'react'
import { Search, MapPin, Home, DollarSign, Filter } from 'lucide-react'

export default function PropertySearch() {
  const [searchType, setSearchType] = useState('rent')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  const locations = [
    'Shibuya', 'Shinjuku', 'Ginza', 'Roppongi', 'Harajuku', 
    'Akihabara', 'Ikebukuro', 'Ueno', 'Asakusa', 'Odaiba'
  ]

  const propertyTypes = [
    'Apartment', 'House', 'Studio', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK'
  ]

  const priceRanges = [
    'Under ¥50,000', '¥50,000 - ¥100,000', '¥100,000 - ¥200,000', 
    '¥200,000 - ¥300,000', '¥300,000 - ¥500,000', 'Over ¥500,000'
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Property
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our extensive database of properties across Tokyo and other major Japanese cities
          </p>
        </div>

        <div className="card max-w-6xl mx-auto p-8">
          {/* Search Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  searchType === 'rent'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setSearchType('rent')}
              >
                For Rent
              </button>
              <button
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  searchType === 'buy'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setSearchType('buy')}
              >
                For Sale
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1" />
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
              {['Pet Friendly', 'Furnished', 'Near Station', 'Balcony', 'Parking'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors duration-200"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}