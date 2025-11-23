import Link from 'next/link';

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    className?: string;
}

export default function CTAButton({
    href,
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = ''
}: CTAButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-teal-6 to-teal-6 hover:from-teal-700 hover:to-teal-700 text-white shadow-lg shadow-teal-5/50',
        secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20',
        outline: 'border-2 border-teal-5 text-teal-4 hover:bg-teal-5/10'
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <Link
            href={href}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {children}
            {icon && <span>{icon}</span>}
        </Link>
    );
}
