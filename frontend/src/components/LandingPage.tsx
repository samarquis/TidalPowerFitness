'use client';

import Link from 'next/link';
import ClassScheduleSection from '@/components/ClassScheduleSection';
import TrainerBiosSection from '@/components/TrainerBiosSection';
import {
    CTAButton,
    TrustBadge,
    ProcessStep
} from '@/components/ui';

export default function LandingPage() {
    return (
        <div className="min-h-screen logo-watermark">
            {/* Hero Section */}
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
                            href="/register"
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

            {/* Class Schedule Section */}
            <ClassScheduleSection />

            {/* How It Works Section */}
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

            {/* Features Section */}
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

            {/* Trainer Bios Section */}
            <TrainerBiosSection />

            {/* Statistics Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="glass p-8 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">500+</div>
                            <div className="text-gray-400">Active Members</div>
                        </div>
                        <div className="glass p-8 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">50+</div>
                            <div className="text-gray-400">Classes per Week</div>
                        </div>
                        <div className="glass p-8 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">15+</div>
                            <div className="text-gray-400">Expert Trainers</div>
                        </div>
                        <div className="glass p-8 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">98%</div>
                            <div className="text-gray-400">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Real People, <span className="text-gradient">Real Results</span>
                    </h2>
                    <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
                        Don't just take our word for it. Hear from members who've transformed their lives.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="glass p-8 rounded-2xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic">
                                "Lost 30 pounds in 3 months! The personalized approach made all the difference. My trainer pushed me beyond what I thought possible."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    SM
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Sarah Martinez</div>
                                    <div className="text-sm text-gray-400">Member since 2023</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="glass p-8 rounded-2xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic">
                                "Best investment I've ever made. Not just in my fitness, but in my overall health and confidence. The trainers really care about your success."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    JC
                                </div>
                                <div>
                                    <div className="font-semibold text-white">James Chen</div>
                                    <div className="text-sm text-gray-400">Member since 2022</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="glass p-8 rounded-2xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic">
                                "Finally found a gym that feels like family. The community here is incredible and the results speak for themselves. I'm stronger than ever!"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    EP
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Emily Parker</div>
                                    <div className="text-sm text-gray-400">Member since 2021</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Teaser Section */}
            <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Flexible <span className="text-gradient">Membership Options</span>
                    </h2>
                    <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
                        Choose the plan that works for you. No long-term contracts, cancel anytime.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter Package */}
                        <div className="glass p-8 rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all">
                            <div className="text-sm text-teal-400 font-semibold mb-2">STARTER</div>
                            <div className="text-4xl font-bold mb-2">$99<span className="text-lg text-gray-400">/mo</span></div>
                            <div className="text-gray-400 mb-6">Perfect for beginners</div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    8 classes per month
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Access to group classes
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Online workout library
                                </li>
                            </ul>
                            <Link href="/packages" className="block w-full text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all">
                                View Details
                            </Link>
                        </div>

                        {/* Pro Package - Featured */}
                        <div className="glass p-8 rounded-2xl border-2 border-teal-500 relative hover:border-teal-400 transition-all transform scale-105">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                MOST POPULAR
                            </div>
                            <div className="text-sm text-teal-400 font-semibold mb-2">PRO</div>
                            <div className="text-4xl font-bold mb-2">$199<span className="text-lg text-gray-400">/mo</span></div>
                            <div className="text-gray-400 mb-6">For serious athletes</div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Unlimited classes
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    2 personal training sessions
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Nutrition consultation
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Priority booking
                                </li>
                            </ul>
                            <Link href="/packages" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                                Get Started
                            </Link>
                        </div>

                        {/* Elite Package */}
                        <div className="glass p-8 rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all">
                            <div className="text-sm text-teal-400 font-semibold mb-2">ELITE</div>
                            <div className="text-4xl font-bold mb-2">$299<span className="text-lg text-gray-400">/mo</span></div>
                            <div className="text-gray-400 mb-6">Maximum results</div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Everything in Pro
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    8 personal training sessions
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Custom meal plans
                                </li>
                                <li className="flex items-start gap-2 text-gray-300">
                                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    24/7 trainer support
                                </li>
                            </ul>
                            <Link href="/packages" className="block w-full text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all">
                                View Details
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 mt-8">
                        All plans include access to our online workout library and community support
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </h2>
                    <p className="text-center text-gray-400 mb-16">
                        Everything you need to know about getting started
                    </p>

                    <div className="space-y-4">
                        {/* FAQ 1 */}
                        <details className="glass rounded-lg group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer">
                                <span className="text-lg font-semibold text-white">Do I need any experience to join?</span>
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="px-6 pb-6 text-gray-400">
                                Not at all! We work with people of all fitness levels, from complete beginners to experienced athletes. Our trainers will customize your program to match your current abilities and goals.
                            </p>
                        </details>

                        {/* FAQ 2 */}
                        <details className="glass rounded-lg group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer">
                                <span className="text-lg font-semibold text-white">What if I need to cancel my membership?</span>
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="px-6 pb-6 text-gray-400">
                                We don't lock you into long-term contracts. You can cancel your membership at any time with 30 days notice. We also offer a money-back guarantee if you're not satisfied within the first month.
                            </p>
                        </details>

                        {/* FAQ 3 */}
                        <details className="glass rounded-lg group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer">
                                <span className="text-lg font-semibold text-white">How do I book classes?</span>
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="px-6 pb-6 text-gray-400">
                                Once you're a member, you can book classes through our online platform 24/7. Browse the schedule, pick your preferred time, and reserve your spot with just a few clicks.
                            </p>
                        </details>

                        {/* FAQ 4 */}
                        <details className="glass rounded-lg group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer">
                                <span className="text-lg font-semibold text-white">What equipment do I need?</span>
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="px-6 pb-6 text-gray-400">
                                We provide all the equipment you need. Just bring yourself, a water bottle, and comfortable workout clothes. For personal training sessions, your trainer will have everything ready for you.
                            </p>
                        </details>

                        {/* FAQ 5 */}
                        <details className="glass rounded-lg group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer">
                                <span className="text-lg font-semibold text-white">Can I try before I commit?</span>
                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="px-6 pb-6 text-gray-400">
                                Absolutely! Schedule a free consultation with one of our trainers. You'll get a facility tour, discuss your goals, and even try a complimentary session to see if we're the right fit for you.
                            </p>
                        </details>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-400 mb-4">Still have questions?</p>
                        <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Badges Section */}
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

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-teal-6 to-teal-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Start Your Transformation?</h2>
                    <p className="text-xl mb-8 text-white/90">
                        Join hundreds of clients who have achieved their fitness goals with Tidal Power.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
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
