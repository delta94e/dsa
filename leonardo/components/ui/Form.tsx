"use client";

/**
 * Form Components
 *
 * React Hook Form integration components.
 * Matches Leonardo.ai module 23210.
 */

import * as React from "react";
import { createContext, useContext, useId, useMemo } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  useWatch,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

// ============================================================================
// Context
// ============================================================================

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

type FormItemContextValue = {
  id: string;
  required?: boolean;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

// ============================================================================
// Form (FormProvider wrapper)
// ============================================================================

const Form = FormProvider;

// ============================================================================
// FormField
// ============================================================================

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  const value = useMemo(() => ({ name: props.name }), [props.name]);

  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// ============================================================================
// useFormField Hook
// ============================================================================

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    required: itemContext.required ?? false,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// ============================================================================
// FormItem
// ============================================================================

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  required?: boolean;
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, required, ...props }, ref) => {
    const id = useId();
    const value = useMemo(() => ({ id, required }), [id, required]);

    return (
      <FormItemContext.Provider value={value}>
        <div
          data-slot="form-item"
          ref={ref}
          className={cn("grid gap-2.5", className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = "FormItem";

// ============================================================================
// RequiredIndicator
// ============================================================================

interface RequiredIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

function RequiredIndicator({
  className,
  children,
  ...props
}: RequiredIndicatorProps) {
  return (
    <span
      data-slot="required-indicator"
      aria-hidden="true"
      className={cn("text-negative-foreground ml-0.5", className)}
      {...props}
    >
      {children ?? "*"}
    </span>
  );
}

// ============================================================================
// FormLabel
// ============================================================================

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    const { formItemId, required } = useFormField();

    return (
      <Label
        data-slot="form-label"
        ref={ref}
        className={cn(className)}
        htmlFor={formItemId}
        {...props}
      >
        {children}
        {required && <RequiredIndicator />}
      </Label>
    );
  }
);
FormLabel.displayName = "FormLabel";

// ============================================================================
// FormControl
// ============================================================================

interface FormControlProps
  extends React.ComponentPropsWithoutRef<typeof Slot> {}

const FormControl = React.forwardRef<HTMLElement, FormControlProps>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId, required } =
      useFormField();

    return (
      <Slot
        data-slot="form-control"
        ref={ref}
        id={formItemId}
        aria-describedby={
          error
            ? `${formDescriptionId} ${formMessageId}`
            : `${formDescriptionId}`
        }
        aria-invalid={!!error}
        aria-required={required || undefined}
        {...props}
      />
    );
  }
);
FormControl.displayName = "FormControl";

// ============================================================================
// FormDescription
// ============================================================================

interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      ref={ref}
      id={formDescriptionId}
      className={cn("text-secondary-foreground text-xs", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// ============================================================================
// FormCharacterCount
// ============================================================================

interface FormCharacterCountProps extends React.HTMLAttributes<HTMLElement> {
  field: string;
  maxLength: number;
  asChild?: boolean;
}

function FormCharacterCount({
  field,
  maxLength,
  asChild,
  className,
  ...props
}: FormCharacterCountProps) {
  const { control } = useFormContext();
  const value = useWatch({ control, name: field });
  const length = (value as string)?.length ?? 0;

  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      data-slot="form-character-count"
      className={cn("text-secondary-foreground text-xs", className)}
      {...props}
    >
      {length}/{maxLength} characters
    </Comp>
  );
}

// ============================================================================
// FormMessage
// ============================================================================

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        data-slot="form-message"
        ref={ref}
        id={formMessageId}
        className={cn(
          "text-negative-foreground text-xs font-medium",
          className
        )}
        {...props}
      >
        {body}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

// ============================================================================
// Exports
// ============================================================================

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormCharacterCount,
  useFormField,
};
