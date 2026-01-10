import dayjs from "dayjs"; // inferred from e.i(585458)
import Cookies from "js-cookie"; // inferred from e.i(464143)
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Buffer } from "buffer";

// Types
import {
  GenerationScheduler,
  ModelArchitecture,
  UserPlan,
  SubscriptionSource,
  InitImageType,
  PromptMagicVersion,
} from "@/lib/graphql/enums"; // Inferred location
import {
  GetElementModelFragmentDoc,
  GetControlnetModelFragmentDoc,
  GetControlNetPreprocessorsDocument,
} from "@/lib/graphql/fragments"; // Inferred location

// Constants
import {
  RESTRICT_AT_PIXELS,
  RESTRICTION_TO_IMAGE_MAX,
  RESTRICTION_TO_IMAGE_MAX_PM_V3,
  SELECTED_TEAM_COOKIE_NAME,
  PHOTO_REAL_MODEL_DATA,
} from "@/constants/app"; // Assumed location
import { STRIPE_REDIRECT_TO_PORTAL_URL } from "@/lib/config"; // Assumed location
import { MOTION_MAX_OUTPUTS_PER_GENERATION } from "@/constants/app";
// Utils
import { isElementCompatibleWithModel } from "@/lib/utils/compatibility"; // Inferred
import { getPriorityImage } from "@/lib/utils/image"; // Inferred
import {
  isPreprocessorSupported,
  isCompatibleImageInput,
  isPreprocessorPremium,
} from "@/lib/utils/preprocessors"; // Inferred
import { SELECT_ALL_OPTION } from "@/constants/options";
import Deferred from "./Deferred";

// --- Type Definitions ---

type Nullable<T> = T | null;

interface XHROptions {
  data: Document | XMLHttpRequestBodyInit | null;
  callback?: (progress: number, completed: boolean) => void;
  method?: string;
  url: string;
}

interface FormatTimeDistanceOptions {
  endedText?: string;
  longFormat?: boolean;
  includeSeconds?: boolean;
}

interface GenerationParams {
  width: number;
  height: number;
  promptMagicVersion?: string;
  usingTransparency?: boolean;
  usingAlchemy?: boolean;
  usingAlchemyV2?: boolean;
  usingHighRes?: boolean;
  usingMotion?: boolean;
  usingPhotoRealV1?: boolean;
  usingPhotoRealV2?: boolean;
  usingPromptMagic?: boolean;
  usingSvd?: boolean;
}

// --- Date & Time Utilities ---

