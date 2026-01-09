'use client';

import React from 'react';
import { BlackGlassCard, CTAButton } from '@/components/ui';
import Link from 'next/link';

export default function StyleGuidePage() {
    return (
        <div className="min-h-screen bg-black page-container">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <Link href="/admin" className="text-turquoise-surf hover:underline mb-4 inline-block font-bold uppercase tracking-widest text-xs">
                        ← Back to Admin
                    </Link>
                    <h1 className="text-gradient">Visual Style Guide</h1>
                    <p className="text-gray-400 text-xl mt-4">Standardized tokens and components for the "Luxury Vault" aesthetic.</p>
                </header>

                <section className="mb-20">
                    <h2 className="border-b border-white/10 pb-4 mb-8">Color Palette (Tsunami)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="h-24 rounded-2xl bg-[#08acd6ff] border border-white/10"></div>
                            <p className="font-bold">Pacific Cyan</p>
                            <p className="text-xs text-gray-500">Primary / Pulses</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-2xl bg-[#18809eff] border border-white/10"></div>
                            <p className="font-bold">Cerulean</p>
                            <p className="text-xs text-gray-500">Secondary / Gradients</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-2xl bg-[#114b61ff] border border-white/10"></div>
                            <p className="font-bold">Dark Teal</p>
                            <p className="text-xs text-gray-500">Accents</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-24 rounded-2xl bg-[#ff4500] border border-white/10"></div>
                            <p className="font-bold">Flame Orange</p>
                            <p className="text-xs text-gray-500">Overload / 🔥</p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="border-b border-white/10 pb-4 mb-8">Typography</h2>
                    <div className="space-y-8">
                        <div>
                            <h1>Heading 1 (Black/900)</h1>
                            <p className="text-xs text-gray-500">Inter Black, -0.02em tracking</p>
                        </div>
                        <div>
                            <h2>Heading 2 (Bold/700)</h2>
                            <p className="text-xs text-gray-500">Inter Bold, -0.02em tracking</p>
                        </div>
                        <div>
                            <h3>Heading 3 (Bold/700)</h3>
                            <p className="text-xs text-gray-500">Inter Bold, -0.02em tracking</p>
                        </div>
                        <div className="max-w-2xl">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Body text uses Inter Regular or Medium. It is optimized for legibility under gym lighting conditions, with generous line heights and high contrast against the Obsidian Black background.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="border-b border-white/10 pb-4 mb-8">Base Components</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="uppercase tracking-widest text-xs text-gray-500 font-bold">Black Glass Card</h4>
                            <BlackGlassCard>
                                <h3 className="mb-2">Card Title</h3>
                                <p className="text-gray-400">This is a standard Black Glass card component. It features a backdrop blur, semi-transparent border, and subtle hover scale effect.</p>
                                <div className="mt-6 flex gap-3">
                                    <span className="px-3 py-1 bg-turquoise-surf/10 text-turquoise-surf text-[10px] font-bold uppercase rounded-full">Tag Example</span>
                                    <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase rounded-full">Secondary</span>
                                </div>
                            </BlackGlassCard>
                        </div>

                        <div className="space-y-6">
                            <h4 className="uppercase tracking-widest text-xs text-gray-500 font-bold">Action Buttons</h4>
                            <div className="flex flex-wrap gap-4">
                                <CTAButton variant="primary" href="#">Primary Action</CTAButton>
                                <CTAButton variant="secondary" href="#">Secondary Action</CTAButton>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10">
                                <p className="text-xs text-gray-500 italic">Buttons implement automatic scale-up on hover and Tsunami gradients.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
