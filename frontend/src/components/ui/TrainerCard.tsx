import Link from 'next/link';

interface TrainerCardProps {
    trainer: {
        id: string;
        user_id: string;
        first_name: string;
        last_name: string;
        bio: string;
        specialties: string[];
        certifications: string[];
        years_experience: number;
        profile_image_url?: string;
        is_accepting_clients: boolean;
    };
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
    return (
        <div className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all transform hover:scale-105 group">
            {/* Trainer Image */}
            <div className="relative h-80 bg-gradient-to-br from-teal-6 to-teal-6 overflow-hidden">
                {trainer.profile_image_url ? (
                    <img
                        src={trainer.profile_image_url}
                        alt={`${trainer.first_name} ${trainer.last_name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-7xl font-bold">
                        {trainer.first_name?.[0]}{trainer.last_name?.[0]}
                    </div>
                )}

                {/* Availability badge */}
                {trainer.is_accepting_clients ? (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Available
                    </div>
                ) : trainer.bio === 'Profile not yet completed' ? (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        Profile Incomplete
                    </div>
                ) : null}

                {/* Experience badge */}
                <div className="absolute bottom-4 left-4 glass backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold">
                    {trainer.years_experience}+ Years
                </div>
            </div>

            {/* Trainer Info */}
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">
                    {trainer.first_name} {trainer.last_name}
                </h3>

                {/* Bio */}
                <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{trainer.bio}</p>

                {/* Specialties */}
                {trainer.specialties && trainer.specialties.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                            {trainer.specialties.slice(0, 3).map((specialty, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-teal-6/20 text-teal-4 rounded-full text-xs font-medium"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {trainer.specialties.length > 3 && (
                                <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs font-medium">
                                    +{trainer.specialties.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {trainer.certifications && trainer.certifications.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                            {trainer.certifications.slice(0, 2).map((cert, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                                    <svg className="w-4 h-4 text-teal-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-2 mt-6">
                    <Link
                        href="/contact"
                        className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                    >
                        Book Session
                    </Link>
                    <button className="px-4 py-3 glass hover:bg-white/10 rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
