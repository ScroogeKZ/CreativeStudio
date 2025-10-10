import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  lang?: string;
}

export function SEO({
  title = 'Creative Studio - Креативное Маркетинговое Агентство',
  description = 'Профессиональное маркетинговое агентство в Казахстане. Брендинг, дизайн, digital-маркетинг, SMM, веб-разработка и контент-маркетинг.',
  keywords = 'маркетинг, брендинг, дизайн, digital marketing, SMM, веб-разработка, контент, Казахстан, Алматы',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  lang = 'ru',
}: SEOProps) {
  const fullTitle = title.includes('Creative Studio') ? title : `${title} | Creative Studio`;
  
  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:locale" content={lang === 'ru' ? 'ru_RU' : lang === 'kz' ? 'kk_KZ' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
