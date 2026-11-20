// The editable page copy and approved evidence excerpts live here.
export const philosophy = [
  { title: 'Acquisition', text: 'Find the right demand.', icon: 'target' },
  { title: 'Conversion', text: 'Remove checkout friction.', icon: 'cart' },
  { title: 'Fulfillment', text: 'Protect delivery economics.', icon: 'truck' },
]

export const matrix = [
  { title: 'Psychology', text: 'Understand why customers buy.', icon: 'brain' },
  { title: 'Messaging', text: 'Create resonance before reach.', icon: 'message' },
  { title: 'Conversion', text: 'Turn intent into completed orders.', icon: 'cart' },
  { title: 'Profit', text: 'Guard against hidden revenue leaks.', icon: 'shield' },
  { title: 'Scale', text: 'Increase spend with better controls.', icon: 'growth' },
]

export const capabilities = [
  { title: 'Paid Media', text: 'Meta Ads and Google Ads account structure, testing and optimization.', icon: 'target' },
  { title: 'Creative Strategy', text: 'Hooks, messages and performance-oriented creative iteration.', icon: 'creative' },
  { title: 'Checkout & CRO', text: 'Identify and improve friction throughout the buying journey.', icon: 'cart' },
  { title: 'COD Controls', text: 'Order-verification workflows and operational risk reduction.', icon: 'shield' },
  { title: 'Delivery Operations', text: 'Courier allocation and fulfillment-related performance levers.', icon: 'truck' },
  { title: 'Reporting', text: 'Track signals beyond platform ROAS, with suitable data access.', icon: 'chart' },
]

export const interventions = [
  'Restructured Meta Ads campaigns',
  'Improved advertising creatives',
  'Introduced COD verification',
  'Optimised courier allocation',
  'Modified the checkout process',
]

export const evidenceCategories = ['All evidence', 'Shopify Analytics', 'Meta Ads', 'Other Performance Snapshots']

function evidenceImage(name, width, height, alt) {
  const base = `/images/portfolio/${name}`
  const fullSrc = `${base}.webp`
  const src = width > 640 ? `${base}-560.webp` : fullSrc
  const srcSet = src === fullSrc ? undefined : `${src} 560w, ${fullSrc} ${width}w`
  return { src, srcSet, fullSrc, width, height, alt }
}

// Owner approval covers these redacted excerpts.
export const evidence = [
  {
    id: 'fashion', category: 'Shopify Analytics', platform: 'Shopify',
    title: 'Fashion account operating view', reference: 'RR-EV-019',
    period: 'Selected 365-day view; exact dates pending verification',
    description: 'Gross sales and order activity in a selected platform window.',
    qualification: 'The percentage changes are Shopify comparisons with a separate period. The 365-day view does not verify the featured 60-day RTO or ROAS estimates.',
    approved: true,
    image: evidenceImage('fashion-overview', 512, 128, 'Shopify gross sales of ₹1,649,249 and 1,168 orders in the selected 365-day view. Shopify shows comparison changes of 347% and 362%, respectively.'),
  },
  {
    id: 'beauty', category: 'Shopify Analytics', platform: 'Shopify',
    title: 'Beauty traffic & conversion', reference: 'RR-EV-021',
    period: 'Selected window; reporting dates pending verification',
    description: 'Sessions and platform-displayed conversion rate in one operating view.',
    qualification: 'These figures describe the selected Shopify window. Account attribution and incremental impact remain unverified.',
    approved: true,
    image: evidenceImage('beauty-traffic', 1042, 335, 'Shopify charts showing 11,346 sessions and a 1.65% platform-reported conversion rate in the selected window.'),
  },
  {
    id: 'skincare', category: 'Shopify Analytics', platform: 'Shopify',
    title: 'Skincare channel context', reference: 'RR-EV-020',
    period: 'Selected window; reporting dates pending verification',
    description: 'Channel sales, sessions and conversion definitions require reconciliation.',
    qualification: 'The conversion panels were omitted because the source figures need reconciliation. Sales and sessions describe the selected window.',
    approved: true,
    image: evidenceImage('skincare-sessions', 513, 676, 'Shopify panels showing approximately ₹2.4 lakh in channel sales and 833 sessions in the selected window.'),
  },
  {
    id: 'meta-performance', category: 'Meta Ads', platform: 'Meta Ads',
    title: 'Ad-set performance view', reference: 'RR-EV-023',
    period: 'Selected window; reporting dates pending verification',
    description: 'An operational view of link-click costs and platform-reported advertising returns.',
    qualification: 'An execution artifact from a separate reporting window; it is not evidence of incremental lift or featured-case attribution.',
    approved: true,
    image: evidenceImage('meta-ad-set', 548, 233, 'Three Meta Ads rows. Link clicks: 77, 79 and 91. Cost per unique link click: ₹4.90, ₹4.92 and ₹4.04. Purchase ROAS: 3.98, 10.66 and 7.34.'),
  },
  {
    id: 'meta-delivery', category: 'Meta Ads', platform: 'Meta Ads',
    title: 'Spend, reach & impressions', reference: 'RR-EV-026',
    period: 'Selected window; reporting dates pending verification',
    description: 'Delivery and spend signals used to inspect advertising operations.',
    qualification: 'The excerpt shows delivery metrics with campaign names, IDs and budget settings removed. Platform activity alone does not establish business profitability.',
    approved: true,
    image: evidenceImage('meta-delivery', 549, 234, 'Three Meta Ads rows for spend, impressions and reach. Row 1: ₹1,476.24, 29,406, 25,033. Row 2: ₹1,529.94, 50,873, 43,543. Row 3: ₹2,072.16, 55,137, 46,971.'),
  },
  {
    id: 'other-shopify', category: 'Other Performance Snapshots', platform: 'Shopify',
    title: 'Separate gross-sales windows', reference: 'RR-EV-024 / RR-EV-025',
    period: 'Two distinct windows; dates and definitions pending verification',
    description: 'Additional account observations, kept separate from the featured case.',
    qualification: 'These observations must not be combined as agency revenue or described as attributable sales lift.',
    approved: true,
    image: evidenceImage('shopify-sales-windows', 810, 130, 'Two separate Shopify gross sales tiles. RR-EV-024: ₹5,687,282. RR-EV-025: ₹3,937,472. Each tile represents its own reporting window.'),
  },
]

