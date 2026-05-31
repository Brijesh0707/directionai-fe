import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://directionai.in';
const siteName = 'Direction AI';
const defaultTitle = 'Direction AI | Build, Research, Market, and Ship Faster';
const defaultDescription =
  'Direction AI helps founders and teams turn ideas into execution with AI-powered research, marketing, product strategy, and development workflows.';
const ogImagePath = '/Banner.png';

// Convert to absolute URL for social platforms
const absoluteOGImage = `https://directionai.sourcesparktech.in/Banner.png`;
const absoluteLogo = `${siteUrl}/LOGO.png`;

export const sharedKeywords = [
  'Direction AI',
  'AI startup assistant',
  'market research AI',
  'pitch deck AI',
  'marketing strategy AI',
  'product development AI',
  'startup workflow automation',
];

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | Direction AI',
  },
  description: defaultDescription,
  keywords: sharedKeywords,
  applicationName: siteName,
  authors: [{ name: 'Direction AI' }],
  creator: 'Direction AI',
  publisher: 'Direction AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    images: [
      {
        url: absoluteOGImage,
        width: 1200,
        height: 630,
        alt: 'Direction AI - Build, Research, Market, and Ship Faster',
        type: 'image/png',
        secureUrl: absoluteOGImage,
      },
    ],
    locale: 'en_US',
    countryName: 'India',
    emails: ['contact@directionai.in'],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [absoluteOGImage],
    site: '@DirectionAI',
    creator: '@DirectionAI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    // Add other verifications as needed
  },
  icons: {
    icon: [
      { url: absoluteLogo, sizes: 'any' },
      { url: absoluteLogo, type: 'image/png' },
    ],
    shortcut: absoluteLogo,
    apple: [
      { url: absoluteLogo, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: absoluteLogo,
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': '/',
      'en-IN': '/',
    },
  },
  category: 'technology',
  classification: 'AI-Powered Business Tools',
};

export function createPageMetadata(config: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageUrl = `${siteUrl}${config.path}`;
  const pageImage = config.image ? `${siteUrl}${config.image}` : absoluteOGImage;

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: pageUrl,
      type: 'website',
      siteName,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: config.title,
          type: 'image/png',
          secureUrl: pageImage,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [pageImage],
      site: '@DirectionAI',
      creator: '@DirectionAI',
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
    },
  };
}

// JSON-LD structured data for better SEO
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: absoluteLogo,
  image: absoluteOGImage,
  description: defaultDescription,
  sameAs: [
    'https://twitter.com/DirectionAI',
    'https://linkedin.com/company/direction-ai',
    'https://github.com/direction-ai',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@directionai.in',
    availableLanguage: ['English'],
  },
};

export const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};