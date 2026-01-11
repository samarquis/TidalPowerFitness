interface ClassCardProps {
    id: string;
    name: string;
    description: string;
    category: string;
    instructorName: string;
    dayOfWeek: number;
    startTime: string;
    durationMinutes: number;
    maxCapacity: number;
    priceCents: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ClassCard({
    id,
    name,
    description,
    category,
    instructorName,
    dayOfWeek,
    startTime,
    durationMinutes,
    maxCapacity,
    priceCents
}: ClassCardProps) {
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    return (
        <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105">
            {/* Category badge */}
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-pacific-cyan/20 text-turquoise-surf rounded-full text-sm font-semibold">
                    {category}
                </span>
                <span className="text-2xl font-bold text-turquoise-surf">
                    {formatPrice(priceCents)}
                </span>
            </div>

            {/* Class name */}
            <h3 className="text-2xl font-bold mb-2">{name}</h3>

            {/* Instructor */}
            <p className="text-gray-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {instructorName}
            </p>

            {/* Description */}
            <p className="text-gray-300 mb-6 line-clamp-3">
                {description}
            </p>

            {/* Schedule info */}
            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{DAYS[dayOfWeek]}s at {formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Max {maxCapacity} spots</span>
                </div>
            </div>

            {/* Book button */}
            <a
                href="https://app.acuityscheduling.com/schedule/cf017c84"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-gradient-to-r from-cerulean to-pacific-cyan hover:from-dark-teal hover:to-dark-teal text-white font-bold rounded-lg text-center transition-all transform hover:scale-105"
            >
                Book This Class
            </a>
        </div>
    );
}