export const toOrdinal = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${n}st`;
  }

  if (mod10 === 2 && mod100 !== 12) {
    return `${n}nd`;
  }

  if (mod10 === 3 && mod100 !== 13) {
    return `${n}rd`;
  }

  return `${n}th`;
};

export const formatDateVerbose = (date: string | Date): string => {
  const d = dayjs(date);
  const dayWithOrdinal = toOrdinal(d.date());
  const month = d.format("MMMM");
  return `${dayWithOrdinal} ${month}`;
};

export const formatDateTimeStr = (date: string | Date): string => {
  return dayjs(date).format("DD/MM/YY [at] h:mm A");
};

export const formatDateTimeStrAlternate = (date: string | Date): string => {
  return dayjs(date).format("DD MMM YYYY hh:mma");
};

export const getNextUTCMidnight = (): number => {
  const now = new Date();
  const h = now.getUTCHours();
  const m = now.getUTCMinutes();
  const s = now.getUTCSeconds();
  // 86400000 ms in a day
  const msPassed = (h * 3600 + m * 60 + s) * 1000;
  return now.getTime() + (86400000 - msPassed);
};

export const getNextUTCMonthTimestamp = (): number => {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(1);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date.getTime();
};

export const formatSecondsToHuman = (seconds: number): string => {
  if (seconds === 1) return "one second";
  if (seconds < 60) return `${seconds} seconds`;

  if (seconds < 3600) {
    const min = Math.floor(seconds / 60);
    return min === 1 ? "1 minute" : `${min} minutes`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? "an hour" : `${hours} hours`;
  }

  const days = Math.floor(seconds / 86400);
  return days === 1 ? "a day" : `${days} days`;
};

export const formatUnixSecondsToLongHuman = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  const day = date.getDate();
  const ordinal = toOrdinal(day).replace(day.toString(), ""); // Extract just st, nd, rd, th

  const formatted = new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }).format(date);

  // Inject ordinal and fix AM/PM case
  return formatted
    .replace(`, ${day} `, ` ${day}${ordinal} of `)
    .replace(/\s(am|pm)/, (match, p1) => p1.toUpperCase());
};

export const formatPlural = (
  word: string,
  count?: number | null,
  zeroLabel?: string | boolean
): string => {
  // Handle 0, undefined, null, or negative numbers
  if (!count || count < 0) {
    if (zeroLabel === true) {
      return `${word}s`;
    }
    return typeof zeroLabel === "string" ? zeroLabel : "";
  }

  // Handle positive numbers
  return `${count} ${word}${count === 1 ? "" : "s"}`;
};

export const formatTimeDistanceToHuman = (
  ms: number,
  options: FormatTimeDistanceOptions = { endedText: "expired" }
): string => {
  if (ms <= 0) return options.endedText || "";

  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (!options.longFormat) {
    return (
      formatPlural("day", days) ||
      formatPlural("hr", hours) ||
      formatPlural("min", minutes) ||
      formatPlural("sec", seconds) ||
      "now"
    );
  }

  const parts: string[] = [];
  if (days) parts.push(formatPlural("day", days)!);
  if (hours) parts.push(formatPlural("hour", hours)!);
  if (minutes) parts.push(formatPlural("minute", minutes)!);

  const shouldShowSeconds =
    options.includeSeconds || (days === 0 && hours === 0 && minutes === 0);
  if (seconds && shouldShowSeconds) {
    parts.push(formatPlural("second", seconds)!);
  }

  if (parts.length === 0) return "now";
  if (parts.length === 1) return parts[0];

  return `${parts.slice(0, -1).join(", ")} and ${parts.slice(-1)[0]}`;
};

export const formatDistanceFromNowToDate = (date: Date): string => {
  return formatTimeDistanceToHuman(date.getTime() - Date.now());
};

// --- String & Number Utilities ---

export const capitalizeFirstLetter = (str: string): string => {
  return str[0]?.toUpperCase() + str.substring(1);
};

export const limitString = (
  str: string | undefined | null,
  limit: number = 50
): string => {
  if (!str) return "";
  return str.length <= limit - 3 ? str : str.substring(0, limit - 3) + "...";
};

export const textTruncator = ({
  text,
  wordLimit,
}: {
  text: string;
  wordLimit: number;
}): string => {
  if (!Number.isInteger(wordLimit) || wordLimit < 1)
    throw new Error("invalid wordLimit argument");
  if (typeof text !== "string") throw new Error("invalid text argument");

  const words = text
    .trim()
    .replace(/[ ]{2,}/g, " ")
    .split(" ");
  const truncated = words.slice(0, wordLimit).join(" ");

  return words.length > wordLimit ? `${truncated} ...` : truncated;
};

export const formatNumberWithCommas = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const isNumericString = (str: string): boolean => /^\d+$/.test(str);

export const filterLineBreaksStr = (str: string): string =>
  str.replace(/\r?\n|\r/g, "");

// --- Array & Object Utilities ---

export const arrayWithInsertedItem = <T>(
  array: T[],
  item: T,
  index: number = 0
): T[] => {
  const splitIndex =
    index >= 0
      ? Math.min(index, array.length)
      : Math.max(array.length + index + 1, 0);
  return [...array.slice(0, splitIndex), item, ...array.slice(splitIndex)];
};

export const removeFromArray = <T>(
  array: T[],
  predicate: T | ((item: T) => boolean)
): T[] => {
  const newArray = [...array];
  const index = newArray.findIndex(
    typeof predicate === "function"
      ? (predicate as (item: T) => boolean)
      : (item) => item === predicate
  );
  if (index > -1) {
    newArray.splice(index, 1);
  }
  return newArray;
};

export const unshiftClampedArray = <T>(
  array: T[],
  item: T,
  limit: number
): T[] => {
  const newArray = [...array].slice(0, limit - 1);
  newArray.unshift(item);
  return newArray;
};

export const nullsToUndefined = <T>(obj: T): T | undefined => {
  if (obj === null) return undefined as any;
  if (obj && typeof obj === "object") {
    if (obj.constructor.name === "Object") {
      for (const key in obj) {
        (obj as any)[key] = nullsToUndefined((obj as any)[key]);
      }
    }
    return obj;
  }
  return obj;
};

export const flattenToJSON = (
  obj: Record<string, any>
): Record<string, string> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      typeof value === "object" ||
      value !== null ||
      typeof value === "function" ||
      Array.isArray(value)
    ) {
      acc[key] = JSON.stringify(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
};

// --- Generation Logic ---

export const getMaximumOutputsPerGeneration = ({
  width,
  height,
  promptMagicVersion,
  usingTransparency,
  usingAlchemy,
  usingAlchemyV2,
  usingHighRes,
  usingMotion,
  usingPhotoRealV1,
  usingPhotoRealV2,
  usingPromptMagic,
  usingSvd,
}: GenerationParams): number => {
  const totalPixels = width * height;

  // Foreground transparency Logic
  if (
    usingTransparency /* Check Enum TransparencyType.ForegroundOnly */ &&
    (usingAlchemy || usingAlchemyV2 || usingPhotoRealV1 || usingPhotoRealV2)
  ) {
    if (totalPixels > 1048576) return 1;
    if (totalPixels > 589824) return 2;
    return 4;
  }

  // Motion/SVD Logic
  if (usingMotion || usingSvd) {
    return MOTION_MAX_OUTPUTS_PER_GENERATION;
  }

  // Alchemy V2 / PhotoReal V2 Logic
  if (usingAlchemyV2 || usingPhotoRealV2) {
    if (totalPixels > 1055360) return 1;
    if (totalPixels > 589824) return 4;
    return 8;
  }

  // High Resolution Logic
  if (usingHighRes) {
    if (width > RESTRICT_AT_PIXELS[3] || height > RESTRICT_AT_PIXELS[3])
      return 1;
    if (width > RESTRICT_AT_PIXELS[2] || height > RESTRICT_AT_PIXELS[2])
      return 2;
  }

  const isPromptMagicV3OrPhotoRealV1 =
    (usingPromptMagic && promptMagicVersion === PromptMagicVersion.v3) ||
    usingPhotoRealV1;

  let i = 0;
  for (; i < RESTRICT_AT_PIXELS.length; i++) {
    const maxDim = Math.max(width, height);
    if (
      maxDim <= (RESTRICT_AT_PIXELS[i + 1] || Infinity) &&
      maxDim > RESTRICT_AT_PIXELS[i]
    ) {
      break;
    }
  }

  return isPromptMagicV3OrPhotoRealV1
    ? RESTRICTION_TO_IMAGE_MAX_PM_V3[i]
    : RESTRICTION_TO_IMAGE_MAX[i];
};

export const generateRandomSeedForGeneration = (
  max: number = Number.MAX_SAFE_INTEGER
): number => {
  return Math.floor(Math.random() * max);
};

export const getFormattedSDVersion = (version: string): string => {
  switch (version) {
    case ModelArchitecture.v1_5:
      return "v1.5";
    case ModelArchitecture.v2:
      return "v2.1";
    default:
      return "";
  }
};

export const getFormattedScheduler = (scheduler: string): string => {
  switch (scheduler) {
    case GenerationScheduler.KLMS:
      return "KLMS";
    case GenerationScheduler.EULER_ANCESTRAL_DISCRETE:
      return "Euler Ancestral ";
    case GenerationScheduler.EULER_DISCRETE:
      return "Euler Discrete";
    case GenerationScheduler.DDIM:
      return "DDIM";
    case GenerationScheduler.DPM_SOLVER:
      return "DPM Solver";
    case GenerationScheduler.DPM_SDE_SOLVER:
      return "DPM SDE Solver";
    case GenerationScheduler.PNDM:
      return "PNDM";
    case GenerationScheduler.UNIPC:
      return "UniPC";
    case GenerationScheduler.LEONARDO:
      return "Leonardo";
    case GenerationScheduler.DPM_SDE_KARRAS:
      return "DPM 2M SDE Karras ++";
    default:
      throw new Error(
        `Error in helpers/getFormattedScheduler: Unknown scheduler: ${scheduler}`
      );
  }
};

// --- Parsers & Data Mappers ---

export interface FeedItem {
  id: string;
  slug?: string;
  title: string;
  prompts: string;
  nsfw: boolean;
  imageUrl: string;
  motionGifUrl?: string;
  motionMp4Url?: string;
  generationId: string;
  isLiked: boolean;
  likes: number;
  user: any;
  createdAt: string;
  trendingScore: number;
  generation: any;
  generated_image_moderation: any;
  generated_image_variation_generics: any;
  conditionalImageUrl: string;
  public: boolean;
  showLatestUpscaledImg: boolean;
  collection_images: any[];
  imageWidth: number;
  imageHeight: number;
  teamId?: string;
}

export const feedParser = (data: any): FeedItem | undefined => {
  if (!data) return undefined;

  const priorityImage = getPriorityImage(
    data.generated_image_variation_generics
  )?.url;
  const prompt = data.generation.prompt;
  const defaultTitle = "No title";

  let title = defaultTitle;
  if (prompt) {
    const found = prompt
      .split(/,|\./gm)
      .map((s: string) => s.trim())
      .find((s: string) => s.length > 0);
    title = capitalizeFirstLetter(found ?? defaultTitle);
  }

  return {
    id: data.id,
    slug: data.slug,
    title,
    prompts: limitString(data.generation.prompt, 150),
    nsfw: data.nsfw,
    imageUrl: data.url,
    motionGifUrl: data?.motionGIFURL,
    motionMp4Url: data?.motionMP4URL,
    generationId: data.generationId,
    isLiked: !!data.user_liked_generated_images?.length,
    likes: data?.likeCount || 0,
    user: data.user ?? data.generation.user,
    createdAt: data.createdAt,
    trendingScore: data.trendingScore,
    generation: data.generation,
    generated_image_moderation: data.generated_image_moderation,
    generated_image_variation_generics: data.generated_image_variation_generics,
    conditionalImageUrl: priorityImage || data.url,
    public: data.public,
    showLatestUpscaledImg: !!priorityImage,
    collection_images: data.collection_images,
    imageWidth: data.image_width,
    imageHeight: data.image_height,
    teamId: data.teamId,
  };
};

export const modelsParser = (
  model: any,
  onClick: (id: string) => void,
  originMap?: Map<string, any>
) => {
  const origin = originMap?.get(model.id);
  const name = origin?.label ?? model.name;
  const description = origin?.description ?? model.description;
  const thumbnail = origin?.thumbnail_url ?? model.generated_image?.url ?? null;

  return {
    id: model.id,
    name: limitString(name),
    description: limitString(description, 150),
    imageUrl: thumbnail,
    user: model.user,
    createdAt: model.createdAt,
    isLiked: !!model.user_favourite_custom_models?.length,
    onClick: () => onClick(model.id),
    instancePrompt: model.instancePrompt,
    sdVersion: model.sdVersion,
    coreModel: model.coreModel,
    modelHeight: model.modelHeight,
    modelWidth: model.modelWidth,
    trainingStrength: model.trainingStrength,
    type: model.type,
    isNsfw: model?.nsfw,
    isPublic: model?.public,
    imageCount: model.imageCount,
  };
};

export const elementsParser = (element: any, onClick: (id: string) => void) => {
  return {
    id: element.id,
    name: limitString(element.name),
    description: limitString(element.description, 150),
    imageUrl:
      element?.dataset?.dataset_images.length > 0
        ? element?.dataset?.dataset_images[0].url
        : "",
    imagePrompt: "",
    user: element.user,
    createdAt: element.createdAt,
    onClick: () => onClick(element.id.toString()),
    instancePrompt: element.instancePrompt,
    isNsfw: element?.nsfw,
    resolution: element?.resolution,
    baseModel: element?.baseModel ?? "Unknown",
    trainingEpoch: element?.trainingEpoch,
    learningRate: element?.learningRate,
    textEncoder: element?.trainTextEncoder ?? true,
    type: element?.focus,
  };
};

// --- Network & Files ---

export const sendXHR = ({
  data,
  callback,
  method = "POST",
  url,
}: XHROptions): Promise<XMLHttpRequest> => {
  const { promise, resolve, reject } = new Deferred<XMLHttpRequest>(); // Utilizing modern Promise.withResolvers pattern or polyfill
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("progress", (e) => {
    const progress = Math.round((e.loaded / e.total) * 100);
    const completed = e.loaded >= e.total;
    callback?.(progress, completed);
  });

  xhr.addEventListener("load", () => resolve(xhr));
  xhr.addEventListener("error", (e) => {
    console.error("Error while processing XHR request:", e);
    reject(e);
  });

  xhr.open(method, url);
  xhr.send(data);

  return promise;
};

export const fileToDataURI = (
  file: File | Blob
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const dataURItoBlob = (dataURI: string): Blob => {
  const [header, data] = dataURI.split(",");
  const mime = header.split(":")[1].split(";")[0];
  const buffer = header.includes("base64")
    ? Buffer.from(data, "base64")
    : decodeURIComponent(data);

  return new Blob([buffer], { type: mime });
};

// --- 3D Validation ---

interface ObjValidationResult {
  isValid: boolean;
  message?: string;
  counts: {
    vertex: number;
    uv: number;
    normal: number;
    face: number;
    group: number;
    usemtl: number;
  };
}

const countMatches = ({
  inputString,
  regexPattern,
  regexModifier,
}: {
  inputString: string;
  regexPattern: string;
  regexModifier: string;
}) => {
  const regex = new RegExp(regexPattern, regexModifier);
  return ((inputString || "").match(regex) || []).length;
};

const getObjCounts = async (content: string) => {
  const counts: any = {};
  const patterns = [
    ["vertex", "\nv ", "g"],
    ["uv", "\nvt ", "g"],
    ["normal", "\nvn ", "g"],
    ["face", "\nf ", "g"],
    ["group", "\ng ", "g"],
    ["usemtl", "\nusemtl ", "g"],
  ];

  for (const [key, pattern, modifier] of patterns) {
    counts[key] = countMatches({
      inputString: content,
      regexPattern: pattern,
      regexModifier: modifier,
    });
  }
  return counts;
};

export const validateObj = async (file: File): Promise<ObjValidationResult> => {
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

  const counts = await getObjCounts(content);
  const faces = content.match(/f .*/gm);

  if (!(faces || []).length) {
    return { isValid: false, message: "no faces specified", counts };
  }

  const faceData = (faces || [])
    .map((f) => f.replace(/f /, ""))
    .flatMap((f) => f.split(" "))
    .map((f) => f.split("/").map((i) => parseInt(i)));

  for (const indices of faceData) {
    if (indices.length > 3)
      return {
        isValid: false,
        message: "more than 3 integers detected for a face vertex",
        counts,
      };
    if (!indices.length)
      return { isValid: false, message: "face vertex missing", counts };

    if (indices[0] > counts.vertex)
      return {
        isValid: false,
        message: `out of bounds vertex specified ${indices[0]}`,
        counts,
      };
    if (indices[1] !== undefined && indices[1] > counts.uv)
      return {
        isValid: false,
        message: `out of bounds uv specified ${indices[1]}`,
        counts,
      };
    if (indices[2] !== undefined && indices[2] > counts.normal)
      return {
        isValid: false,
        message: `out of bounds normal specified ${indices[2]}`,
        counts,
      };
  }

  return { isValid: true, counts };
};

// --- Cache Keys & Filters ---

export const getLorasCacheKey = (akUUID: string) =>
  `loras:${JSON.stringify({ akUUID })}`;
export const getGeneratedImagesCacheKey = (id: string) =>
  `generated_images:${id}`;
export const getControlNetMatrixCacheKey = (id: string) =>
  `controlnet_preprocessor_matrix:${id}`;

export const buildTeamFilter = (teamId?: string) =>
  teamId
    ? { team: { akUUID: { _eq: teamId } } }
    : { teamId: { _is_null: true } };

export const buildTeamIdFilter = (teamId?: string) =>
  teamId ? { teamId: { _eq: teamId } } : { teamId: { _is_null: true } };

export const parseCategoryForMutation = (category: string) =>
  category === SELECT_ALL_OPTION.value ? undefined : category;

// --- Other Utilities ---

export const blurOnKey = (
  event: React.KeyboardEvent,
  key: string = "Enter"
) => {
  if (event.key === key) {
    (event.target as HTMLElement).blur();
  }
};

export const getCurrentUserOrTeamPlan = (user: any) => {
  const teamId = Cookies.get(SELECTED_TEAM_COOKIE_NAME);
  const team = user.teams?.find((t: any) => t.akUUID === teamId);
  return team?.plan || user.plan;
};

export const isPlanFree = (plan: string) => plan === UserPlan.FREE;
export const isSubscribedViaApple = (source: string) =>
  source === SubscriptionSource.APPLE;
export const isSubscribedViaGoogle = (source: string) =>
  source === SubscriptionSource.GOOGLE;

export const redirectToStripePortal = () => {
  window.location.href = STRIPE_REDIRECT_TO_PORTAL_URL;
};

export const getPhotoRealCollectionItem = (onClick: () => void) => ({
  ...PHOTO_REAL_MODEL_DATA,
  onClick,
});

// --- ControlNet Compatibility (Complex Business Logic) ---
interface ElementModelFragment {
  baseModel?: string | null;
  availableToPlan?: string;
}

export const elementsFilteredByCompatibility = (
  client: ApolloClient,
  currentModel: any,
  elements: any[]
) => {
  return elements
    .filter((e) => e.isEnabled)
    .filter((e) => e.weight !== 0)
    .filter((element) => {
      const cacheKey = getLorasCacheKey(element.id);
      const fragment = client.readFragment<ElementModelFragment>({
        id: cacheKey,
        fragment: GetElementModelFragmentDoc,
      });
      return (
        !!fragment?.baseModel &&
        isElementCompatibleWithModel(currentModel, fragment.baseModel)
      );
    });
};

export const controlnetsFilteredByCompatibility = async ({
  apolloClient,
  controlnets,
  imageInputs,
  imageInputLimit,
  usingLeonardoMagic,
  usingAlchemy,
  currentSdVersion,
  leonardoMagicVersion,
  usingPhotoReal,
  photoRealVersion,
  usingTransparency,
  isGenerationImageGuidancePremiumAllowed,
}: any) => {
  // 1. Resolve Preprocessor IDs based on compatibility
  const processedControlNets = (
    await Promise.all(
      controlnets
        .filter((cn: any) => cn.isEnabled)
        .map(async (cn: any) => {
          // Logic to find valid preprocessor ID (extracted from `es` in minified code)
          const queryResult = await apolloClient.query({
            query: GetControlNetPreprocessorsDocument,
          });

          const isSupported = (prep: any) =>
            isPreprocessorSupported({
              preprocessor: prep,
              controlNetMatch: cn.match,
              currentSdVersion,
              usingAlchemy,
              usingLeonardoMagic,
              leonardoMagicVersion,
              usingPhotoReal,
            });

          const definition = queryResult.data.controlnet_definition.find(
            (def: any) =>
              def.controlnetType === cn.match.controlnetType &&
              !!def.preprocessors.find(isSupported)
          );

          if (!definition) return null;
          const preprocessor = definition.preprocessors.find(isSupported);

          if (preprocessor) {
            return { ...cn, preprocessorId: preprocessor.id };
          }
          return null;
        })
    )
  ).filter(Boolean);

  // 2. Fetch missing ControlNet Models if needed
  const missingModels = processedControlNets
    .filter((cn: any) => cn.isEnabled)
    .filter((cn: any) => {
      const cacheKey = getControlNetMatrixCacheKey(cn.preprocessorId);
      const fragment = apolloClient.readFragment({
        id: cacheKey,
        fragment: GetControlnetModelFragmentDoc,
      });
      return !fragment?.preprocessorBaseModel;
    });

  if (missingModels.length > 0) {
    await apolloClient.query({
      query: GetControlNetPreprocessorsDocument,
      variables: {
        where: { id: { _in: missingModels.map((m: any) => m.preprocessorId) } },
      },
    });
  }

  // 3. Final Filtering
  return processedControlNets
    .filter((cn: any) => cn.isEnabled)
    .filter((cn: any, index: number) => {
      const cacheKey = getControlNetMatrixCacheKey(cn.preprocessorId);
      const fragment = apolloClient.readFragment({
        id: cacheKey,
        fragment: GetControlnetModelFragmentDoc,
      });

      const baseModel = fragment?.preprocessorBaseModel;
      if (!baseModel || !fragment) return false;

      const isCompatible =
        isCompatibleImageInput({
          imageInput: cn,
          imageInputIdx: index,
          imageInputs,
          imageInputLimit,
          usingLeonardoMagic,
          usingAlchemy,
          inputBaseModel: baseModel,
          currentSdVersion,
          leonardoMagicVersion,
          usingPhotoReal,
          photoRealVersion,
          usingTransparency,
        }) === true;

      const isPremium = isPreprocessorPremium({
        availableToPlan: fragment.availableToPlan,
      });

      return (
        isCompatible && (isGenerationImageGuidancePremiumAllowed || !isPremium)
      );
    });
};
