'use client';

import { useState } from 'react';
import { TransformationCard } from '@/components/ui';

// Sample success stories data
const successStories = [
    {
        id: '1',
        name: 'Sarah Mitchell',
        age: 34,
        goal: 'Weight Loss',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '6 Months',
        stats: [
            { label: 'Weight Lost', value: '45 lbs' },
            { label: 'Body Fat', value: '-12%' }
        ],
        story: 'After having my second child, I struggled to lose the baby weight. Tidal Power gave me the structure and support I needed. My trainer created a realistic plan that fit my busy mom schedule.',
        fullStory: 'I never thought I could get back to my pre-pregnancy weight, let alone surpass it. The trainers at Tidal Power understood my challenges as a working mom and created a program that actually worked with my life. Six months later, I\'m stronger and more confident than ever. The best part? My kids see me prioritizing health, and that\'s the best example I can set.',
        trainer: 'Coach Mike',
        testimonial: 'Tidal Power changed my life. I have energy to play with my kids and confidence I haven\'t felt in years.'
    },
    {
        id: '2',
        name: 'James Rodriguez',
        age: 42,
        goal: 'Muscle Building',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '12 Weeks',
        stats: [
            { label: 'Muscle Gained', value: '18 lbs' },
            { label: 'Strength', value: '+95%' }
        ],
        story: 'I wanted to build muscle but didn\'t know where to start. My trainer taught me proper form and created a progressive program that delivered incredible results.',
        fullStory: 'At 42, I thought my best years were behind me. I was wrong. With expert guidance from Tidal Power, I built more muscle in 12 weeks than I did in years of trying on my own. The personalized nutrition plan and progressive training program were game-changers. Now I\'m lifting weights I never thought possible.',
        trainer: 'Coach Amanda',
        testimonial: 'Age is just a number. Tidal Power proved that to me. I\'m in the best shape of my life at 42.'
    },
    {
        id: '3',
        name: 'Emily Chen',
        age: 28,
        goal: 'Athletic Performance',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '16 Weeks',
        stats: [
            { label: 'Marathon Time', value: '-45 min' },
            { label: 'VO2 Max', value: '+22%' }
        ],
        story: 'Training for my first marathon seemed impossible. My trainer created a structured plan that built my endurance safely and effectively.',
        fullStory: 'I went from barely being able to run a 5K to completing a marathon in under 4 hours. The trainers at Tidal Power didn\'t just help me run faster—they taught me how to train smart, prevent injuries, and push past mental barriers. The journey was challenging but incredibly rewarding.',
        trainer: 'Coach David',
        testimonial: 'From couch to marathon finisher. Tidal Power made the impossible possible.'
    },
    {
        id: '4',
        name: 'Marcus Thompson',
        age: 55,
        goal: 'Health & Wellness',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '20 Weeks',
        stats: [
            { label: 'Weight Lost', value: '60 lbs' },
            { label: 'Blood Pressure', value: 'Normal' }
        ],
        story: 'My doctor told me I needed to make changes or face serious health consequences. Tidal Power helped me transform my life.',
        fullStory: 'At 55, I was pre-diabetic, had high blood pressure, and was 60 pounds overweight. My doctor\'s warning was a wake-up call. Tidal Power gave me the tools, knowledge, and support to completely transform my health. Five months later, I\'m off my blood pressure medication, my blood sugar is normal, and I feel 20 years younger.',
        trainer: 'Coach Lisa',
        testimonial: 'Tidal Power didn\'t just change my body—they saved my life. I\'m healthier at 55 than I was at 35.'
    },
    {
        id: '5',
        name: 'Jessica Park',
        age: 31,
        goal: 'Strength & Confidence',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '14 Weeks',
        stats: [
            { label: 'Deadlift PR', value: '225 lbs' },
            { label: 'Muscle Gained', value: '12 lbs' }
        ],
        story: 'I was intimidated by the weight room. My trainer taught me that strength training is empowering, not intimidating.',
        fullStory: 'I used to avoid the weight room because I felt like I didn\'t belong. My trainer at Tidal Power changed everything. She taught me proper technique, celebrated every PR, and helped me build confidence along with muscle. Now I\'m deadlifting 225 pounds and inspiring other women to pick up weights.',
        trainer: 'Coach Sarah',
        testimonial: 'Tidal Power taught me that strong is beautiful. I\'ve never felt more powerful or confident.'
    },
    {
        id: '6',
        name: 'David Martinez',
        age: 38,
        goal: 'Complete Transformation',
        beforeImage: '/api/placeholder/400/600',
        afterImage: '/api/placeholder/400/600',
        timeframe: '24 Weeks',
        stats: [
            { label: 'Weight Lost', value: '75 lbs' },
            { label: 'Body Fat', value: '-18%' }
        ],
        story: 'I was at my lowest point—overweight, unhappy, and unhealthy. Tidal Power gave me a second chance at life.',
        fullStory: 'Two years ago, I couldn\'t walk up stairs without getting winded. I was depressed, overweight, and felt hopeless. Tidal Power didn\'t just give me a workout plan—they gave me a support system. My trainer believed in me when I didn\'t believe in myself. Six months of hard work later, I\'m 75 pounds lighter, running 5Ks, and living life to the fullest.',
        trainer: 'Coach Mike',
        testimonial: 'Tidal Power gave me my life back. I\'m forever grateful for their support and expertise.'
    }
];

