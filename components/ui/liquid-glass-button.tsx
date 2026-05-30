"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none select-none",
  {
    variants: {
      variant: {
        default: "text-white hover:scale-[1.03] active:scale-[0.98] duration-300",
      },
      size: {
        sm:      "h-9 px-6 text-sm",
        default: "h-11 px-8 text-sm",
        lg:      "h-13 px-10 text-base",
        xl:      "h-14 px-12 text-base",
        xxl:     "h-16 px-14 text-lg tracking-wide",
        icon:    "size-11",
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
      <Comp className={cn("relative group", liquidbuttonVariants({ variant, size, className }))} {...props}>
        {/* Outer glass ring */}
        <span style={{
          position:"absolute", inset:0, borderRadius:"9999px",
          background:"linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.08) 100%)",
          border:"1px solid rgba(255,255,255,0.18)",
          boxShadow:`
            0 0 0 1px rgba(255,255,255,0.06),
            0 2px 8px rgba(0,0,0,0.25),
            0 8px 32px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 0 60px rgba(232,73,15,0.12)
          `,
          transition:"all 0.3s ease",
          zIndex:0,
        }} />
        {/* Frosted inner layer */}
        <span style={{
          position:"absolute", inset:"1px", borderRadius:"9999px",
          backdropFilter:"blur(12px) saturate(1.5)",
          WebkitBackdropFilter:"blur(12px) saturate(1.5)",
          background:"rgba(255,255,255,0.04)",
          zIndex:-1,
        }} />
        {/* Highlight arc */}
        <span style={{
          position:"absolute", top:1, left:"10%", right:"10%", height:"40%",
          borderRadius:"9999px 9999px 0 0",
          background:"linear-gradient(180deg, rgba(255,255,255,0.12), transparent)",
          zIndex:1, pointerEvents:"none",
        }} />
        {/* Content */}
        <span style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:8 }}>
          {children}
        </span>
        <GlassFilter />
      </Comp>
    </>
  )
}

function GlassFilter() {
  return (
    <svg style={{ display:"none", position:"absolute" }} aria-hidden="true">
      <defs>
        <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="2" seed="2" result="noise"/>
          <feGaussianBlur in="noise" stdDeviation="1.5" result="blur"/>
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1" result="final"/>
          <feComposite in="final" in2="SourceGraphic" operator="over"/>
        </filter>
      </defs>
    </svg>
  );
}

export { liquidbuttonVariants }
