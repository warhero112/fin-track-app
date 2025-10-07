'use client'

import { Phone, Mail, MapPin, Clock, MessageSquare, Users, Globe, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import ContactForm from './ContactForm'

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+81-3-1234-5678', '+81-90-1234-5678'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@rentora.jp', 'support@rentora.jp'],
      description: 'Send us an email anytime'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['1-2-3 Shibuya, Shibuya-ku', 'Tokyo 150-0002, Japan'],
      description: 'Visit our main office'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      description: 'We\'re here to help'
    }
  ]

  const features = [
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our experienced agents know the Japanese real estate market inside and out'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'We speak English, Japanese, and other languages to serve international clients'
    },
    {
      icon: Award,
      title: 'Trusted Service',
      description: 'Over 15 years of experience helping foreigners find homes in Japan'
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer service'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to find your perfect home in Japan? Contact us today for a free consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Contact Information
            </h3>
            
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <div className="space-y-1">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                Why Choose Us
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600">
              Here are some common questions we receive from our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                How long does it take to find a property?
              </h4>
              <p className="text-gray-600 text-sm">
                On average, our clients find their perfect home within 2-4 weeks. 
                We work closely with you to understand your needs and preferences.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Do you help with visa requirements?
              </h4>
              <p className="text-gray-600 text-sm">
                While we don't handle visa applications directly, we can connect you 
                with trusted immigration lawyers who specialize in Japanese visas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                What documents do I need to rent?
              </h4>
              <p className="text-gray-600 text-sm">
                Typically, you'll need your passport, visa, employment contract, 
                and proof of income. We'll guide you through the entire process.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Do you offer property management services?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes! We provide comprehensive property management services including 
                maintenance, rent collection, and tenant relations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}