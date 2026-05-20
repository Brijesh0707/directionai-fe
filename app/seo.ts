import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://directionai.in';
const siteName = 'Direction AI';
const defaultTitle = 'Direction AI | Build, Research, Market, and Ship Faster';
const defaultDescription =
  'Direction AI helps founders and teams turn ideas into execution with AI-powered research, marketing, product strategy, and development workflows.';
const ogImagePath = '/Banner.png';

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
  openGraph: {
    type: 'website',
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: 'Direction AI Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/LOGO.png',
    shortcut: '/LOGO.png',
    apple: '/LOGO.png',
  },
  alternates: {
    canonical: '/',
  },
};

export function createPageMetadata(config: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: config.path,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.path,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: 'Direction AI Banner',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImagePath],
    },
  };
}
