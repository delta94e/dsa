"use client";

/**
 * HomePromptBox Component
 *
 * Main prompt box component for the homepage hero section.
 * Includes mode switching, prompt input, aspect ratio/style/model selection,
 * and image guidance functionality.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type FC,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTeamModelOverrides } from "@/hooks/useTeamModelOverrides";
import { cn } from "@/lib/utils";

// UI Components
import { IconButton } from "@chakra-ui/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

// Icons
import { ImageIcon } from "@/components/icons/ImageIcon";
import { VideoIcon } from "@/components/icons/VideoIcon";
import { TimesIcon } from "@/components/icons/TimesIcon";
import { AspectRatioIcon } from "@/components/icons/AspectRatioIcon";
import { StyleIcon } from "@/components/icons/StyleIcon";
import { FineTunedModelIcon } from "@/components/icons/FineTunedModelIcon";
import { CaretDownIcon } from "@/components/icons/CaretDownIcon";
import { ImagePlusIcon } from "@/components/icons/ImagePlusIcon";

// Local components
import { ShineBorder } from "./components/ShineBorder";
import { GenerateButton } from "./components/GenerateButton";
import { ModeSelector, ModeSelectorButton } from "./components/ModeSelector";
import { PromptInputContainer, PromptTextArea } from "./components/PromptInput";
import {
  ImageGuidanceThumbnail,
  ImageGuidanceImage,
  ImageGuidanceRemoveButton,
} from "./components/ImageGuidance";
import {
  ImageGuidanceModal,
  UploadsSource,
  GenerationsTab,
  type ImageAsset,
} from "./components/ImageGuidanceModal";
import { ImageGuidanceSelectionButton } from "./components/ImageGuidanceSelectionButton";
import {
  AspectRatioDropdownItems,
  StyleDropdownItems,
  ModelDropdownItems,
} from "./components/SettingsDropdowns";
import { MobileSettingsMenu } from "./components/SettingsMenu";

// Hooks, Types, Constants, Utils
import { useMenuState, useNavigateWithState } from "./hooks";
import {
  type PromptFormValues,
  type InternalImageGuidanceItem,
  type GenerationMode,
  promptFormSchemaWithRefinements,
  DEFAULT_FORM_VALUES,
  getMaxImageGuidanceCount,
} from "./types";
import {
  getAspectRatiosForMode,
  isValidAspectRatioForMode,
  IMAGE_ASPECT_RATIO_VALUES,
  VIDEO_ASPECT_RATIO_VALUES,
  STYLE_PRESETS,
  getStyleLabelById,
  getModelsForMode,
  getLabelById,
  AUTO_MODEL_PRESET,
  VideoGenerationModel,
  isHailuoAspectRatioRestricted,
  IMAGE_REFERENCE_MAX_COUNT,
  IMAGE_REFERENCE_GUIDANCE_TYPE,
  START_FRAME_GUIDANCE_TYPE,
  FREE_USER_TOKEN_LIMIT,
  PAID_USER_TOKEN_LIMIT,
} from "./constants";
import { buildGenerationUrl, mapImageGuidanceItems } from "./utils";
import { decompressPrompt, clearSearchParamsExcept } from "./utils/compression";
import { usePlan } from "@/hooks";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useToast } from "@/hooks/useToast";
import { useClickOutside } from "@/hooks/useClickOutside";
import { MODEL_ARCHITECTURE } from "@/lib/constants/enums";
import { Form } from "../ui/Form";

// ============================================================================
// Constants
// ============================================================================

const PROMPT_TEXTAREA_ID = "home-prompt-textarea";

// ============================================================================
// Helper Functions
// ============================================================================

function getGenerateTooltipContent(
  prompt: string,
  mode: GenerationMode,
  isPaidUser: boolean,
  isAuthenticated: boolean
): string {
  if (!prompt.trim()) {
    return "Please enter a prompt";
  }
  if (!isAuthenticated) {
    return "Log in to generate";
  }
  if (mode === "video") {
    return "98 tokens";
  }
  return `Up to ${
    isPaidUser ? PAID_USER_TOKEN_LIMIT : FREE_USER_TOKEN_LIMIT
  } tokens`;
}

// ============================================================================
// Props
// ============================================================================

export interface HomePromptBoxProps {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated?: boolean;
  /**
   * Handler for actions requiring authentication
   */
  onAuthRequiredAction?: (redirectUrl: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export const HomePromptBox: FC<HomePromptBoxProps> = ({
  isAuthenticated = true,
  onAuthRequiredAction = (url) => {
    signIn(undefined, { callbackUrl: url });
    window.location.href = url;
  },
}) => {
  const { navigateWithState } = useNavigateWithState();
  const { isModelDisabled } = useTeamModelOverrides();
  const { isUserBasicPlan, isUserStandardPlan, isUserProPlan } = usePlan();
  const toast = useToast();
  // ----------------------------------------------------------------------------
  // State
  // ----------------------------------------------------------------------------

  const [isMounted, setIsMounted] = useState(false);
  const [isImageGuidanceModalOpen, setIsImageGuidanceModalOpen] =
    useState(false);
  const [imageGuidanceItems, setImageGuidanceItems] = useState<
    InternalImageGuidanceItem[]
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageGuidanceDropdownOpen, setIsImageGuidanceDropdownOpen] =
    useState(false);
  const hasInitializedFromUrl = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Paid user check (for numberOfImages logic)
  const isPaidUser =
    isMounted &&
    isAuthenticated &&
    (isUserBasicPlan || isUserStandardPlan || isUserProPlan);

  // Breakpoint for responsive behavior
  const { md: isMdBreakpoint } = useBreakpoint();
  const isMobile = isMounted && !isMdBreakpoint;

  // Menu state
  const { getMenuProps, closeAllMenus, openMenu } = useMenuState({
    onOpenChange: (isOpen) => {
      if (isOpen) setIsImageGuidanceDropdownOpen(false);
    },
  });

  const isAnyMenuOpen = openMenu !== null || isImageGuidanceDropdownOpen;

  // Default model disabled checks
  const isDefaultVideoModelDisabled = isModelDisabled(
    VideoGenerationModel.HAILUO2_3
  );
  const isDefaultImageModelDisabled = isModelDisabled(
    MODEL_ARCHITECTURE.GEMINI_2_5_FLASH
  );

  // Click outside to collapse
  useClickOutside({
    ref: containerRef,
    onClickOutside: (event) => {
      // Don't collapse if clicking on a button or link
      const target = event.target as Element;
      if (target.closest("a, button")) return;
      setIsExpanded(false);
    },
    enabled: isExpanded && !isAnyMenuOpen,
  });

  // ----------------------------------------------------------------------------
  // Form
  // ----------------------------------------------------------------------------

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchemaWithRefinements),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { watch, setValue, handleSubmit, getValues } = form;

  const mode = watch("mode");
  console.log(mode);
  const prompt = watch("prompt");
  const aspectRatio = watch("aspectRatio");
  const style = watch("style");
  const model = watch("model") || AUTO_MODEL_PRESET.id;

  // Derived state
  const hasContent =
    isExpanded ||
    isMobile ||
    imageGuidanceItems.length > 0 ||
    prompt.trim().length > 0;

  const isPromptEmpty = !prompt.trim();
  const maxImageGuidance = getMaxImageGuidanceCount(mode);
  const isImageGuidanceFull = imageGuidanceItems.length >= maxImageGuidance;
  const hasStartFrame = imageGuidanceItems.length > 0;

  // Labels (using generic getLabelById matching original eG function)
  const modelLabel = getLabelById(getModelsForMode(mode), model);
  const styleLabel = getLabelById(STYLE_PRESETS, style);

  // ----------------------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------------------

  // Handle aspect ratio changes when mode changes
  useEffect(() => {
    const hasNoStartFrame = imageGuidanceItems.length === 0;
    if (
      mode === "video" &&
      hasNoStartFrame &&
      isHailuoAspectRatioRestricted(model, aspectRatio)
    ) {
      setValue("aspectRatio", "16:9");
    }
  }, [
    isMounted,
    mode,
    model,
    imageGuidanceItems.length,
    aspectRatio,
    setValue,
  ]);

  // URL parameter initialization effect
  useEffect(() => {
    if (!isMounted || !isAuthenticated || hasInitializedFromUrl.current) return;

    const params = new URLSearchParams(window.location.search);
    const openImageGuidance = params.get("openImageGuidance");
    const compressedPrompt = params.get("compressedPrompt");
    const promptParam = params.get("prompt");
    const aspectRatioParam = params.get("aspectRatio");
    const styleParam = params.get("style");
    const modeParam = params.get("mode");
    const modelParam = params.get("model");

    // Exit early if no params to process
    if (!compressedPrompt && !promptParam && !openImageGuidance) return;

    // Decompress prompt if provided
    const decompressedPrompt = compressedPrompt
      ? decompressPrompt(compressedPrompt)
      : promptParam;

    if (decompressedPrompt) setValue("prompt", decompressedPrompt);
    if (aspectRatioParam) setValue("aspectRatio", aspectRatioParam);
    if (styleParam) setValue("style", styleParam);
    if (modeParam && (modeParam === "image" || modeParam === "video")) {
      setValue("mode", modeParam as GenerationMode);
    }
    if (modelParam) setValue("model", modelParam);
    if (openImageGuidance === "true") setIsImageGuidanceModalOpen(true);

    // Clear processed params from URL
    clearSearchParamsExcept([]);
    hasInitializedFromUrl.current = true;
  }, [isMounted, isAuthenticated, setValue]);

  // Number of images effect based on paid status
  useEffect(() => {
    if (!isMounted) return;
    setValue("numberOfImages", isPaidUser && mode === "image" ? 4 : 1);
  }, [isMounted, isPaidUser, mode, setValue]);

  // ----------------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------------

  const handleModeChange = useCallback(
    (newMode: GenerationMode) => {
      setValue("mode", newMode);

      // Trim image guidance if exceeding new mode limit
      if (newMode === "video") {
        const maxCount = getMaxImageGuidanceCount(newMode);
        if (imageGuidanceItems.length > maxCount) {
          const trimmed = imageGuidanceItems.slice(0, maxCount);
          setImageGuidanceItems(trimmed);
          setValue("imageGuidance", mapImageGuidanceItems(trimmed) ?? []);
        }

        // Update aspect ratio if invalid
        if (!isValidAspectRatioForMode(aspectRatio, newMode)) {
          setValue("aspectRatio", "16:9");
        }

        // Set video model
        setValue("model", VideoGenerationModel.HAILUO2_3);
      } else {
        // Update aspect ratio if invalid
        if (!isValidAspectRatioForMode(aspectRatio, newMode)) {
          setValue("aspectRatio", "1:1");
        }

        // Set image model
        setValue("model", AUTO_MODEL_PRESET.id);
      }
    },
    [aspectRatio, imageGuidanceItems, setValue]
  );

  const handleAspectRatioChange = useCallback(
    (value: string) => setValue("aspectRatio", value),
    [setValue]
  );

  const handleStyleChange = useCallback(
    (value: string) => setValue("style", value),
    [setValue]
  );

  const handleModelChange = useCallback(
    (value: string) => setValue("model", value),
    [setValue]
  );

  const mappedGuidance = useMemo(
    () => mapImageGuidanceItems(imageGuidanceItems),
    [imageGuidanceItems]
  );

  const handleMoreOptions = useCallback(() => {
    const values = { ...getValues(), model: undefined };
    if (isAuthenticated) {
      navigateWithState(values, false, mappedGuidance);
    } else {
      onAuthRequiredAction(buildGenerationUrl(values, false, mappedGuidance));
    }
  }, [
    isAuthenticated,
    getValues,
    imageGuidanceItems,
    navigateWithState,
    onAuthRequiredAction,
  ]);

  const handleSubmitForm = useCallback(
    (data: PromptFormValues) => {
      // If not authenticated, redirect to auth
      if (!isAuthenticated) {
        onAuthRequiredAction(buildGenerationUrl(data, true, mappedGuidance));
        return;
      }

      // Check if using auto model
      const isUsingAutoModel =
        data.model === AUTO_MODEL_PRESET.id || !data.model;

      // If image mode, using auto model, has guidance, and default image model is disabled
      if (
        data.mode === "image" &&
        isUsingAutoModel &&
        mappedGuidance &&
        mappedGuidance.length > 0 &&
        isDefaultImageModelDisabled
      ) {
        toast({
          title: "Image Guidance Disabled",
          description:
            "Image guidance is disabled for this model by your team admin.",
          type: "error",
        });
        // Navigate without auto-generate
        navigateWithState(data, false, mappedGuidance);
        return;
      }

      // Navigate with auto-generate
      navigateWithState(data, true, mappedGuidance);
    },
    [
      isAuthenticated,
      onAuthRequiredAction,
      mappedGuidance,
      isDefaultImageModelDisabled,
      navigateWithState,
      toast,
    ]
  );

  const handleRemoveImageGuidance = useCallback(
    (index: number) => {
      const updated = imageGuidanceItems.filter((_, i) => i !== index);
      setImageGuidanceItems(updated);
      setValue("imageGuidance", mapImageGuidanceItems(updated) ?? []);
    },
    [imageGuidanceItems, setValue]
  );

  const handleOpenImageGuidance = () => {
    closeAllMenus();
    setIsImageGuidanceDropdownOpen(false);
    setIsImageGuidanceModalOpen(true);
  };

  // Handle asset selection from the image guidance modal (eQ)
  const handleSelectAssets = useCallback(
    (assets: InternalImageGuidanceItem[]) => {
      const updated = [...imageGuidanceItems, ...assets];
      setImageGuidanceItems(updated);
      setValue("imageGuidance", mapImageGuidanceItems(updated) ?? []);
      setIsImageGuidanceModalOpen(false);
    },
    [imageGuidanceItems, setValue]
  );

  // Aspect ratio options with disabled states (tt)
  const aspectRatioOptions = useMemo(() => {
    // Get aspect ratio options for current mode (a = "image" === e ? d : c)
    const options = getAspectRatiosForMode(mode);
    // isVideoWithoutStartFrame (n = "video" === e && !i)
    const isVideoWithoutStartFrame = mode === "video" && !hasStartFrame;

    return options.map((opt) => {
      // Check if restricted (i = n && T(t, e.value))
      const isRestricted =
        isVideoWithoutStartFrame &&
        isHailuoAspectRatioRestricted(model, opt.value);
      return {
        ...opt,
        disabled: isRestricted,
        disabledReason: isRestricted
          ? "This aspect ratio requires a start frame."
          : undefined,
      };
    });
  }, [mode, hasStartFrame, model]);

  // Tooltip content
  const generateTooltip = getGenerateTooltipContent(
    prompt,
    mode,
    isPaidUser,
    isAuthenticated
  );

  const excludeImageIds = imageGuidanceItems.map((i) => i.initImageId ?? i.id);

  // ----------------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------------

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-full self-stretch"
        >
          <div ref={containerRef} className="w-full">
            <PromptInputContainer
              isExpanded={hasContent}
              focusTargetId={PROMPT_TEXTAREA_ID}
            >
              <ShineBorder
                className={cn(
                  "flex w-full flex-col [--shine-inset:0.5rem] md:[--shine-inset:1rem]",
                  { "gap-0": !hasContent, "gap-2.5 md:gap-6": hasContent }
                )}
              >
                {/* Prompt Input Row */}
                <div className="flex w-full items-center gap-2">
                  <PromptTextArea
                    value={prompt}
                    onChange={(value) => setValue("prompt", value)}
                    onSubmit={() => handleSubmit(handleSubmitForm)()}
                    startDecorator={
                      isImageGuidanceFull ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="pointer-events-auto shrink-0 self-start">
                              <IconButton
                                variant="secondary"
                                size="md"
                                className="rounded-full"
                                aria-label={
                                  mode === "video"
                                    ? "Add start frame"
                                    : "Add image reference"
                                }
                                disabled
                              >
                                <ImagePlusIcon />
                              </IconButton>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {mode === "video"
                              ? "Start frame already added. Remove it to select a different one."
                              : `Maximum of ${IMAGE_REFERENCE_MAX_COUNT} images reached`}
                          </TooltipContent>
                        </Tooltip>
                      ) : isAuthenticated ? (
                        <DropdownMenu
                          open={isImageGuidanceDropdownOpen}
                          onOpenChange={(open) => {
                            if (open) closeAllMenus();
                            setIsImageGuidanceDropdownOpen(open);
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              variant="secondary"
                              size="md"
                              className="pointer-events-auto shrink-0 self-start rounded-full"
                              aria-label={
                                mode === "video"
                                  ? "Add start frame"
                                  : "Add image reference"
                              }
                            >
                              <ImagePlusIcon />
                            </IconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="bg-gradient-bg-panel relative min-w-80 border-none p-3 md:min-w-[360px]"
                            sideOffset={0}
                          >
                            <IconButton
                              size="sm"
                              className="absolute top-2 right-2 rounded-full"
                              variant="ghost"
                              aria-label="Close"
                              onClick={() =>
                                setIsImageGuidanceDropdownOpen(false)
                              }
                            >
                              <TimesIcon />
                            </IconButton>
                            <h2 className="text-md mb-3 font-medium">
                              {mode === "video"
                                ? "Image Selection"
                                : "Image Guidance"}
                            </h2>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={handleOpenImageGuidance}
                              >
                                {mode === "image"
                                  ? IMAGE_REFERENCE_GUIDANCE_TYPE.name
                                  : START_FRAME_GUIDANCE_TYPE.name}
                              </Button>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <IconButton
                              type="button"
                              variant="secondary"
                              size="md"
                              className="pointer-events-auto shrink-0 self-start rounded-full"
                              aria-label={
                                mode === "video"
                                  ? "Add start frame"
                                  : "Add image reference"
                              }
                              onClick={() => {
                                onAuthRequiredAction("/authenticated-home");
                              }}
                            >
                              <ImagePlusIcon />
                            </IconButton>
                          </TooltipTrigger>
                          <TooltipContent>
                            {mode === "video"
                              ? "Log in to add start frame"
                              : "Log in to add images"}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }
                    onFocus={() => setIsExpanded(true)}
                    isExpanded={hasContent}
                    placeholder="Type a prompt..."
                    className="flex-1"
                    id={PROMPT_TEXTAREA_ID}
                  />

                  {/* Collapsed Generate Button */}
                  {!hasContent && (
                    <div className="pointer-events-auto relative w-33 shrink-0 rounded-full">
                      <GenerateButton
                        onGenerate={() => handleSubmit(handleSubmitForm)()}
                        isGenerating={false}
                        isDisabled={isPromptEmpty}
                        tooltipContent={generateTooltip}
                        borderRadius="rounded-full"
                        contentWidth="w-full"
                      />
                      {isPromptEmpty && (
                        <div
                          data-testid="generate-button-disabled-click-area"
                          className="absolute inset-0 cursor-text"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsExpanded(true);
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            setIsExpanded(true);
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: hasContent ? "auto" : 0,
                    opacity: hasContent ? 1 : 0,
                  }}
                  transition={{
                    duration: hasContent ? 0.23 : 0.12,
                    ease: "easeInOut",
                  }}
                  className={cn("pointer-events-auto", {
                    "pointer-events-none overflow-hidden": !hasContent,
                  })}
                >
                  {/* Image Guidance Thumbnails */}
                  {imageGuidanceItems.length > 0 && (
                    <div
                      data-testid="homepage-image-guidance-thumbnails"
                      className="pointer-events-auto mb-2.5 flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width:none] md:mb-6 md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden"
                    >
                      {imageGuidanceItems.map((item, index) => (
                        <ImageGuidanceThumbnail
                          key={item.id}
                          className="size-22.5 shrink-0"
                        >
                          <ImageGuidanceImage imageUrl={item.url} />
                          <ImageGuidanceRemoveButton
                            onClose={() => handleRemoveImageGuidance(index)}
                          />
                        </ImageGuidanceThumbnail>
                      ))}
                    </div>
                  )}

                  {/* Controls Row */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: hasContent ? 1 : 0,
                      y: hasContent ? 0 : 8,
                    }}
                    transition={{
                      duration: hasContent ? 0.23 : 0.12,
                      ease: hasContent ? "easeInOut" : "easeOut",
                    }}
                    className="flex w-full flex-nowrap items-center justify-between gap-2"
                  >
                    {/* Mode Selector */}
                    <ModeSelector>
                      <ModeSelectorButton
                        isSelected={mode === "image"}
                        onSelect={() => handleModeChange("image")}
                        icon={ImageIcon}
                      >
                        Image
                      </ModeSelectorButton>
                      <ModeSelectorButton
                        isSelected={mode === "video"}
                        onSelect={() => handleModeChange("video")}
                        icon={VideoIcon}
                        disabled={isDefaultVideoModelDisabled}
                        tooltip={
                          isDefaultVideoModelDisabled
                            ? "The default video model has been disabled by your team admin."
                            : undefined
                        }
                      >
                        Video
                      </ModeSelectorButton>
                    </ModeSelector>

                    {/* Settings & Generate */}
                    <div className="flex flex-nowrap items-center gap-1.5">
                      {/* Desktop Dropdowns */}
                      <div className="hidden flex-nowrap items-center gap-1.5 md:flex">
                        {/* Aspect Ratio */}
                        <Select
                          value={aspectRatio}
                          onValueChange={handleAspectRatioChange}
                          {...getMenuProps("aspect-ratio")}
                        >
                          <SelectTrigger asChild>
                            <Button
                              variant="secondary"
                              size="default"
                              className="rounded-full"
                              aria-label={`Aspect ratio: ${aspectRatio}`}
                            >
                              <AspectRatioIcon />
                              <span>{aspectRatio}</span>
                            </Button>
                          </SelectTrigger>
                          <SelectContent align="end" className="w-33.5">
                            {aspectRatioOptions.map((opt) =>
                              opt.disabled && opt.disabledReason ? (
                                <Tooltip key={opt.value}>
                                  <TooltipTrigger asChild>
                                    <span className="block">
                                      <SelectItem value={opt.value} disabled>
                                        {opt.displayLabel}
                                      </SelectItem>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="left">
                                    {opt.disabledReason}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.displayLabel}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        {/* Style (Image mode only) */}
                        {mode === "image" && (
                          <DropdownMenu {...getMenuProps("style")}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="default"
                                className="rounded-full"
                                aria-label={`Style: ${styleLabel}`}
                              >
                                <StyleIcon />
                                <span>{styleLabel}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-33.5">
                              <StyleDropdownItems
                                options={STYLE_PRESETS}
                                value={style}
                                onValueSelected={handleStyleChange}
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {/* Model */}
                        <DropdownMenu {...getMenuProps("model")}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="default"
                              className="rounded-full"
                              aria-label={`Model: ${modelLabel}`}
                            >
                              <FineTunedModelIcon />
                              <span>{modelLabel}</span>
                              <CaretDownIcon className="ml-auto" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="max-w-94.5"
                            sideOffset={0}
                          >
                            <ModelDropdownItems
                              options={getModelsForMode(mode)}
                              value={model}
                              onValueSelected={handleModelChange}
                              onMoreOptions={handleMoreOptions}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Mobile Settings Menu */}
                      <MobileSettingsMenu {...getMenuProps("settings")}>
                        <MobileSettingsMenu.RootView>
                          <MobileSettingsMenu.Item
                            sectionId="model"
                            label="Model"
                            value={modelLabel}
                          />
                          <MobileSettingsMenu.Item
                            sectionId="aspect-ratio"
                            label="Aspect Ratio"
                            value={aspectRatio}
                          />
                          {mode === "image" && (
                            <MobileSettingsMenu.Item
                              sectionId="style"
                              label="Style"
                              value={styleLabel}
                            />
                          )}
                        </MobileSettingsMenu.RootView>
                        <MobileSettingsMenu.SectionsView>
                          <MobileSettingsMenu.Section id="model">
                            <ModelDropdownItems
                              value={model}
                              onValueSelected={handleModelChange}
                              options={getModelsForMode(mode)}
                              onMoreOptions={handleMoreOptions}
                            />
                          </MobileSettingsMenu.Section>
                          <MobileSettingsMenu.Section id="aspect-ratio">
                            <AspectRatioDropdownItems
                              value={aspectRatio}
                              onValueSelected={handleAspectRatioChange}
                              options={aspectRatioOptions}
                            />
                          </MobileSettingsMenu.Section>
                          {mode === "image" && (
                            <MobileSettingsMenu.Section id="style">
                              <StyleDropdownItems
                                value={style}
                                onValueSelected={handleStyleChange}
                                options={STYLE_PRESETS}
                              />
                            </MobileSettingsMenu.Section>
                          )}
                        </MobileSettingsMenu.SectionsView>
                      </MobileSettingsMenu>

                      {/* Generate Button */}
                      <GenerateButton
                        onGenerate={() => handleSubmit(handleSubmitForm)()}
                        isGenerating={false}
                        isDisabled={isPromptEmpty}
                        tooltipContent={generateTooltip}
                        borderRadius="rounded-full"
                        contentWidth="w-[5.625rem] md:w-fit"
                        className="[&_button]:lg:px-7 [&_button]:lg:py-2.5"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </ShineBorder>
            </PromptInputContainer>
          </div>
        </form>
      </Form>
      {/* Image Guidance Modal */}
      {isAuthenticated && (
        <ImageGuidanceModal
          isOpen={isImageGuidanceModalOpen}
          onClose={() => setIsImageGuidanceModalOpen(false)}
          onSelectAssets={handleSelectAssets}
          title={
            mode === "video"
              ? "Select Start Frame"
              : "Select Images for Guidance"
          }
          isMultipleSelection={mode === "image"}
          selectionLimit={
            getMaxImageGuidanceCount(mode) - imageGuidanceItems.length
          }
          isImageDimensionsRequired
        >
          <UploadsSource id="uploads" excludeImageIds={excludeImageIds} />
          <GenerationsTab
            id="generations"
            label="Your Generations"
            includeMotion={false}
            excludeImageIds={excludeImageIds}
          />
        </ImageGuidanceModal>
      )}
    </>
  );
};

export default HomePromptBox;
