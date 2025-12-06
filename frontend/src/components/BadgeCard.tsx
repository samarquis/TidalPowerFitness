import React from 'react';

interface BadgeCardProps {
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ name, description, icon, earned, earnedDate }) => {
    return (
        <div className={`relative group p-6 rounded-xl border transition-all duration-300 ${earned
                ? 'bg-gradient-to-br from-teal-900/40 to-black border-teal-500/30 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                : 'bg-black/40 border-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
            }`}>
            {/* Glow Effect for Earned Badges */}
            {earned && (
                <div className="absolute inset-0 bg-teal-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            <div className="relative flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 ${earned ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-gray-500'
                    }`}>
                    {icon || '🏆'}
                </div>

                <h3 className={`font-bold text-lg mb-2 ${earned ? 'text-white' : 'text-gray-400'}`}>
                    {name}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {description}
                </p>

                {earned ? (
                    <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/20">
                            Earned on {new Date(earnedDate!).toLocaleDateString()}
                        </span>
                    </div>
                ) : (
                    <div className="mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-500 border border-white/10">
                            Locked
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BadgeCard;
