"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon } from "@/components/icons/CloseIcon";

// ============================================================================
// Re-export Radix Primitives
// ============================================================================

const Popover = PopoverPrimitive.Root;
Popover.displayName = "Popover";

const PopoverAnchor = PopoverPrimitive.Anchor;
PopoverAnchor.displayName = "PopoverAnchor";

const PopoverArrow = PopoverPrimitive.Arrow;
PopoverArrow.displayName = "PopoverArrow";

const PopoverClose = PopoverPrimitive.Close;
PopoverClose.displayName = "PopoverClose";

// ============================================================================
// PopoverTrigger (with asChild default to true)
// ============================================================================

interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {
  asChild?: boolean;
}

function PopoverTrigger({ asChild = true, ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger asChild={asChild} {...props} />;
}
PopoverTrigger.displayName = "PopoverTrigger";

// ============================================================================
// PopoverContent Variants (CVA)
// ============================================================================

const popoverContentVariants = cva(
  [
    // Animations
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    // Base styles
    "z-50",
    "text-white",
    "bg-[#0d0f14]",
    "shadow-lg shadow-black/20",
    "relative",
    "mx-0.5",
    "w-72",
    "origin-[var(--radix-popover-content-transform-origin)]",
    "rounded-lg",
    "border",
    "px-5",
    "py-6",
    "outline-none",
  ],
  {
    variants: {
      variant: {
        default: "border-white/10",
        gradient: [
          "border-transparent",
          "[background:linear-gradient(#0d0f14,#0d0f14)_padding-box,linear-gradient(to_right,#a855f7,#ec4899,#a855f7)_border-box]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ============================================================================
// PopoverContent
// ============================================================================

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  arrow?: boolean;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant,
      children,
      arrow,
      ...props
    },
    ref
  ) => {
    const isGradient = variant === "gradient";

    // Warn if arrow is used with gradient variant
    if (isGradient && arrow !== undefined) {
      console.warn(
        "PopoverContent: Arrow prop is not available for the gradient variant. " +
          "The gradient border creates a unified visual object that would be disrupted by a separate arrow element."
      );
    }

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          data-slot="popover-content"
          sideOffset={sideOffset}
          className={cn(popoverContentVariants({ variant }), className)}
          {...props}
        >
          {children}
          {/* Only show arrow for non-gradient variants */}
          {!isGradient && (arrow ?? true) && (
            <PopoverPrimitive.Arrow
              data-slot="popover-arrow"
              width={20}
              height={12}
              className="fill-[#0d0f14]"
            />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

// ============================================================================
// PopoverCloseButton
// ============================================================================

interface PopoverCloseButtonProps
  extends React.ComponentPropsWithoutRef<typeof IconButton> {}

function PopoverCloseButton({ className, ...props }: PopoverCloseButtonProps) {
  return (
    <PopoverPrimitive.Close asChild>
      <IconButton
        data-slot="popover-close-button"
        size="sm"
        className={cn("absolute top-2 right-2 rounded-full", className)}
        variant="ghost"
        aria-label="Close"
        {...props}
      >
        <CloseIcon className="size-4" />
        <span className="sr-only">Close Popover</span>
      </IconButton>
    </PopoverPrimitive.Close>
  );
}
PopoverCloseButton.displayName = "PopoverCloseButton";

// ============================================================================
// Exports
// ============================================================================

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
};
