import { SERVICES } from '@/lib/data/services'
import { INDUSTRIES } from '@/lib/data/industries'
import { CASE_STUDIES } from '@/lib/data/case-studies'
import { BLOGS } from '@/lib/data/blogs'

const base = 'https://therapidrevenue.in'

export default function sitemap() {
  const now = new Date()
  const staticPaths = ['', 'about', 'founder', 'philosophy', 'framework', 'scale-engineering', 'sprint', 'anti-rto', 'results', 'contact', 'faq', 'privacy', 'terms', 'cookies', 'services', 'industries', 'case-studies', 'blog', 'resources', 'calculator', 'library']
  return [
    ...staticPaths.map(p => ({ url: `${base}/${p}`, lastModified: now, changeFrequency: 'monthly', priority: p === '' ? 1.0 : 0.7 })),
    ...SERVICES.map(s => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...INDUSTRIES.map(i => ({ url: `${base}/industries/${i.slug}`, lastModified: now, priority: 0.7 })),
    ...CASE_STUDIES.map(c => ({ url: `${base}/case-studies/${c.slug}`, lastModified: now, priority: 0.7 })),
    ...BLOGS.map(b => ({ url: `${base}/blog/${b.slug}`, lastModified: now, priority: 0.6 })),
  ]
}
