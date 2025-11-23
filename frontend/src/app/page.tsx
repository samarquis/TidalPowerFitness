'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  TestimonialCarousel,
  TransformationCard,
  StatsCounter,
  CTAButton,
  TrustBadge,
  ProcessStep
} from '@/components/ui';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Sample testimonials data
  const testimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Lost 45 lbs in 6 months',
      content: 'Tidal Power completely transformed my life. The trainers are incredibly knowledgeable and supportive. I never thought I could achieve these results!',
      rating: 5
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Gained 20 lbs of muscle',
      content: 'Best investment I\'ve ever made. The personalized training program and nutrition guidance helped me build the physique I always wanted.',
      rating: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Marathon finisher',
      content: 'From couch to marathon in one year! The trainers helped me build endurance safely and effectively. Couldn\'t have done it without them.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-5 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust indicators */}
          <div className="flex justify-center gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>500+ 5-Star Reviews</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>1,000+ Clients Transformed</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Transform Your Body,
            <br />
            <span className="text-gradient">Elevate Your Life</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Elite personal training tailored to your goals. Expert coaches, proven results, unstoppable you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href={isAuthenticated ? "/trainers" : "/register"}
              variant="primary"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
            >
              Start Free Consultation
            </CTAButton>
            <CTAButton href="/trainers" variant="secondary" size="lg">
              Meet Our Trainers
            </CTAButton>
          </div>

          {/* Social proof badges */}
          <div className="mt-12 flex justify-center gap-6 text-sm text-gray-400">
            <div>✓ No Contracts</div>
            <div>✓ Money-Back Guarantee</div>
            <div>✓ Certified Trainers</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section - NEW */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <StatsCounter end={1000} suffix="+" label="Clients Transformed" />
            <StatsCounter end={15} suffix=" Years" label="Experience" />
            <StatsCounter end={50} suffix="K+" label="Workouts Completed" />
            <StatsCounter end={98} suffix="%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* How It Works Section - NEW */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Your Journey to <span className="text-gradient">Success</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            We make it simple to start and easy to succeed. Here's how we'll transform your fitness journey.
          </p>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            <ProcessStep
              number={1}
              title="Free Consultation"
              description="Tell us your goals and we'll match you with the perfect trainer"
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
            <ProcessStep
              number={2}
              title="Custom Plan"
              description="Get a personalized workout and nutrition program designed for you"
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
            />
            <ProcessStep
              number={3}
              title="Train & Track"
              description="Work with your trainer and watch your progress soar"
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <ProcessStep
              number={4}
              title="Achieve Goals"
              description="Celebrate your transformation and set new targets"
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              isLast
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section - NEW */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Real People, <span className="text-gradient">Real Results</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from clients who've transformed their lives.
          </p>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Transformation Stories - NEW */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Incredible <span className="text-gradient">Transformations</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            See the amazing results our clients have achieved with dedication and expert guidance.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <TransformationCard
              name="John Martinez"
              beforeImage="/api/placeholder/400/600"
              afterImage="/api/placeholder/400/600"
              timeframe="12 Weeks"
              stats={[
                { label: 'Weight Lost', value: '45 lbs' },
                { label: 'Body Fat', value: '-12%' }
              ]}
              story="I never thought I could look like this. The trainers pushed me beyond what I thought was possible."
            />
            <TransformationCard
              name="Lisa Thompson"
              beforeImage="/api/placeholder/400/600"
              afterImage="/api/placeholder/400/600"
              timeframe="16 Weeks"
              stats={[
                { label: 'Muscle Gained', value: '15 lbs' },
                { label: 'Strength', value: '+85%' }
              ]}
              story="Building strength changed everything. I feel confident and powerful for the first time in my life."
            />
            <TransformationCard
              name="David Park"
              beforeImage="/api/placeholder/400/600"
              afterImage="/api/placeholder/400/600"
              timeframe="20 Weeks"
              stats={[
                { label: 'Weight Lost', value: '60 lbs' },
                { label: 'Energy', value: '+200%' }
              ]}
              story="This program gave me my life back. I can play with my kids and feel amazing every day."
            />
          </div>

          <div className="text-center">
            <CTAButton href="/success-stories" variant="outline" size="lg">
              View All Success Stories
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-gradient">Tidal Power</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-6 to-teal-6 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Trainers</h3>
              <p className="text-gray-400">
                Certified professionals with years of experience in strength training, conditioning, and nutrition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-6 to-teal-6 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Personalized Programs</h3>
              <p className="text-gray-400">
                Custom workout and nutrition plans designed specifically for your goals and fitness level.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-6 to-teal-6 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Flexible Scheduling</h3>
              <p className="text-gray-400">
                Book sessions that fit your schedule with our easy online booking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section - NEW */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-gray-400 mb-8">Trusted & Certified</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TrustBadge type="certification" name="NASM Certified" year="Since 2010" />
            <TrustBadge type="certification" name="ACE Certified" year="Since 2012" />
            <TrustBadge type="award" name="Best Gym 2023" year="Local Award" />
            <TrustBadge type="media" name="Featured in Fitness Magazine" year="2023" />
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-teal-6 to-teal-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Transformation?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of clients who have achieved their fitness goals with Tidal Power.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isAuthenticated ? "/trainers" : "/register"}
              className="inline-block px-8 py-4 bg-black hover:bg-gray-900 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Start Your Journey
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg text-lg transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">
            ✓ Free consultation • ✓ No long-term contracts • ✓ Money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
