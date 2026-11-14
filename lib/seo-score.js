/* SEO scoring utility — client-side heuristic scoring for the admin editor */

export function scoreSEO({ title = '', description = '', tags = [], url = '', category = '' }) {
  const checks = []
  const push = (ok, weight, label, hint) => checks.push({ ok, weight, label, hint })

  const titleLen = title.trim().length
  push(titleLen >= 30 && titleLen <= 65, 15, 'Title length 30–65 chars', `Currently ${titleLen} chars — aim for 50–60 for best SERP display.`)
  push(/[A-Z0-9]/.test(title), 5, 'Title has uppercase / numbers', 'Use proper case and numbers when relevant (year, count).')
  push(titleLen > 0, 5, 'Title present', 'Every resource needs a title.')

  const descLen = description.trim().length
  push(descLen >= 100 && descLen <= 200, 20, 'Description 100–200 chars', `Currently ${descLen}. Aim for a rich single-sentence hook.`)
  push(descLen > 0, 5, 'Description present', 'Add a compelling description.')

  push(Array.isArray(tags) && tags.length >= 3, 15, 'At least 3 tags', 'Tags power internal linking and taxonomy.')
  push(Array.isArray(tags) && tags.length > 0 && tags.length <= 8, 5, 'Not over-tagged (≤8)', 'Keep tags focused.')

  push(!!url && /^(https?:\/\/|\/)/.test(url), 15, 'Valid resource URL', 'Must start with http(s):// or /')
  push(!!category, 10, 'Category selected', 'Pick a category for taxonomy.')

  const kwHits = tags.filter(t => title.toLowerCase().includes(t.toLowerCase())).length
  push(kwHits > 0, 5, 'Primary tag echoed in title', 'Include at least one tag keyword in the title.')

  const total = checks.reduce((s, c) => s + c.weight, 0)
  const scored = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0)
  const score = Math.round((scored / total) * 100)
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F'
  const passed = checks.filter(c => c.ok).length
  return { score, grade, checks, passed, total: checks.length }
}
