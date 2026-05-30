"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs px-4",
        lg: "h-10 px-6",
        xl: "h-12 px-8",
        xxl: "h-14 px-10 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "xxl" },
  }
)

export function LiquidButton({
  className, variant, size, asChild = false, children, ...props
}: React.ComponentProps<"button"> & VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp
        className={cn("relative", liquidbuttonVariants({ variant, size, className }))}
        {...props}
      >
        {/* Glass orb shadow layer */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"9999px",
          boxShadow:`0 0 6px rgba(0,0,0,0.03),
            0 2px 6px rgba(0,0,0,0.08),
            inset 3px 3px 0.5px -3px rgba(255,255,255,0.3),
            inset -3px -3px 0.5px -3px rgba(255,255,255,0.85),
            inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
            inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
            inset 0 0 6px 6px rgba(255,255,255,0.08),
            inset 0 0 2px 2px rgba(255,255,255,0.04),
            0 0 20px rgba(255,59,31,0.2)`,
          background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.15)",
          transition:"all 0.3s",
          zIndex:0,
        }} />
        {/* Backdrop distortion */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"9999px",
          backdropFilter:'url("#container-glass") blur(4px)',
          WebkitBackdropFilter:'blur(4px)',
          zIndex:-1, overflow:"hidden",
        }} />
        {/* Content */}
        <div style={{ position:"relative", zIndex:10, pointerEvents:"none" }}>
          {children}
        </div>
        <GlassFilter />
      </Comp>
    </>
  )
}

function GlassFilter() {
  return (
    <svg style={{ display:"none" }}>
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/>
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/>
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur"/>
          <feComposite in="finalBlur" in2="finalBlur" operator="over"/>
        </filter>
      </defs>
    </svg>
  );
}

export { liquidbuttonVariants }
