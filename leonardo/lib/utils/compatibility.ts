import { ApolloClient } from "@apollo/client";
import {
  GetElementModelFragmentDoc,
  GetControlnetModelFragmentDoc,
  GetControlNetPreprocessorsDocument,
} from "@/lib/graphql/fragments";
import {
  isElementCompatibleWithModel,
  isPreprocessorSupported,
  isCompatibleImageInput,
  isPreprocessorPremium,
} from "@/lib/utils/preprocessors"; // Assuming these will exist

interface ElementModelFragment {
  baseModel?: string | null;
  availableToPlan?: string;
}

export const getLorasCacheKey = (akUUID: string) =>
  `loras:${JSON.stringify({ akUUID })}`;
export const getGeneratedImagesCacheKey = (id: string) =>
  `generated_images:${id}`;
export const getControlNetMatrixCacheKey = (id: string) =>
  `controlnet_preprocessor_matrix:${id}`;

export const elementsFilteredByCompatibility = (
  client: ApolloClient<any>,
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
