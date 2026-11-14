export const CATEGORIES = [
  { slug: 'guides', label: 'Guides', description: 'Long-form playbooks and strategy documents.' },
  { slug: 'templates', label: 'Templates', description: 'Ready-to-use templates and swipe files.' },
  { slug: 'calculators', label: 'Calculators', description: 'Interactive tools to model your numbers.' },
  { slug: 'checklists', label: 'Checklists', description: 'Step-by-step operational checklists.' },
  { slug: 'frameworks', label: 'Frameworks', description: 'Proprietary methodologies and mental models.' },
  { slug: 'videos', label: 'Videos', description: 'On-demand video content and masterclasses.' },
  { slug: 'webinars', label: 'Webinars', description: 'Live and recorded workshop sessions.' },
  { slug: 'downloads', label: 'Downloads', description: 'Miscellaneous premium downloads.' },
]

export const TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Video' },
  { value: 'notion', label: 'Notion' },
  { value: 'sheet', label: 'Spreadsheet' },
  { value: 'calculator', label: 'Interactive Calculator' },
  { value: 'external', label: 'External Link' },
]

export const SEED_RESOURCES = [
  { title: 'The Profit Engineering™ Playbook (2025)', category: 'guides', type: 'pdf', tags: ['Profit Engineering', 'D2C', 'Strategy'], description: 'The complete 5-pillar Profit Engineering methodology documented in a 40-page playbook.', url: 'https://example.com/resources/profit-engineering-playbook.pdf', featured: true },
  { title: 'Anti-RTO Engine™ Implementation Guide', category: 'guides', type: 'pdf', tags: ['RTO', 'Ops', 'Fashion', 'Apparel'], description: 'End-to-end SOPs, scripts and frameworks for reducing Return-to-Origin losses.', url: 'https://therapidrevenue.in/are', featured: true },
  { title: 'D2C Contribution Margin Calculator', category: 'calculators', type: 'calculator', tags: ['Unit Economics', 'CM', 'P&L'], description: 'Model your per-order contribution margin across all SKUs.', url: '/calculator', featured: true },
  { title: 'Ecommerce Profit Calculator', category: 'calculators', type: 'calculator', tags: ['P&L', 'MER', 'RTO'], description: 'Interactive dashboard for diagnosing profit leaks and modeling growth potential.', url: '/calculator', featured: false },
  { title: 'Meta Ads Creative Brief Template', category: 'templates', type: 'notion', tags: ['Meta Ads', 'Creative'], description: 'A structured Notion template for briefing direct-response creative to designers.', url: 'https://notion.so/example', featured: false },
  { title: 'Shopify Store Audit Checklist (60 points)', category: 'checklists', type: 'pdf', tags: ['Shopify', 'CRO', 'Audit'], description: 'The exact 60-point checklist we run before every Shopify engagement.', url: 'https://example.com/shopify-audit.pdf', featured: false },
  { title: 'Pre-Scale Readiness Checklist', category: 'checklists', type: 'pdf', tags: ['Scaling', 'Strategy'], description: '25-point checklist to run before increasing your ad budget.', url: 'https://example.com/pre-scale.pdf', featured: false },
  { title: 'The Profit Engineering™ Framework Map', category: 'frameworks', type: 'pdf', tags: ['Framework', 'Strategy'], description: 'One-page visual map of the entire Profit Engineering framework.', url: 'https://example.com/framework-map.pdf', featured: true },
  { title: 'Scale Engineering™ Budget Model', category: 'frameworks', type: 'sheet', tags: ['Scaling', 'Budget', 'Forecasting'], description: 'Google Sheet forecasting model tied to contribution margin.', url: 'https://docs.google.com/spreadsheets/example', featured: false },
  { title: 'How Skincare Brand Went 4x on Contribution Margin (Video)', category: 'videos', type: 'video', tags: ['Case Study', 'Skincare'], description: 'A 22-minute breakdown of the exact framework we used to 4x contribution margin.', url: 'https://youtube.com/watch?v=example', featured: false },
  { title: 'Profit Engineering Sprint™ Recording', category: 'webinars', type: 'video', tags: ['Workshop', 'Live'], description: 'Full 3-hour recording of our flagship live implementation workshop.', url: 'https://lp1.therapidrevenue.in/profit-engineering-sprint', featured: true },
  { title: 'RTO Cost Modeling Spreadsheet', category: 'calculators', type: 'sheet', tags: ['RTO', 'Ops', 'Finance'], description: 'Model the true cost of RTO on your P&L, cash flow and working capital.', url: 'https://docs.google.com/spreadsheets/example2', featured: false },
  { title: 'Klaviyo Flows Setup Guide', category: 'guides', type: 'pdf', tags: ['Email', 'Retention', 'Klaviyo'], description: 'The 11 flows every D2C brand should have live in Klaviyo.', url: 'https://example.com/klaviyo-guide.pdf', featured: false },
  { title: 'WhatsApp Order Confirmation Script Pack', category: 'templates', type: 'notion', tags: ['WhatsApp', 'RTO', 'Ops'], description: 'Copy-paste WhatsApp scripts for confirmation, address correction, and delivery ETA.', url: 'https://notion.so/example2', featured: false },
  { title: 'Amazon India Growth Framework', category: 'frameworks', type: 'pdf', tags: ['Amazon', 'Marketplace'], description: 'A structured framework for scaling on Amazon India profitably.', url: 'https://example.com/amazon-framework.pdf', featured: false },
]
