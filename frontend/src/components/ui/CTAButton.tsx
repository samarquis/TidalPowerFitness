import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);
const MotionButton = motion.button;

interface CTAButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export default function CTAButton({
    href,
    onClick,
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    disabled = false,
    type = 'button'
}: CTAButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'btn-primary hover:!transform-none',
        secondary: 'btn-secondary hover:!transform-none',
        outline: 'border border-turquoise-surf/30 text-turquoise-surf hover:bg-turquoise-surf/10 rounded-xl font-bold',
        ghost: 'btn-ghost hover:!transform-none',
        danger: 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 rounded-xl font-bold'
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        icon: 'p-2.5 rounded-xl'
    };

    const content = (
        <>
            {children}
            {icon && <span className={children ? 'ml-1' : ''}>{icon}</span>}
        </>
    );

    const animationProps = {
        whileHover: disabled ? {} : { scale: 1.05 },
        whileTap: disabled ? {} : { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 }
    };

    if (href) {
        return (
            <MotionLink
                href={href}
                className={`${baseStyles} ${variantStyles[variant]} ${variant === 'outline' || variant === 'danger' ? sizeStyles[size] : ''} ${className}`}
                {...animationProps}
            >
                {content}
            </MotionLink>
        );
    }

    return (
        <MotionButton
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${variant === 'outline' || variant === 'danger' ? sizeStyles[size] : ''} ${className}`}
            {...animationProps}
        >
            {content}
        </MotionButton>
    );
}
