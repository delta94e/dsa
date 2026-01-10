"use client";

/**
 * SplitDialog Component
 *
 * A dialog with a split layout - media on left, content on right.
 * Matches production bundle module 139211.
 */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  type ReactNode,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseButton,
} from "./Dialog";

// ============================================================================
// SplitDialog (Root) - Module 139211
// ============================================================================

interface SplitDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  children: ReactNode;
}

function SplitDialog({ children, ...props }: SplitDialogProps) {
  return (
    <Dialog data-slot="split-dialog" {...props}>
      {children}
    </Dialog>
  );
}

// ============================================================================
// SplitDialogTrigger
// ============================================================================

interface SplitDialogTriggerProps
  extends ComponentPropsWithoutRef<typeof DialogTrigger> {
  children: ReactNode;
}

function SplitDialogTrigger({ children, ...props }: SplitDialogTriggerProps) {
  return (
    <DialogTrigger data-slot="split-dialog-trigger" {...props}>
      {children}
    </DialogTrigger>
  );
}

// ============================================================================
// SplitDialogClose
// ============================================================================

interface SplitDialogCloseProps
  extends ComponentPropsWithoutRef<typeof DialogClose> {
  children: ReactNode;
}

function SplitDialogClose({ children, ...props }: SplitDialogCloseProps) {
  return (
    <DialogClose data-slot="split-dialog-close" {...props}>
      {children}
    </DialogClose>
  );
}

// ============================================================================
// SplitDialogHeader
// ============================================================================

function SplitDialogHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <DialogHeader
      data-slot="split-dialog-header"
      className={cn(
        "bg-gradient-bg-panel text-primary-foreground hidden min-h-[4.25rem] flex-col justify-center space-y-1.5 rounded-t-3xl border-b px-2.5 py-6 md:px-6 lg:flex",
        "theme-rebrand:bg-none theme-rebrand:rounded-t-4xl",
        className
      )}
      {...props}
    >
      {children}
    </DialogHeader>
  );
}

// ============================================================================
// SplitDialogTitle
// ============================================================================

function SplitDialogTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogTitle>) {
  return (
    <DialogTitle
      data-slot="split-dialog-title"
      className={className}
      {...props}
    >
      {children}
    </DialogTitle>
  );
}

// ============================================================================
// SplitDialogCloseButton
// ============================================================================

function SplitDialogCloseButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogCloseButton>) {
  return (
    <DialogCloseButton
      data-slot="split-dialog-close-button"
      className={cn("z-10", className)}
      {...props}
    >
      {children}
    </DialogCloseButton>
  );
}

// ============================================================================
// SplitDialogContent
// ============================================================================

function SplitDialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Content
      data-slot="split-dialog-content"
      className={cn(
        "bg-gradient-bg-dark border-primary flex h-full w-full flex-col overflow-hidden rounded-none p-0 md:rounded-3xl md:border lg:h-auto lg:max-w-[min(calc(100%-1.25rem),62.5rem)] lg:flex-row",
        "theme-rebrand:before:z-20 theme-rebrand:md:rounded-r-4xl theme-rebrand:rounded-none theme-rebrand:before:rounded-none theme-rebrand:before:md:rounded-4xl theme-rebrand:max-md:border-none theme-rebrand:before:max-md:border-none theme-rebrand:max-md:bg-none theme-rebrand:before:max-md:bg-none",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
}

// ============================================================================
// SplitDialogBody
// ============================================================================

function SplitDialogBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <DialogBody
      data-slot="split-dialog-body"
      className={cn(
        "bg-gradient-bg-dark theme-rebrand:bg-none text-primary-foreground flex-1 overflow-y-auto p-2.5 md:p-6 lg:p-9",
        className
      )}
      {...props}
    >
      {children}
    </DialogBody>
  );
}

// ============================================================================
// SplitDialogMedia
// ============================================================================

function SplitDialogMedia({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="split-dialog-media"
      className={cn(
        "relative h-24 w-full flex-shrink-0 overflow-hidden md:h-32 lg:h-auto lg:w-2/5 lg:rounded-l-3xl",
        "theme-rebrand:md:rounded-l-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SplitDialogMain
// ============================================================================

function SplitDialogMain({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="split-dialog-main"
      className={cn(
        "bg-gradient-bg-dark flex min-h-0 flex-1 flex-col md:rounded-r-3xl",
        "theme-rebrand:bg-none theme-rebrand:md:rounded-r-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SplitDialogIconBadge
// ============================================================================

function SplitDialogIconBadge({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-gradient-primary [&>svg]:path-gradient flex size-11.5 items-center justify-center rounded-full border-2 bg-black lg:size-21 lg:border-3 [&>svg]:size-7.5 [&>svg]:lg:size-13",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SplitDialogMediaOverlay
// ============================================================================

function SplitDialogMediaOverlay({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="split-dialog-media-overlay"
      className={cn(
        "text-heading-xs md:text-heading-lg absolute inset-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black via-black/50 to-transparent px-2.5 py-6 font-semibold md:py-6 lg:flex-col lg:justify-end lg:py-10 lg:text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SplitDialogFooter
// ============================================================================

function SplitDialogFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="split-dialog-footer"
      className={cn(
        "bg-gradient-bg-panel text-primary-foreground flex items-center justify-center gap-4 rounded-b-3xl border-t px-2.5 py-3.5 *:data-[slot*=dialog-close]:w-full *:data-[slot=button]:w-full md:px-6 md:py-4 md:*:data-[slot*=dialog-close]:max-w-70 md:*:data-[slot=button]:max-w-70",
        "theme-rebrand:bg-none theme-rebrand:rounded-b-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  SplitDialog,
  SplitDialogTrigger,
  SplitDialogClose,
  SplitDialogCloseButton,
  SplitDialogContent,
  SplitDialogHeader,
  SplitDialogTitle,
  SplitDialogBody,
  SplitDialogMedia,
  SplitDialogMain,
  SplitDialogIconBadge,
  SplitDialogMediaOverlay,
  SplitDialogFooter,
};
