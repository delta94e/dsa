/**
 * External URLs Configuration
 * 
 * Centralized external URL definitions for Leonardo.ai.
 * Matches production bundle module 637564.
 */
export const ExternalUrls = {
  // App stores
  apple: 'https://apps.apple.com/us/app/leonardo-ai-image-generator/id1662773014',
  android: 'https://play.google.com/store/apps/details?id=ai.leonardo.leonardo',

  // Social media
  discord: 'https://discord.com/invite/leonardo-ai',
  facebook: 'https://www.facebook.com/LeonardoAiOfficial',
  reddit: 'https://www.reddit.com/r/leonardoai',
  twitter: 'https://twitter.com/LeonardoAi_',
  x: 'https://x.com/LeonardoAi_',

  // Product & Info
  leonardoApp: 'https://app.leonardo.ai/',
  website: 'https://leonardo.ai/',
  learn: 'https://leonardo.ai/learn/',
  pricing: 'https://leonardo.ai/pricing/',
  contact: 'https://leonardo.ai/contact-us/',
  feedback: 'https://form.typeform.com/to/pJipzFDV',
  registerInterestForm: 'https://leonardo.ai/team-plans/#brxe-bcvkid',

  // Help & Documentation
  faq: 'https://intercom.help/leonardo-ai/en/',
  teamsFaq: 'https://intercom.help/leonardo-ai/en/collections/9525073-teams',
  apiUserDocs: 'https://docs.leonardo.ai/reference/getuserself',

  // Policies & Legal
  termsOfService: 'https://leonardo.ai/terms-of-service/',
  dmcaPolicy: 'https://leonardo.ai/dmca-policy/',
  privacyPolicy: 'https://leonardo.ai/privacy-policy/',

  // Canva Integration
  canvaBilling: 'https://www.canva.com/settings/billing-and-teams',
  canvaForBusiness: 'https://www.canva.com/business/features/leonardo-ai/',
  canvaFaq: 'https://intercom.help/leonardo-ai/en/articles/12795847-leonardo-access-for-canva-business-users-faq',

  // PayPal
  paypalAccount: 'https://www.paypal.com/myaccount',
  paypalSandboxAccount: 'https://sandbox.paypal.com/myaccount',
} as const;

export type ExternalUrl = keyof typeof ExternalUrls;
