import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

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
    // Removed active:scale-95 from baseStyles as Framer Motion handles it
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-colors';

    const variantStyles = {
        primary: 'btn-primary hover:!transform-none', // Disable CSS transform to let Motion handle it
        secondary: 'btn-secondary hover:!transform-none',
        outline: 'border-2 border-pacific-cyan text-turquoise-surf hover:bg-pacific-cyan/10 rounded-lg font-bold'
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <MotionLink
            href={href}
            className={`${baseStyles} ${variantStyles[variant]} ${variant !== 'outline' ? '' : sizeStyles[size]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {children}
            {icon && <span>{icon}</span>}
        </MotionLink>
    );
}
