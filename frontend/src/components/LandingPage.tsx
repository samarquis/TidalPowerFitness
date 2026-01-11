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
import FadeIn from '@/components/ui/FadeIn';
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
            <section className="relative h-screen flex items-center justify-center overflow-hidden logo-watermark">
                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 md:pt-0">
                    <FadeIn direction="up">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
                            Transform Your Body,
                            <br />
                            <span className="text-gradient">Elevate Your Life</span>
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
                            Elite personal training tailored to your goals. Expert coaches, proven results, unstoppable you.
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <CTAButton
                                href="/register"
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                }
                            >
                                Start Free Consultation
                            </CTAButton>
                            <CTAButton href="/trainers" variant="secondary" size="lg" className="w-full sm:w-auto">
                                Meet Our Trainers
                            </CTAButton>
                        </div>
                    </FadeIn>

                    {/* Social proof badges */}
                    <FadeIn direction="up" delay={0.6}>
                        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm text-gray-500">
                            <div className="flex items-center">✓ No Long-term Commitments</div>
                            <div className="flex items-center">✓ Elite Coaching</div>
                            <div className="flex items-center">✓ Certified Trainers</div>
                        </div>
                    </FadeIn>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-turquoise-surf opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Class Schedule Section */}
            <ClassScheduleSection />

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
                            Why Choose <span className="text-gradient">Tidal Power</span>
                        </h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <FadeIn direction="up" delay={0.1}>
                            <div className="glass-card group">
                                <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-turquoise-surf/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Expert Trainers</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Certified professionals with years of experience in strength training, conditioning, and nutrition.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Feature 2 */}
                        <FadeIn direction="up" delay={0.2}>
                            <div className="glass-card group">
                                <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-turquoise-surf/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Personalized Programs</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Custom workout and nutrition plans designed specifically for your goals and fitness level.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Feature 3 */}
                        <FadeIn direction="up" delay={0.3}>
                            <div className="glass-card group">
                                <div className="w-16 h-16 bg-gradient-to-br from-pacific-cyan to-turquoise-surf rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-turquoise-surf/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Flexible Scheduling</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Book sessions that fit your schedule with our easy online booking system.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Trainer Bios Section */}
            <TrainerBiosSection />

            {/* Pricing Teaser Section */}
            <section className="py-24 bg-gradient-to-b from-background via-pacific-cyan/5 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6">
                            Class <span className="text-gradient">Packages</span>
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-20 max-w-2xl mx-auto text-lg">
                            Choose the package that works for you. Buy tokens and use them for any class.
                        </p>
                    </FadeIn>

                    {loadingPackages ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise-surf"></div>
                        </div>
                    ) : packages.length > 0 ? (
                        <>
                            <div className={`grid ${packages.length === 1 ? 'md:grid-cols-1 max-w-md' : packages.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3 max-w-6xl'} gap-8 mx-auto`}>
                                {packages.map((pkg, index) => {
                                    const isFeatured = index === 1 && packages.length === 3;

                                    return (
                                        <FadeIn key={pkg.id} direction="up" delay={index * 0.1}>
                                            <div
                                                className={`glass-card flex flex-col h-full relative group transition-all duration-500 ${isFeatured
                                                    ? 'border-turquoise-surf/50 shadow-[0_0_40px_rgba(8,172,214,0.15)] md:-translate-y-4'
                                                    : ''
                                                    }`}
                                            >
                                                {isFeatured && (
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cerulean to-pacific-cyan text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                                        Most Popular
                                                    </div>
                                                )}
                                                <div className="text-xs font-bold text-turquoise-surf uppercase tracking-widest mb-4">{pkg.name}</div>
                                                                                            <div className="flex items-baseline gap-1 mb-6">
                                                                                                <span className="text-5xl font-bold">${(pkg.price_cents / 100).toFixed(0)}</span>
                                                                                                <span className="text-gray-500 font-medium">/{pkg.validity_days} days</span>
                                                                                            </div>
                                                                                            <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-2 min-h-[3rem] text-sm">{pkg.description || 'Flexible class package for all fitness levels.'}</p>
                                                                                            
                                                                                            <ul className="space-y-4 mb-10 flex-1">
                                                                                                <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                                                    <span className="w-5 h-5 rounded-full bg-turquoise-surf/10 flex items-center justify-center shrink-0">
                                                                                                        <svg className="w-3 h-3 text-turquoise-surf" fill="currentColor" viewBox="0 0 20 20">
                                                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                    <span className="font-bold text-foreground">{pkg.credits}</span> Class Tokens
                                                                                                </li>                                                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="w-5 h-5 rounded-full bg-turquoise-surf/10 flex items-center justify-center shrink-0">
                                                            <svg className="w-3 h-3 text-turquoise-surf" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                        Group Class Access
                                                    </li>
                                                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="w-5 h-5 rounded-full bg-turquoise-surf/10 flex items-center justify-center shrink-0">
                                                            <svg className="w-3 h-3 text-turquoise-surf" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                        Online Library
                                                    </li>
                                                </ul>

                                                                    <Link
                                                                                                href="/packages"
                                                                                                className={`w-full text-center py-4 px-6 rounded-xl font-bold transition-all ${isFeatured
                                                                                                    ? 'bg-gradient-to-r from-cerulean to-pacific-cyan text-white shadow-lg shadow-turquoise-surf/30 hover:scale-105'
                                                                                                    : 'btn-secondary border border-white/10'
                                                                                                    }`}
                                                                                            >
                                                                                                {isFeatured ? 'Get Started Now' : 'Select Package'}
                                                                                            </Link>
                                                                                        </div>
                                                                                    </FadeIn>
                                                                                );
                                                                            })}
                                                                        </div>
                                                
                                                                        <FadeIn direction="up">
                                                                            <p className="text-center text-gray-500 mt-12 text-sm font-medium">
                                                                                ✓ No joining fees • ✓ Use tokens for any class • ✓ Professional guidance
                                                                            </p>
                                                                        </FadeIn>                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-8">No packages available at the moment.</p>
                            <Link href="/packages" className="btn-primary">
                                View All Options
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6">
                            Frequently Asked <span className="text-gradient">Questions</span>
                        </h2>
                        <p className="text-center text-gray-500 mb-20 text-lg">
                            Everything you need to know about getting started
                        </p>
                    </FadeIn>

                    <div className="space-y-4">
                        {/* FAQ 1 */}
                        <FadeIn direction="up" delay={0.1}>
                            <details className="glass-card group p-0">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="text-lg font-bold group-hover:text-turquoise-surf transition-colors">Do I need any experience to join?</span>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    Not at all! We work with people of all fitness levels, from complete beginners to experienced athletes. Our trainers will customize your program to match your current abilities and goals.
                                </div>
                            </details>
                        </FadeIn>

                        {/* FAQ 2 */}
                        <FadeIn direction="up" delay={0.2}>
                            <details className="glass-card group p-0">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="text-lg font-bold group-hover:text-turquoise-surf transition-colors">How do class tokens work?</span>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    Simply purchase a token package that fits your schedule. Each token can be used to book any group class or personal training session. Tokens have a validity period based on the package you choose.
                                </div>
                            </details>
                        </FadeIn>

                        {/* FAQ 3 */}
                        <FadeIn direction="up" delay={0.3}>
                            <details className="glass-card group p-0">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="text-lg font-bold group-hover:text-turquoise-surf transition-colors">How do I book classes?</span>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    Once you're a member, you can book classes through our online platform 24/7. Browse the schedule, pick your preferred time, and reserve your spot with just a few clicks.
                                </div>
                            </details>
                        </FadeIn>

                        {/* FAQ 4 */}
                        <FadeIn direction="up" delay={0.4}>
                            <details className="glass-card group p-0">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="text-lg font-bold group-hover:text-turquoise-surf transition-colors">What equipment do I need?</span>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    We provide all the equipment you need. Just bring yourself, a water bottle, and comfortable workout clothes. For personal training sessions, your trainer will have everything ready for you.
                                </div>
                            </details>
                        </FadeIn>

                        {/* FAQ 5 */}
                        <FadeIn direction="up" delay={0.5}>
                            <details className="glass-card group p-0">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="text-lg font-bold group-hover:text-turquoise-surf transition-colors">Can I try before I commit?</span>
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    Absolutely! Schedule a free consultation with one of our trainers. You'll get a facility tour, discuss your goals, and even try a complimentary session to see if we're the right fit for you.
                                </div>
                            </details>
                        </FadeIn>
                    </div>

                    <FadeIn direction="up" delay={0.6}>
                        <div className="text-center mt-16">
                            <p className="text-gray-500 mb-6 font-medium tracking-wide uppercase text-xs">Still have questions?</p>
                            <Link href="/contact" className="btn-secondary px-10 py-4">
                                Contact Our Team
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Trust Badges Section */}
            <section className="py-16 bg-gradient-to-b from-background to-pacific-cyan/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-center text-gray-500 mb-8 uppercase tracking-widest text-sm font-bold">Trusted & Certified</h3>
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
                    <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Transformation?</h2>
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
