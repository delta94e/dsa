"use client";

import * as React from "react";
import {
  createContext,
  useContext,
  useState,
  forwardRef,
  cloneElement,
} from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// ============================================================================
// Production module 438024: Chakra-style Avatar
// ============================================================================

// ============================================================================
// Context: AvatarStylesContext
// Production: let [o, c] = (0, e.i(511654).createContext)({...})
// ============================================================================

interface AvatarStylesContextValue {
  label?: React.CSSProperties;
  container?: React.CSSProperties;
}

const AvatarStylesContext = createContext<AvatarStylesContextValue>({});

export function useAvatarStyles() {
  return useContext(AvatarStylesContext);
}

// ============================================================================
// Helper: getInitials
// Production: function u(e) { let t = e.trim().split(" "), ... }
// ============================================================================

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return first && last
    ? `${first.charAt(0)}${last.charAt(0)}`
    : first.charAt(0);
}

// ============================================================================
// AvatarName Component
// Production: function m(e) { ... }
// ============================================================================

interface AvatarNameProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  getInitials?: (name: string) => string;
}

export const AvatarName = forwardRef<HTMLDivElement, AvatarNameProps>(
  ({ name, getInitials: customGetInitials, ...props }, ref) => {
    const styles = useAvatarStyles();
    return (
      <div
        ref={ref}
        role="img"
        aria-label={name}
        style={styles.label}
        {...props}
      >
        {name ? (customGetInitials ?? getInitials)(name) : null}
      </div>
    );
  }
);
AvatarName.displayName = "AvatarName";

// ============================================================================
// Default Avatar Icon (SVG)
// Production: let h = (e) => (0, t.jsxs)(d.chakra.svg, {...})
// ============================================================================

export const DefaultAvatarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    viewBox="0 0 128 128"
    color="#fff"
    width="100%"
    height="100%"
    className="chakra-avatar__svg"
    {...props}
  >
    <path
      fill="currentColor"
      d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
    />
    <path
      fill="currentColor"
      d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
    />
  </svg>
);

// ============================================================================
// AvatarImage Component (Internal)
// Production: function g(e) { ... }
// ============================================================================

interface AvatarImageInternalProps {
  src?: string;
  srcSet?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  getInitials?: (name: string) => string;
  name?: string;
  borderRadius?: string;
  loading?: "eager" | "lazy";
  iconLabel?: string;
  icon?: React.ReactElement;
  ignoreFallback?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

type ImageLoadStatus = "loading" | "loaded" | "failed";

function useImage({
  src,
  onError,
  crossOrigin,
  ignoreFallback,
}: {
  src?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  crossOrigin?: string;
  ignoreFallback?: boolean;
}): ImageLoadStatus {
  const [status, setStatus] = useState<ImageLoadStatus>("loading");

  React.useEffect(() => {
    if (!src) {
      setStatus("failed");
      return;
    }
    if (ignoreFallback) {
      setStatus("loaded");
      return;
    }

    const img = new Image();
    img.src = src;
    if (crossOrigin) img.crossOrigin = crossOrigin;

    img.onload = () => setStatus("loaded");
    img.onerror = (e) => {
      setStatus("failed");
      onError?.(e as unknown as React.SyntheticEvent<HTMLImageElement>);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, crossOrigin, ignoreFallback, onError]);

  return status;
}

const AvatarImageInternal: React.FC<AvatarImageInternalProps> = ({
  src,
  srcSet,
  onError,
  onLoad,
  getInitials: customGetInitials,
  name,
  borderRadius,
  loading,
  iconLabel = " avatar",
  icon,
  ignoreFallback,
  referrerPolicy,
  crossOrigin,
}) => {
  const status = useImage({ src, onError, crossOrigin, ignoreFallback });
  const defaultIcon = icon ?? <DefaultAvatarIcon />;

  if (src && status === "loaded") {
    return (
      <img
        src={src}
        srcSet={srcSet}
        alt={name ?? iconLabel}
        onLoad={onLoad}
        referrerPolicy={referrerPolicy}
        crossOrigin={crossOrigin || undefined}
        className="chakra-avatar__img"
        loading={loading}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius,
        }}
      />
    );
  }

  if (name) {
    return (
      <AvatarName
        className="chakra-avatar__initials"
        getInitials={customGetInitials ?? getInitials}
        name={name}
      />
    );
  }

