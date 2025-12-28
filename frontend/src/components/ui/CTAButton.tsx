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
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all active:scale-95';

    const variantStyles = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border-2 border-pacific-cyan text-turquoise-surf hover:bg-pacific-cyan/10 rounded-lg font-bold'
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <Link
            href={href}
            className={`${baseStyles} ${variantStyles[variant]} ${variant !== 'outline' ? '' : sizeStyles[size]} ${className}`}
        >
            {children}
            {icon && <span>{icon}</span>}
        </Link>
    );
}
