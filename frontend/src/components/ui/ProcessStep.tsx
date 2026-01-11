interface ProcessStepProps {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isLast?: boolean;
}

export default function ProcessStep({
    number,
    title,
    description,
    icon,
    isLast = false
}: ProcessStepProps) {
    return (
        <div className="relative flex flex-col items-center text-center">
            {/* Icon circle */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pacific-cyan to-turquoise-surf flex items-center justify-center mb-4 shadow-lg shadow-pacific-cyan/50 relative z-10">
                {icon}
            </div>

            {/* Connecting line */}
            {!isLast && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-pacific-cyan/50 to-transparent -z-0" />
            )}

            {/* Number badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-pacific-cyan flex items-center justify-center font-bold text-sm z-20">
                {number}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400 max-w-xs">{description}</p>
        </div>
    );
}
