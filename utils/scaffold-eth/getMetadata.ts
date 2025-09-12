import type { Metadata } from 'next';

interface MetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Generate Next.js metadata for Scaffold-ETH 2 applications
 * This utility function creates consistent metadata across the application
 */
export const getMetadata = (options: MetadataOptions): Metadata => {
  const { title, description, image, url } = options;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/images/og-image.png`;

  return {
    title: {
      template: '%s | Rovify',
      default: title,
    },
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Rovify',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
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
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
};
