interface TransformationCardProps {
    name: string;
    beforeImage: string;
    afterImage: string;
    timeframe: string;
    stats: {
        label: string;
        value: string;
    }[];
    story?: string;
}

export default function TransformationCard({
    name,
    beforeImage,
    afterImage,
    timeframe,
    stats,
    story
}: TransformationCardProps) {
    return (
        <div className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all transform hover:scale-105">
            {/* Before/After Images */}
            <div className="grid grid-cols-2 gap-1 bg-black">
                <div className="relative aspect-[3/4]">
                    <img
                        src={beforeImage}
                        alt={`${name} before`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                        Before
                    </div>
                </div>
                <div className="relative aspect-[3/4]">
                    <img
                        src={afterImage}
                        alt={`${name} after`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        After
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{name}</h3>
                <p className="text-cyan-400 mb-4">{timeframe}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Story snippet */}
                {story && (
                    <p className="text-gray-400 text-sm line-clamp-3">{story}</p>
                )}
            </div>
        </div>
    );
}