export const additionalSnapshots = [
  { title: 'Beauty & personal care', label: 'Traffic and conversion', text: 'Sessions and platform-reported conversion rate from a selected Shopify window. Incremental impact remains unverified.', reference: 'RR-EV-021' },
  { title: 'Skincare', label: 'Channel measurement', text: 'Channel sales and sessions require context. Inconsistent conversion metrics remain unresolved.', reference: 'RR-EV-020' },
  { title: 'Additional Shopify accounts', label: 'Separate sales windows', text: 'Two gross-sales observations from different windows. No consolidated agency total.', reference: 'RR-EV-024 / RR-EV-025' },
  { title: 'Meta Ads operations', label: 'Advertising activity', text: 'Ad-set performance, spend, reach and impressions. No causal attribution to the featured case.', reference: 'RR-EV-023 / RR-EV-026' },
]

export const scorecard = [
  { title: 'Acquisition', metrics: 'CAC / CPC / CPM', text: 'The cost and quality of demand.', icon: 'target' },
  { title: 'Conversion', metrics: 'CVR / Checkout', text: 'How buying intent becomes orders.', icon: 'cart' },
  { title: 'Fulfillment', metrics: 'RTO / Delivery', text: 'How orders become realised revenue.', icon: 'truck' },
  { title: 'Economics', metrics: 'Contribution Margin / AOV / LTV', text: 'What remains after costs, and customer value over time.', icon: 'chart' },
]

export const expertise = [
  { title: 'Performance Marketing', text: 'Meta and Google campaign structure and iteration.', icon: 'target' },
  { title: 'Growth Strategy', text: 'Customer psychology, positioning, offers and funnels.', icon: 'brain' },
  { title: 'CRO & Checkout', text: 'Site journey, friction audits and conversion experiments.', icon: 'cart' },
  { title: 'Profit & RTO Systems', text: 'COD verification and delivery economics controls.', icon: 'shield' },
  { title: 'Creative & Content', text: 'Ad concepts, performance creatives and messaging.', icon: 'creative' },
  { title: 'Analytics & Reporting', text: 'Outcome dashboards, weekly insights and decision rules.', icon: 'chart' },
]

export const process = [
  { title: 'Diagnose', text: 'Audit acquisition, funnel and post-purchase leakage.' },
  { title: 'Prioritise', text: 'Rank actions by upside, confidence and implementation effort.' },
  { title: 'Execute', text: 'Deploy controlled changes in ads, creative and operations.' },
  { title: 'Measure', text: 'Review outcomes against contribution and delivery metrics.' },
]
