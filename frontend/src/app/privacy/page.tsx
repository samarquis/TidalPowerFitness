import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-turquoise-surf hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">Privacy <span className="text-gradient">Policy</span></h1>
                
                <div className="glass-card space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="leading-relaxed">
                            We collect personal information that you provide to us, including your name, email address, phone number, and fitness goals when you register for an account or contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="leading-relaxed">
                            Your information is used to provide personal training services, manage class tokens and bookings, process payments through our partners (Square), and communicate important updates about your sessions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p className="leading-relaxed">
                            We implement robust security measures, including HttpOnly cookies and CSRF protection, to safeguard your data. We never store your full payment card details on our servers; these are handled securely by Square.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                        <p className="leading-relaxed">
                            We use Acuity Scheduling for calendar management and Square for payment processing. These services have their own privacy policies governing your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                        <p className="leading-relaxed">
                            You have the right to access, update, or delete your personal information at any time through your profile settings or by contacting us directly.
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
