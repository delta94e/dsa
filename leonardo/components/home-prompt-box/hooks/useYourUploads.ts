import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import uniqBy from "lodash/uniqBy";

// Hooks
import { useUserId } from "@/hooks";
import { useSelectedTeam } from "@/hooks/useSelectedTeam";

// GraphQL
import {
  GetViewerUploadsDocument,
  type GetViewerUploadsData,
  type GetViewerUploadsVariables,
} from "@/lib/graphql/queries/asset";
import { InitImageType } from "@/components/home-prompt-box/components/ImageGuidanceModal/imageModalUtils";

// Utils & Constants
import { buildTeamIdFilter } from "@/lib/utils/teams"; // Inferred based on buildTeamIdFilter usage
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants/app";

interface UploadedImage {
  id: string;
  url: string;
  [key: string]: any;
}

interface TransformedImage {
  id: string;
  type: InitImageType;
  url: string;
  alt: string;
}

const defaultTransformer = (images: UploadedImage[]): TransformedImage[] => {
  const mapped = images.map((img) => ({
    id: img.id,
    type: InitImageType.Uploaded, // inferred from l.InitImageType.Uploaded
    url: img.url,
    alt: "",
  }));
  return uniqBy(mapped, "id");
};

interface UseYourUploadsOptions {
  pageSize?: number;
  transformer?: (images: any[]) => any[];
}

export function useYourUploads({
  pageSize = DEFAULT_MODAL_PAGE_SIZE,
  transformer = defaultTransformer,
}: UseYourUploadsOptions = {}) {
  const userId = useUserId();
  const { userSelectedTeam } = useSelectedTeam();
  const currentTeam = userSelectedTeam();

  const { data, loading, fetchMore, error, refetch } = useQuery<
    GetViewerUploadsData,
    GetViewerUploadsVariables
  >(GetViewerUploadsDocument, {
    variables: {
      where: {
        userId: { _eq: userId },
        ...buildTeamIdFilter(currentTeam?.id),
      },
      limit: pageSize,
    },
    fetchPolicy: "network-only",
  });

  const fetchNextPage = useCallback(() => {
    fetchMore({
      variables: { offset: data?.init_images.length },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;

        return Object.assign({}, previousResult, {
          init_images: uniqBy(
            [
              ...(previousResult.init_images || []),
              ...(fetchMoreResult.init_images || []),
            ],
            "id"
          ),
        });
      },
    });
  }, [data?.init_images.length, fetchMore]);

  const images = useMemo(
    () => transformer(data?.init_images || []),
    [data?.init_images, transformer]
  );

  return {
    images,
    loading,
    fetchNextPage,
    error,
    refetch,
  };
}
