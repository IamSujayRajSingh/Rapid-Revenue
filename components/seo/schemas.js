import { SITE } from '@/lib/site-config'

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rapid Revenue',
  legalName: 'Rapid Revenue',
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  description: SITE.description,
  founder: { '@type': 'Person', name: SITE.founder, jobTitle: SITE.founderTitle },
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
  contactPoint: { '@type': 'ContactPoint', email: SITE.email, telephone: SITE.phone, contactType: 'customer support', areaServed: 'IN' },
  sameAs: Object.values(SITE.social),
  slogan: 'Scale Smarter. Grow Profitably.',
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rapid Revenue',
  url: SITE.url,
  potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/library?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: it.href ? `${SITE.url}${it.href}` : undefined,
    })),
  }
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(it => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function articleSchema({ headline, description, slug, category, date, readingTime }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${SITE.url}/blog/${slug}`,
    mainEntityOfPage: `${SITE.url}/blog/${slug}`,
    image: `${SITE.url}/og.png`,
    author: {
      '@type': 'Person',
      name: SITE.founder,
      jobTitle: SITE.founderTitle,
      url: `${SITE.url}/founder`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rapid Revenue',
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
    },
    datePublished: date || '2025-05-01',
    dateModified: date || '2025-05-01',
    articleSection: category,
    ...(readingTime ? { timeRequired: readingTime } : {}),
  }
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Rapid Revenue',
    image: `${SITE.url}/og.png`,
    '@id': SITE.url,
    url: SITE.url,
    telephone: SITE.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
    priceRange: '₹₹₹',
    areaServed: { '@type': 'Country', name: 'India' },
  }
}

export function JsonLd({ data }) {
  if (!data) return null
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
