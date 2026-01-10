import { getPriorityImage } from "./image";
import { capitalizeFirstLetter, limitString } from "./string";
import { SELECT_ALL_OPTION } from "@/constants/options";

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
  generated_image_moderation: number;
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

export const parseCategoryForMutation = (category: string) =>
  category === SELECT_ALL_OPTION.value ? undefined : category;
