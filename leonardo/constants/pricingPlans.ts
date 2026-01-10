import {
  PLAN_CONCURRENCY,
  PLAN_MAX_ROLLOVER_TOKENS,
  PLAN_MODELS,
  PLAN_NAME,
  PLAN_NAME_V2,
  PLAN_PENDING_JOBS,
  PLAN_TOKENS,
  PlanType,
} from "./plans";

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num);

export const PRICING_PLANS = [
  {
    plan: PlanType.FREE,
    title: PLAN_NAME[PlanType.FREE],
    tokenInfo: `${formatNumber(PLAN_TOKENS[PlanType.FREE])} daily tokens`,
    borderColor: "#242C3E",
    cardStyle: { background: "#0B0F17" },
    cost: { monthly: 0, yearly: 0 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: false,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: false,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Free suite> of tools you’ll love",
      description:
        "Full feature set, with feature limitations & daily output limits",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.FREE]
        )} Fast Tokens Reset Daily`,
        checked: true,
        tooltip: "",
      },
      { name: "No Rollover Token Capacity", checked: false, tooltip: "" },
      {
        name: "No relaxed rate image generation jobs",
        checked: false,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      { name: "No additional pending jobs", checked: false, tooltip: "" },
      { name: "No private generations", checked: false, tooltip: "" },
      { name: "No model training", checked: false, tooltip: "" },
      { name: "No model retention", checked: false, tooltip: "" },
      { name: "No priority infrastructure", checked: false, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "#9093A6",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.BASIC,
    title: `${PLAN_NAME[PlanType.BASIC]} Standard`,
    tokenInfo: `${formatNumber(PLAN_TOKENS[PlanType.BASIC])} monthly tokens`,
    borderColor: "rgba(87, 139, 254, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(87, 139, 254, 0.12) 3%, rgba(87, 139, 254, 0) 25%), #0B0F17",
    },
    cost: { monthly: 12, yearly: 10 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "Access <Premium> Features",
      description: "Full feature set with monthly output limits",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.BASIC]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.BASIC]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "No relaxed rate image generation jobs",
        checked: false,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.BASIC]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.BASIC]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.BASIC]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "transparent",
      background:
        "linear-gradient(81.02deg, #FA5560 -23.47%, #B14BF4 45.52%, #4D91FF 114.8%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.STANDARD,
    title: `${PLAN_NAME[PlanType.STANDARD]} Unlimited`,
    tokenInfo: "Unlimited image generations",
    borderColor: "rgba(197, 78, 205, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(213, 80, 173, 0.2) -5%, rgba(107, 102, 255, 0) 25%), #0B0F17",
    },
    cost: { monthly: 30, yearly: 24 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Unlimited> Images",
      description: "Everything in Apprentice <plus> more output",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.STANDARD]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.STANDARD]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited image generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.STANDARD]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.STANDARD]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.STANDARD]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "#6B66FF",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.PRO,
    title: `${PLAN_NAME[PlanType.PRO]} Unlimited`,
    tokenInfo: "Unlimited generations",
    borderColor: "rgb(107, 102, 255, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(107, 102, 255, 0.16) 3%, rgba(107, 102, 255, 0) 25%), #0B0F17",
    },
    cost: { monthly: 60, yearly: 48 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Unlimited> Image & Video",
      description: "Everything in Artisan <plus> hyper-iteration",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.PRO]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.PRO]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited image generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited video generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      { name: "Coming soon - unlimited upscales", checked: true, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.PRO]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.PRO]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.PRO]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      {
        name: `${PLAN_CONCURRENCY[PlanType.PRO]} Concurrent Generations`,
        checked: true,
        tooltip: "",
      },
    ],
    titleStyle: {
      color: "#578BFE",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
];

export const PRICING_PLANS_V2 = [
  {
    plan: PlanType.FREE,
    title: PLAN_NAME_V2[PlanType.FREE],
    tokenInfo: `${formatNumber(PLAN_TOKENS[PlanType.FREE])} daily tokens`,
    borderColor: "#242C3E",
    cardStyle: { background: "#0B0F17" },
    cost: { monthly: 0, yearly: 0 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: false,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: false,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Free suite> of tools you’ll love",
      description:
        "Full feature set, with feature limitations & daily output limits",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.FREE]
        )} Fast Tokens Reset Daily`,
        checked: true,
        tooltip: "",
      },
      { name: "No Rollover Token Capacity", checked: false, tooltip: "" },
      {
        name: "No relaxed rate image generation jobs",
        checked: false,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      { name: "No additional pending jobs", checked: false, tooltip: "" },
      { name: "No private generations", checked: false, tooltip: "" },
      { name: "No model training", checked: false, tooltip: "" },
      { name: "No model retention", checked: false, tooltip: "" },
      { name: "No priority infrastructure", checked: false, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "#9093A6",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.BASIC,
    title: PLAN_NAME_V2[PlanType.BASIC],
    tokenInfo: `${formatNumber(
      PLAN_TOKENS[PlanType.BASIC]
    )} monthly tokens + Flow State`,
    borderColor: "rgba(87, 139, 254, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(87, 139, 254, 0.12) 3%, rgba(87, 139, 254, 0) 25%), #0B0F17",
    },
    cost: { monthly: 12, yearly: 10 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: false,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "Access <Essential> Features",
      description: "Full feature set with monthly output limits + Flow State",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.BASIC]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.BASIC]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "No relaxed rate image generation jobs",
        checked: false,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.BASIC]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.BASIC]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.BASIC]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "transparent",
      background:
        "linear-gradient(81.02deg, #FA5560 -23.47%, #B14BF4 45.52%, #4D91FF 114.8%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.STANDARD,
    title: PLAN_NAME_V2[PlanType.STANDARD],
    tokenInfo: "Unlimited first-party images",
    borderColor: "rgba(197, 78, 205, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(213, 80, 173, 0.2) -5%, rgba(107, 102, 255, 0) 25%), #0B0F17",
    },
    cost: { monthly: 30, yearly: 24 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Unlimited> First-Party Images",
      description:
        "Everything in Essential <plus> unlimited first-party images + tools",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.STANDARD]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.STANDARD]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited image generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      {
        name: "No relaxed rate video generation",
        checked: false,
        tooltip: "",
      },
      { name: "No relaxed rate upscales", checked: false, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.STANDARD]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.STANDARD]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.STANDARD]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      { name: "No Concurrency", checked: false, tooltip: "" },
    ],
    titleStyle: {
      color: "#6B66FF",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
  {
    plan: PlanType.PRO,
    title: PLAN_NAME_V2[PlanType.PRO],
    tokenInfo: "Unlimited first-party images & videos",
    borderColor: "rgb(107, 102, 255, 0.6)",
    cardStyle: {
      background:
        "linear-gradient(140deg, rgba(107, 102, 255, 0.16) 3%, rgba(107, 102, 255, 0) 25%), #0B0F17",
    },
    cost: { monthly: 60, yearly: 48 },
    features: [
      {
        category: "Style-consistent generations",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Leonardo custom pipeline",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Image Prompts",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Magic Prompt",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Pose-2-Image",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Prompt generation",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Tiling", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Commercial use",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Private generations",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Relaxed generation queue",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom fine-tuning settings",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo uses exclusive generation parameters at its core, which allows it to generate images of better quality. We also leverage proprietary render pipelines, multiple specialized upscalers, and model fine-tuning for style consistency, along with other perks.",
      },
      {
        category: "Leonardo Canvas",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Style consistent engine",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Masking / erasing",
            tooltip: "",
          },
          { checked: true, comingSoon: false, name: "Inpainting", tooltip: "" },
          {
            checked: true,
            comingSoon: false,
            name: "Outpainting",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: false,
            name: "Painting tools",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Layer management",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s Canvas allows fine-tuning of your images up to the last detail, merging multiple assets, and working with layers in a Photoshop-like style.",
      },
      {
        category: "3D texturing",
        items: [
          {
            checked: true,
            comingSoon: true,
            name: "Text-to-texture",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo’s upcoming feature will allow users to input textures, and enjoy multiple 3D variations applied to the same initial model.",
      },
      {
        category: "Special perks",
        items: [
          {
            checked: true,
            comingSoon: false,
            name: "Early access to new features",
            tooltip: "",
          },
          {
            checked: true,
            comingSoon: true,
            name: "API access",
            tooltip: "Generate your API key from your profile page.",
          },
          {
            checked: true,
            comingSoon: true,
            name: "Custom upscale settings ",
            tooltip: "",
          },
        ],
        tooltip:
          "Leonardo is constantly in development. We are building a platform rich in special features.",
      },
    ],
    fixedSectionHeader: {
      title: "<Unlimited> First-Party Images & Videos",
      description:
        "Everything in Premium <plus> unlimited first-party videos + tools",
    },
    fixedSection: [
      {
        name: `${formatNumber(
          PLAN_TOKENS[PlanType.PRO]
        )} Fast Tokens Reset Monthly`,
        checked: true,
        tooltip: "",
      },
      {
        name: `${formatNumber(
          PLAN_MAX_ROLLOVER_TOKENS[PlanType.PRO]
        )} Rollover Token Capacity`,
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited image generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      {
        name: "Unlimited video generation at a relaxed rate",
        checked: true,
        tooltip: "",
      },
      { name: "Coming soon - unlimited upscales", checked: true, tooltip: "" },
      {
        name: `Up to ${PLAN_PENDING_JOBS[PlanType.PRO]} pending jobs`,
        checked: true,
        tooltip: "",
      },
      { name: "Private generations", checked: true, tooltip: "" },
      {
        name: `Train ${PLAN_MODELS[PlanType.PRO]} models per month`,
        checked: true,
        tooltip: "",
      },
      {
        name: `Retain up to ${PLAN_MODELS[PlanType.PRO]} models`,
        checked: true,
        tooltip: "",
      },
      { name: "Priority infrastructure", checked: true, tooltip: "" },
      {
        name: `${PLAN_CONCURRENCY[PlanType.PRO]} Concurrent Generations`,
        checked: true,
        tooltip: "",
      },
    ],
    titleStyle: {
      color: "#578BFE",
      background: "unset",
      WebkitBackgroundClip: "unset",
      WebkitTextFillColor: "unset",
      fontWeight: 700,
    },
  },
];
