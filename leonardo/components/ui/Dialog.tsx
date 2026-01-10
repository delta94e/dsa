"use client";

/**
 * Dialog Component
 *
 * A modal dialog component with size variants.
 * Matches production bundle module 566447.
 */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  createContext,
  useMemo,
  use,
  Fragment,
  type ReactNode,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { IconButton } from "@chakra-ui/react";
import { TimesIcon } from "@/components/icons";

// ============================================================================
// Context
// ============================================================================

interface DialogContextValue {
  size: "sm" | "default" | "lg";
}

const DialogContext = createContext<DialogContextValue>({ size: "default" });

// ============================================================================
// Dialog (Root)
// ============================================================================

interface DialogProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  children: ReactNode;
  size?: "sm" | "default" | "lg";
}

function Dialog({ children, size = "default", ...props }: DialogProps) {
  const contextValue = useMemo(() => ({ size }), [size]);

  return (
    <DialogContext.Provider value={contextValue}>
      <DialogPrimitive.Root data-slot="dialog" {...props}>
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

// ============================================================================
// DialogTrigger
// ============================================================================

interface DialogTriggerProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  asChild?: boolean;
}

function DialogTrigger({ asChild = true, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      asChild={asChild}
      {...props}
    />
  );
}

// ============================================================================
// DialogPortal
// ============================================================================

function DialogPortal({
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

// ============================================================================
// DialogClose
// ============================================================================

interface DialogCloseProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  asChild?: boolean;
}

function DialogClose({ asChild = true, ...props }: DialogCloseProps) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      asChild={asChild}
      {...props}
    />
  );
}

// ============================================================================
// DialogCloseButton
// ============================================================================

function DialogCloseButton({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof IconButton>) {
  return (
    <IconButton
      {...props}
      data-slot="dialog-close-button"
      className={cn("absolute top-3.5 right-5 rounded-full", className)}
      variant="secondary"
      aria-label="Close"
      asChild
    >
      <DialogPrimitive.Close>
        <TimesIcon />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </IconButton>
  );
}

// ============================================================================
// DialogOverlay
// ============================================================================

function DialogOverlay({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-(--z-dialog) bg-black/80",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// DialogContent Variants
// ============================================================================

const dialogContentVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 border-primary max-w-100% fixed top-1/2 left-1/2 z-(--z-dialog) flex max-h-dvh w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border duration-200 md:max-h-[calc(100dvh-2.5rem)] md:max-w-[calc(100%-1.25rem)]",
  {
    variants: {
      size: {
        sm: "lg:max-w-[min(calc(100%-1.25rem),45rem)]",
        default: "lg:max-w-[min(calc(100%-1.25rem),62.5rem)]",
        lg: "lg:max-w-[min(calc(100%-1.25rem),75rem)]",
      },
    },
    defaultVariants: { size: "default" },
  }
);

// ============================================================================
// DialogContent
// ============================================================================

interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  disablePortal?: boolean;
}

function DialogContent({
  className,
  children,
  disablePortal = false,
  ...props
}: DialogContentProps) {
  const { size } = use(DialogContext);
  const Wrapper = disablePortal ? Fragment : DialogPortal;

  return (
    <Wrapper>
      {!disablePortal && <DialogOverlay />}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          dialogContentVariants({ size, className }),
          "theme-rebrand:glass-panel theme-rebrand:fixed"
        )}
        aria-describedby={undefined}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </Wrapper>
  );
}

// ============================================================================
// DialogHeader
// ============================================================================

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "bg-gradient-bg-panel theme-rebrand:bg-none theme-rebrand:rounded-t-4xl text-primary-foreground theme-rebrand:border-b-primary flex min-h-[4.25rem] flex-col justify-center space-y-1.5 rounded-t-3xl border-b px-2.5 py-3.5 md:px-6 md:py-4",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// DialogBody
// ============================================================================

function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "bg-gradient-bg-dark theme-rebrand:bg-none text-primary-foreground flex-1 overflow-y-auto p-2.5 md:p-6",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// DialogFooter
// ============================================================================

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "bg-gradient-bg-panel theme-rebrand:bg-none theme-rebrand:border-t-primary theme-rebrand:rounded-b-4xl text-primary-foreground flex items-center justify-center gap-4 rounded-b-3xl border-t px-2.5 py-3.5 *:data-[slot*=dialog-close]:w-full *:data-[slot=button]:w-full md:px-6 md:py-4 md:*:data-[slot*=dialog-close]:max-w-70 md:*:data-[slot=button]:max-w-70",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// DialogTitle
// ============================================================================

function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-heading-xs text-primary-foreground md:text-heading-sm flex items-center gap-2 leading-none font-medium tracking-tight [&_svg]:size-8",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogCloseButton,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  dialogContentVariants,
};
