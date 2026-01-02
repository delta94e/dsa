"use client";

/**
 * SplitDialog Component
 *
 * A dialog with a split layout - media on left, content on right.
 * Matches production bundle module 139211.
 */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// SplitDialog (Root)
// ============================================================================

const SplitDialog = DialogPrimitive.Root;

// ============================================================================
// SplitDialogTrigger
// ============================================================================

const SplitDialogTrigger = DialogPrimitive.Trigger;

// ============================================================================
// SplitDialogPortal
// ============================================================================

const SplitDialogPortal = DialogPrimitive.Portal;

// ============================================================================
// SplitDialogOverlay
// ============================================================================

const SplitDialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SplitDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ============================================================================
// SplitDialogContent
// ============================================================================

const SplitDialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SplitDialogPortal>
    <SplitDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl overflow-hidden",
        "grid-cols-1 md:grid-cols-[320px_1fr]",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SplitDialogPortal>
));
SplitDialogContent.displayName = DialogPrimitive.Content.displayName;

// ============================================================================
// SplitDialogCloseButton
// ============================================================================

const SplitDialogCloseButton = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
SplitDialogCloseButton.displayName = "SplitDialogCloseButton";

// ============================================================================
// SplitDialogMedia (Left side)
// ============================================================================

interface SplitDialogMediaProps {
  children: ReactNode;
  className?: string;
}

const SplitDialogMedia = forwardRef<HTMLDivElement, SplitDialogMediaProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative hidden md:block bg-surface-secondary overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
);
SplitDialogMedia.displayName = "SplitDialogMedia";

// ============================================================================
// SplitDialogMediaOverlay
// ============================================================================

interface SplitDialogMediaOverlayProps {
  children: ReactNode;
  className?: string;
}

const SplitDialogMediaOverlay = forwardRef<
  HTMLDivElement,
  SplitDialogMediaOverlayProps
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-t from-black/60 to-transparent",
      className
    )}
  >
    {children}
  </div>
));
SplitDialogMediaOverlay.displayName = "SplitDialogMediaOverlay";

// ============================================================================
// SplitDialogMain (Right side)
// ============================================================================

interface SplitDialogMainProps {
  children: ReactNode;
  className?: string;
}

const SplitDialogMain = forwardRef<HTMLDivElement, SplitDialogMainProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex flex-col min-h-[400px]", className)}
    >
      {children}
    </div>
  )
);
SplitDialogMain.displayName = "SplitDialogMain";

// ============================================================================
// SplitDialogHeader
// ============================================================================

const SplitDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center px-6 pt-6", className)}
    {...props}
  />
);
SplitDialogHeader.displayName = "SplitDialogHeader";

// ============================================================================
// SplitDialogTitle
// ============================================================================

const SplitDialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
SplitDialogTitle.displayName = DialogPrimitive.Title.displayName;

// ============================================================================
// SplitDialogBody
// ============================================================================

const SplitDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 px-6", className)} {...props} />
);
SplitDialogBody.displayName = "SplitDialogBody";

// ============================================================================
// SplitDialogFooter
// ============================================================================

const SplitDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pb-6", className)} {...props} />
);
SplitDialogFooter.displayName = "SplitDialogFooter";

// ============================================================================
// SplitDialogIconBadge
// ============================================================================

interface SplitDialogIconBadgeProps {
  children: ReactNode;
  className?: string;
}

const SplitDialogIconBadge = forwardRef<
  HTMLDivElement,
  SplitDialogIconBadgeProps
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary mb-4",
      className
    )}
  >
    {children}
  </div>
));
SplitDialogIconBadge.displayName = "SplitDialogIconBadge";

// ============================================================================
// Exports
// ============================================================================

export {
  SplitDialog,
  SplitDialogTrigger,
  SplitDialogPortal,
  SplitDialogOverlay,
  SplitDialogContent,
  SplitDialogCloseButton,
  SplitDialogMedia,
  SplitDialogMediaOverlay,
  SplitDialogMain,
  SplitDialogHeader,
  SplitDialogTitle,
  SplitDialogBody,
  SplitDialogFooter,
  SplitDialogIconBadge,
};
