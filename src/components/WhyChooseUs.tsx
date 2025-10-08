'use client'

import { Users, Globe, Shield, Clock, Phone, Award } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'English Support',
    description: 'Our team speaks fluent English and understands the unique needs of foreign residents in Japan.'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Over 15 years of experience helping foreigners find their perfect home in Japan.'
  },
  {
    icon: Shield,
    title: 'Trusted Service',
    description: 'Licensed real estate professionals with a proven track record of successful transactions.'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your real estate needs and emergencies.'
  },
  {
    icon: Phone,
    title: 'Personal Consultation',
    description: 'One-on-one consultations to understand your specific requirements and budget.'
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'We only work with verified properties and trusted landlords to ensure quality.'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Rentora?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand the challenges of finding a home in Japan as a foreigner. 
            That's why we've built our services around your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-8 text-center group hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}