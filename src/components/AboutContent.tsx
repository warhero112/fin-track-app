'use client'

import Image from 'next/image'
import { Users, Target, Award, Globe, Heart, Shield } from 'lucide-react'

const team = [
  {
    name: 'Yuki Tanaka',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: '15+ years experience in Japanese real estate, fluent in English and Japanese.'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of International Relations',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Former expat who understands the challenges of moving to Japan.'
  },
  {
    name: 'Takeshi Yamamoto',
    role: 'Senior Property Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Specializes in luxury properties and investment opportunities.'
  },
  {
    name: 'Emma Williams',
    role: 'Client Success Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Ensures every client has a smooth and successful experience.'
  }
]

const values = [
  {
    icon: Heart,
    title: 'Client-First Approach',
    description: 'We prioritize our clients\' needs and work tirelessly to find the perfect property for their unique situation.'
  },
  {
    icon: Globe,
    title: 'Cultural Understanding',
    description: 'Our team understands both Japanese culture and the challenges foreigners face when relocating.'
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We maintain the highest standards of honesty and transparency in all our dealings.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our service, from property selection to customer support.'
  }
]

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Rentora
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Your trusted partner in finding the perfect home in Japan. 
              We specialize in helping foreigners navigate the Japanese real estate market with confidence and ease.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At Rentora, we believe that finding a home in Japan shouldn't be complicated, 
                especially for foreigners. Our mission is to bridge the gap between international 
                residents and the Japanese real estate market by providing expert guidance, 
                cultural understanding, and personalized service.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We understand the unique challenges that foreigners face when relocating to Japan, 
                from language barriers to cultural differences in housing preferences. That's why 
                we've built our entire service around making your transition as smooth as possible.
              </p>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our team helping clients"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and ensure we provide the best possible service to our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced team combines deep knowledge of the Japanese real estate market 
              with international perspective to serve you better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="relative mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-medium mb-4">
                  {member.role}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Numbers that speak to our commitment and success in helping foreigners find their homes in Japan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Rentora was founded in 2008 by Yuki Tanaka, who recognized the growing need for 
                specialized real estate services for foreigners in Japan. Having worked with 
                international companies and expatriates for years, Yuki saw firsthand the 
                challenges that foreigners face when trying to find suitable housing in Japan.
              </p>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                What started as a small team of three has grown into a comprehensive real estate 
                service company with over 20 dedicated professionals. We've helped more than 
                1,000 foreigners from over 50 countries find their perfect homes in Japan, 
                from bustling Tokyo to the historic streets of Kyoto.
              </p>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Today, we continue to innovate and improve our services, always keeping our 
                clients' needs at the center of everything we do. We're proud to be the 
                trusted choice for foreigners seeking quality housing in Japan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Find Your Home in Japan?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let our experienced team help you navigate the Japanese real estate market 
              and find the perfect property for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your Search
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}