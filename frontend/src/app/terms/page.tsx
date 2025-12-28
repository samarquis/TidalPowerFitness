import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-turquoise-surf hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">Terms of <span className="text-gradient">Service</span></h1>
                
                <div className="glass-card space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Token-Based Booking</h2>
                        <p className="leading-relaxed">
                            Class tokens are for personal use only and are non-transferable. One token is required for each class booking. Tokens must be used within the validity period specified at the time of purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Payment & Refunds</h2>
                        <p className="leading-relaxed">
                            All payments are processed securely through Square. Tokens must be purchased in advance of booking classes. Please note that all sales are final; we do not offer refunds for purchased tokens or unused credits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Health & Safety</h2>
                        <p className="leading-relaxed">
                            By participating in our training sessions or classes, you acknowledge that you are in good physical health and have no medical conditions that would prevent your safe participation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Code of Conduct</h2>
                        <p className="leading-relaxed">
                            We maintain a premium, respectful community environment. We reserve the right to terminate membership for behavior that is disruptive or disrespectful to other members or staff.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/5 text-sm text-gray-500">
                        Last Updated: December 28, 2025
                    </div>
                </div>
            </div>
        </div>
    );
}
