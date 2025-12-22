'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClassScheduleSection from '@/components/ClassScheduleSection';
import TrainerBiosSection from '@/components/TrainerBiosSection';
import {
    CTAButton,
    TrustBadge,
    ProcessStep
} from '@/components/ui';
import { apiClient } from '@/lib/api';

interface Package {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    credits: number;
    validity_days: number;
    is_active: boolean;
}

export default function LandingPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loadingPackages, setLoadingPackages] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await apiClient.getPackages();
                if (response.data) {
                    // Get active packages and sort by price
                    const activePackages = response.data
                        .filter((pkg: Package) => pkg.is_active)
                        .sort((a: Package, b: Package) => a.price_cents - b.price_cents);
                    setPackages(activePackages.slice(0, 3)); // Show top 3 packages
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setLoadingPackages(false);
            }
        };

        fetchPackages();
    }, []);
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pacific-cyan rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pacific-cyan rounded-full filter blur-3xl animate-pulse delay-1000"></div>
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

            {/* Features Section */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Why Choose <span className="text-gradient">Tidal Power</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-xl flex items-center justify-center mb-6">
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
                            <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-xl flex items-center justify-center mb-6">
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
                            <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-xl flex items-center justify-center mb-6">
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

            {/* Pricing Teaser Section */}
            <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Flexible <span className="text-gradient">Membership Options</span>
                    </h2>
                    <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
                        Choose the plan that works for you. No long-term contracts, cancel anytime.
                    </p>

                    {loadingPackages ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        </div>
                    ) : packages.length > 0 ? (
                        <>
                            <div className={`grid ${packages.length === 1 ? 'md:grid-cols-1 max-w-md' : packages.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3 max-w-5xl'} gap-8 mx-auto`}>
                                {packages.map((pkg, index) => {
                                    const isFeatured = index === 1 && packages.length === 3; // Middle package in 3-pack
                                    const isMiddle = index === 1;

                                    return (
                                        <div
                                            key={pkg.id}
                                            className={`glass p-8 rounded-2xl relative hover:border-turquoise-surf transition-all ${isFeatured
                                                ? 'border-2 border-pacific-cyan transform scale-105'
                                                : 'border border-white/10 hover:border-pacific-cyan/50'
                                                }`}
                                        >
                                            {isFeatured && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pacific-cyan to-cerulean text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                    MOST POPULAR
                                                </div>
                                            )}
                                            <div className="text-sm text-turquoise-surf font-semibold mb-2 uppercase">{pkg.name}</div>
                                            <div className="text-4xl font-bold mb-2">
                                                ${(pkg.price_cents / 100).toFixed(0)}
                                                <span className="text-lg text-gray-400">/{pkg.validity_days} days</span>
                                            </div>
                                            <div className="text-gray-400 mb-6">{pkg.description || 'Flexible membership'}</div>
                                            <ul className="space-y-3 mb-8">
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <svg className="w-5 h-5 text-turquoise-surf flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {pkg.credits} class credits
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <svg className="w-5 h-5 text-turquoise-surf flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Valid for {pkg.validity_days} days
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <svg className="w-5 h-5 text-turquoise-surf flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Access to all group classes
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <svg className="w-5 h-5 text-turquoise-surf flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Online workout library
                                                </li>
                                            </ul>
                                            <Link
                                                href="/packages"
                                                className={`block w-full text-center px-6 py-3 font-semibold rounded-lg transition-all transform hover:scale-105 ${isFeatured
                                                    ? 'bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white'
                                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                                    }`}
                                            >
                                                {isFeatured ? 'Get Started' : 'View Details'}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-center text-gray-400 mt-8">
                                All plans include access to our online workout library and community support
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-6">No packages available at the moment.</p>
                            <Link href="/packages" className="inline-block px-8 py-3 bg-cerulean hover:bg-dark-teal text-white font-semibold rounded-lg transition-all">
                                View All Packages
                            </Link>
                        </div>
                    )}
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
                        <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-semibold rounded-lg transition-all transform hover:scale-105">
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
            <section className="py-20 bg-gradient-to-r from-pacific-cyan to-turquoise-surf">
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
