import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const liquidbuttonVariants = cva(
    'relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold text-white transition-transform duration-300 ease-in-out',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
            },
            size: {
                sm: 'px-6 py-2.5 text-xs',
                default: 'px-8 py-3 text-sm',
                lg: 'px-10 py-4 text-base',
                xl: 'px-12 py-5 text-lg',
                xxl: 'px-16 py-6 text-xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const GlassFilter = () => (
    <svg width="0" height="0" className="absolute">
        <defs>
            <filter id="container-glass">
                <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="10" result="noise"/>
                <feGaussianBlur in="noise" stdDeviation="8" result="blur"/>
                <feDisplacementMap in2="blur" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" result="displacement"/>
                <feGaussianBlur in="displacement" stdDeviation="4" result="final-blur"/>
                <feComposite in="final-blur" in2="SourceGraphic" operator="in"/>
            </filter>
        </defs>
    </svg>
);

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof liquidbuttonVariants> {
    asChild?: boolean;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp className={cn(liquidbuttonVariants({ variant, size, className }))} ref={ref} {...props}>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.2),_inset_0_-2px_4px_rgba(0,0,0,0.4)]"/>
                <div className="absolute inset-0.5 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,0.2),_inset_0_4px_3px_rgba(255,255,255,0.1),_inset_0_-4px_5px_rgba(0,0,0,0.5)]"/>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-[2px]" style={{ filter: 'url(#container-glass)' }}/>
                <div className="relative z-10">{children}</div>
                <GlassFilter />
            </Comp>
        );
    }
);
LiquidButton.displayName = 'LiquidButton';

export { LiquidButton, liquidbuttonVariants };
