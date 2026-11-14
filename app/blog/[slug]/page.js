import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import FAQ from '@/components/site/faq'
import { BLOGS, getBlog } from '@/lib/data/blogs'
import { SITE } from '@/lib/site-config'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { articleSchema, breadcrumbSchema, JsonLd } from '@/components/seo/schemas'

export async function generateStaticParams() { return BLOGS.map(b => ({ slug: b.slug })) }
export async function generateMetadata({ params }) {
  const p = await params; const b = getBlog(p.slug); if (!b) return {}
  return {
    title: b.seoTitle,
    description: b.metaDescription,
    keywords: [b.keyword, b.category, 'D2C', 'Ecommerce India', ...(b.toc || [])].join(', '),
    alternates: { canonical: `${SITE.url}/blog/${b.slug}` },
    openGraph: {
      title: b.seoTitle, description: b.metaDescription, type: 'article',
      url: `${SITE.url}/blog/${b.slug}`, publishedTime: b.date,
      authors: [`${SITE.url}/founder`], section: b.category,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: b.title }],
    },
    twitter: { card: 'summary_large_image', title: b.seoTitle, description: b.metaDescription },
  }
}

function renderBody(body) {
  const lines = body.split('\n')
  const nodes = []
  let list = null; let listType = null
  const pushList = () => { if (list) { const Tag = listType === 'ol' ? 'ol' : 'ul'; nodes.push(<Tag key={nodes.length} className={`${listType==='ol'?'list-decimal':'list-disc'} pl-6 space-y-2 my-4 text-[16px] text-neutral-300`}>{list}</Tag>); list = null; listType = null } }
  const inline = (t) => {
    const parts = []; let rest = t; let key = 0
    const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
    let m; let last = 0
    while ((m = re.exec(rest)) !== null) {
      if (m.index > last) parts.push(rest.slice(last, m.index))
      if (m[1]) parts.push(<strong key={key++} className="text-white font-semibold">{m[1]}</strong>)
      else if (m[2]) parts.push(<em key={key++} className="italic">{m[2]}</em>)
      last = re.lastIndex
    }
    if (last < rest.length) parts.push(rest.slice(last))
    return parts
  }
  lines.forEach((line, i) => {
    if (line.startsWith('## ')) { pushList(); nodes.push(<h2 key={i} className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient mt-14 mb-4">{line.slice(3)}</h2>) }
    else if (line.startsWith('### ')) { pushList(); nodes.push(<h3 key={i} className="text-xl md:text-2xl font-semibold text-white mt-8 mb-3">{line.slice(4)}</h3>) }
    else if (/^\d+\. /.test(line)) { if (listType !== 'ol') { pushList(); list = []; listType = 'ol' } list.push(<li key={i}>{inline(line.replace(/^\d+\. /, ''))}</li>) }
    else if (line.startsWith('- ')) { if (listType !== 'ul') { pushList(); list = []; listType = 'ul' } list.push(<li key={i}>{inline(line.slice(2))}</li>) }
    else if (line.trim() === '') { pushList() }
    else { pushList(); nodes.push(<p key={i} className="my-4 text-[16px] text-neutral-300 leading-relaxed">{inline(line)}</p>) }
  })
  pushList()
  return nodes
}

export default async function BlogPost({ params }) {
  const p = await params; const b = getBlog(p.slug); if (!b) return notFound()
  const article = articleSchema({ headline: b.title, description: b.metaDescription, slug: b.slug, category: b.category, date: b.date, readingTime: b.readingTime })
  const crumbs = breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: b.category }])
  const related = BLOGS.filter(x => x.slug !== b.slug).slice(0, 3)
  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      <PageHero eyebrow={`${b.category} · ${b.readingTime}`} title={b.title} subtitle={b.excerpt} breadcrumbs={[{label:'Blog',href:'/blog'},{label:b.category}]} />
      <article className="px-6 py-12"><div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 mb-10"><div className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-3">Table of contents</div><ol className="list-decimal pl-5 space-y-1.5 text-[14px] text-neutral-300">{b.toc.map((t,i)=>(<li key={i}>{t}</li>))}</ol></div>
        <div className="prose-invert">{renderBody(b.body)}</div>
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center"><h3 className="text-2xl font-semibold">Want us to engineer this for your brand?</h3><a href={SITE.calendly} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-[14px] font-medium">Book Strategy Call<ArrowRight className="h-4 w-4" /></a></div>
      </div></article>
      <section className="py-16 px-6"><div className="max-w-4xl mx-auto"><h3 className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">Related essays</h3><div className="grid md:grid-cols-3 gap-3">{related.map(r=>(<Link key={r.slug} href={`/blog/${r.slug}`} className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 hover:border-white/20"><div className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{r.category}</div><div className="mt-2 text-[15px] font-semibold text-white line-clamp-3">{r.title}</div></Link>))}</div></div></section>
    </main>
  )
}