  return cloneElement(defaultIcon, { role: "img", "aria-label": iconLabel });
};

// ============================================================================
// Avatar Component (Main)
// Production: let b = (0, x.forwardRef)((e, a) => { ... })
// ============================================================================

// Base styles matching production: let C = (0, a.defineStyle)({...})
const baseStyles: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  textTransform: "uppercase",
  fontWeight: 500,
  position: "relative",
  flexShrink: 0,
};

interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  // Image props
  src?: string;
  srcSet?: string;
  name?: string;
  loading?: "eager" | "lazy";
  onError?: React.ReactEventHandler<HTMLImageElement>;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  getInitials?: (name: string) => string;
  icon?: React.ReactElement;
  iconLabel?: string;
  ignoreFallback?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;

  // Chakra-style props (production compatibility)
  showBorder?: boolean;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: number | string;
  background?: string;
  backgroundColor?: string;
  w?: number | string;
  h?: number | string;
  color?: string;
  overflow?: string;
  transition?: string;
  variant?: string;
  css?: Record<string, React.CSSProperties>;
  _focusVisible?: React.CSSProperties;

  // Size variant for backwards compatibility
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

// Size mapping (Chakra spacing units to rem)
const sizeMap: Record<string, string> = {
  xs: "1.25rem",
  sm: "1.5rem",
  md: "2rem",
  lg: "2.5rem",
  xl: "3rem",
};

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const {
    src,
    srcSet,
    name,
    showBorder,
    borderRadius = "full",
    onError,
    onLoad,
    getInitials: customGetInitials = getInitials,
    icon,
    iconLabel = " avatar",
    loading,
    children,
    borderColor,
    borderWidth,
    background,
    backgroundColor,
    w,
    h,
    color,
    overflow,
    transition,
    variant,
    css: cssProp,
    _focusVisible,
    ignoreFallback,
    crossOrigin,
    referrerPolicy,
    size,
    className,
    style,
    ...rest
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  // Compute size
  const computedW =
    w !== undefined
      ? typeof w === "number"
        ? `${w * 0.25}rem`
        : w
      : size
      ? sizeMap[size]
      : sizeMap.md;
  const computedH =
    h !== undefined
      ? typeof h === "number"
        ? `${h * 0.25}rem`
        : h
      : computedW;

  // Compute border radius
  const computedBorderRadius =
    borderRadius === "full" ? "9999px" : borderRadius;

  // Build container styles
  const containerStyle: React.CSSProperties = {
    ...baseStyles,
    width: computedW,
    height: computedH,
    borderRadius: computedBorderRadius,
    borderWidth: showBorder
      ? "2px"
      : borderWidth !== undefined
      ? borderWidth === 0
        ? 0
        : borderWidth
      : undefined,
    borderStyle: showBorder || borderWidth ? "solid" : undefined,
    borderColor: borderColor,
    background: background,
    backgroundColor: backgroundColor,
    color: color,
    overflow: overflow,
    transition: transition,
    ...style,
  };

  // Context value
  const contextValue: AvatarStylesContextValue = {
    label: { fontSize: "inherit", fontWeight: "inherit" },
    container: containerStyle,
  };

  return (
    <span
      ref={ref}
      className={cn("chakra-avatar", className)}
      data-loaded={isLoaded ? "" : undefined}
      style={containerStyle}
      {...rest}
    >
      <AvatarStylesContext.Provider value={contextValue}>
        <AvatarImageInternal
          src={src}
          srcSet={srcSet}
          loading={loading}
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={onError}
          getInitials={customGetInitials}
          name={name}
          borderRadius={computedBorderRadius}
          icon={icon}
          iconLabel={iconLabel}
          ignoreFallback={ignoreFallback}
          crossOrigin={crossOrigin}
          referrerPolicy={referrerPolicy}
        />
        {children}
      </AvatarStylesContext.Provider>
    </span>
  );
});
Avatar.displayName = "Avatar";

// ============================================================================
// Simple exports for backwards compatibility with Radix structure
// ============================================================================

const AvatarImage = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
      "text-xs font-medium",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// ============================================================================
// Exports
// ============================================================================

export { Avatar, AvatarImage, AvatarFallback, AvatarName as AvatarInitials };
