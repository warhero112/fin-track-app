'use client'

import { Home, Search, FileText, Users, Shield, Globe, Phone, CheckCircle } from 'lucide-react'

const services = [
  {
    icon: Search,
    title: 'Property Search',
    description: 'We search through thousands of properties to find the perfect match for your needs, budget, and preferences.',
    features: [
      'Personalized property recommendations',
      'Access to exclusive listings',
      'Virtual and in-person property tours',
      'Detailed property analysis and reports'
    ],
    price: 'Free'
  },
  {
    icon: FileText,
    title: 'Documentation Support',
    description: 'We handle all the complex paperwork and documentation required for renting or buying property in Japan.',
    features: [
      'Visa and residence status verification',
      'Employment contract assistance',
      'Financial documentation support',
      'Application form completion'
    ],
    price: 'Included'
  },
  {
    icon: Users,
    title: 'Relocation Services',
    description: 'Complete support for your move to Japan, from finding housing to settling into your new community.',
    features: [
      'Pre-arrival consultation',
      'Temporary accommodation booking',
      'Utility setup assistance',
      'Community integration support'
    ],
    price: '¥50,000'
  },
  {
    icon: Shield,
    title: 'Property Management',
    description: 'Ongoing support for property owners and tenants, ensuring smooth property management.',
    features: [
      'Rent collection and payment processing',
      'Maintenance coordination',
      'Tenant screening and management',
      'Property inspection services'
    ],
    price: '5% of rent'
  },
  {
    icon: Globe,
    title: 'Cultural Integration',
    description: 'Help you understand Japanese culture, customs, and housing practices to make your transition smoother.',
    features: [
      'Cultural orientation sessions',
      'Housing etiquette guidance',
      'Neighborhood information',
      'Local service recommendations'
    ],
    price: '¥30,000'
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for any property-related issues or emergencies.',
    features: [
      'Emergency contact support',
      'Maintenance issue reporting',
      'Urgent property assistance',
      'Multilingual support team'
    ],
    price: 'Included'
  }
]

const processSteps = [
  {
    step: 1,
    title: 'Initial Consultation',
    description: 'We discuss your requirements, budget, and preferences to understand your needs.',
    icon: Users
  },
  {
    step: 2,
    title: 'Property Search',
    description: 'Our team searches through our extensive database to find suitable properties.',
    icon: Search
  },
  {
    step: 3,
    title: 'Property Viewing',
    description: 'We arrange and accompany you on property viewings, both virtual and in-person.',
    icon: Home
  },
  {
    step: 4,
    title: 'Documentation',
    description: 'We handle all paperwork and ensure all required documents are properly prepared.',
    icon: FileText
  },
  {
    step: 5,
    title: 'Negotiation',
    description: 'We negotiate terms and conditions on your behalf to secure the best deal.',
    icon: Shield
  },
  {
    step: 6,
    title: 'Move-in Support',
    description: 'We assist with the final steps and provide ongoing support for your new home.',
    icon: CheckCircle
  }
]

export default function ServicesContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Comprehensive real estate services designed specifically for foreigners in Japan. 
              From property search to relocation support, we're your trusted partner.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive range of services ensures you have everything you need 
              to find and secure your perfect home in Japan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card p-8 group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-primary-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-primary-600">
                    {service.price}
                  </span>
                  <button className="btn-primary">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've streamlined our process to make finding your perfect home in Japan 
              as simple and stress-free as possible.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-200 transform translate-x-4 z-0" />
                  )}
                  
                  <div className="relative z-10 card p-6 text-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      Step {step.step}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Services?
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We understand that finding a home in Japan as a foreigner can be challenging. 
                That's why we've designed our services specifically to address the unique 
                needs and challenges that international residents face.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expert Knowledge</h3>
                    <p className="text-gray-600">Deep understanding of Japanese real estate market and regulations</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Cultural Bridge</h3>
                    <p className="text-gray-600">We bridge the gap between foreign expectations and Japanese practices</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personalized Service</h3>
                    <p className="text-gray-600">Tailored solutions that match your specific needs and preferences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ongoing Support</h3>
                    <p className="text-gray-600">We're here for you even after you've moved into your new home</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="card p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contact us today for a free consultation and let us help you find 
                  your perfect home in Japan.
                </p>
                
                <div className="space-y-4">
                  <button className="w-full btn-primary">
                    Schedule Free Consultation
                  </button>
                  <button className="w-full btn-secondary">
                    View Our Properties
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">1000+</div>
                    <div className="text-gray-600">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Let's Find Your Perfect Home
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Don't let the complexity of Japanese real estate hold you back. 
              Our expert team is here to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg transition-colors duration-200">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}