const goalCategories = ['All Stories', 'Weight Loss', 'Muscle Building', 'Athletic Performance', 'Health & Wellness', 'Strength & Confidence', 'Complete Transformation'];

export default function SuccessStoriesPage() {
    const [selectedGoal, setSelectedGoal] = useState('All Stories');
    const [selectedStory, setSelectedStory] = useState<typeof successStories[0] | null>(null);

    const filteredStories = selectedGoal === 'All Stories'
        ? successStories
        : successStories.filter(story => story.goal === selectedGoal);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        Success <span className="text-gradient">Stories</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Real people. Real transformations. Real results. See how our clients achieved their fitness goals with dedication and expert guidance.
                    </p>
                </div>

                {/* Filter by goal */}
                <div className="mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {goalCategories.map((goal) => (
                            <button
                                key={goal}
                                onClick={() => setSelectedGoal(goal)}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedGoal === goal
                                        ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white shadow-lg'
                                        : 'glass hover:bg-white/10'
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-8 text-center text-gray-400">
                    Showing {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
                </div>

                {/* Stories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {filteredStories.map((story) => (
                        <div key={story.id} onClick={() => setSelectedStory(story)} className="cursor-pointer">
                            <TransformationCard
                                name={story.name}
                                beforeImage={story.beforeImage}
                                afterImage={story.afterImage}
                                timeframe={story.timeframe}
                                stats={story.stats}
                                story={story.story}
                            />
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center glass rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Write <span className="text-gradient">Your Success Story?</span>
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        These transformations didn't happen by accident. They're the result of personalized training, expert guidance, and unwavering support. Your story starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/register"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                        >
                            Start Your Transformation
                        </a>
                        <a
                            href="/trainers"
                            className="inline-block px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-lg text-lg transition-all border border-white/20"
                        >
                            Meet Our Trainers
                        </a>
                    </div>
                </div>
            </div>

            {/* Story Modal */}
            {selectedStory && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedStory(null)}
                >
                    <div
                        className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedStory(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full glass hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold mb-2">{selectedStory.name}'s Journey</h2>
                                <p className="text-teal-4 text-lg">{selectedStory.goal} • {selectedStory.timeframe}</p>
                            </div>

                            {/* Before/After Images */}
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                                    <img src={selectedStory.beforeImage} alt="Before" className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
                                        Before
                                    </div>
                                </div>
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                                    <img src={selectedStory.afterImage} alt="After" className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-6 to-teal-6 px-4 py-2 rounded-full font-semibold">
                                        After
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {selectedStory.stats.map((stat, index) => (
                                    <div key={index} className="glass rounded-xl p-6 text-center">
                                        <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                                        <div className="text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Full Story */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-4">The Journey</h3>
                                <p className="text-gray-300 leading-relaxed text-lg">{selectedStory.fullStory}</p>
                            </div>

                            {/* Testimonial */}
                            <div className="glass rounded-xl p-6 mb-8">
                                <svg className="w-10 h-10 text-teal-4 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-xl italic text-gray-200 mb-4">"{selectedStory.testimonial}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-6 to-teal-6 flex items-center justify-center text-white font-bold">
                                        {selectedStory.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold">{selectedStory.name}</div>
                                        <div className="text-sm text-gray-400">Trained by {selectedStory.trainer}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <a
                                    href="/register"
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105"
                                >
                                    Start Your Journey Today
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
