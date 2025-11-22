'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        form_type: 'contact',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await apiClient.submitForm({
            form_type: 'contact',
            form_data: formData,
        });

        if (response.data) {
            setSubmitted(true);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                message: '',
                form_type: 'contact',
            });
        } else {
            setError(response.error || 'Failed to submit form');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Get In <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Ready to start your fitness journey? We're here to help.
                    </p>
                </div>

                {/* Contact Form */}
                <div className="glass rounded-2xl p-8 md:p-12">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                            <p className="text-gray-400 mb-8">
                                Thank you for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="btn-primary"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-cyan-600/20 border border-cyan-600 text-cyan-400 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-semibold mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-semibold mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors resize-none"
                                    placeholder="Tell us about your fitness goals..."
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full btn-primary text-lg">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* Contact Info */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                    <div className="glass p-6 rounded-xl">
                        <svg className="w-8 h-8 text-cyan-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-400 text-sm">info@titanpower.com</p>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <svg className="w-8 h-8 text-cyan-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-400 text-sm">(555) 123-4567</p>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <svg className="w-8 h-8 text-cyan-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-semibold mb-1">Hours</h3>
                        <p className="text-gray-400 text-sm">Mon-Fri: 6AM-9PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
