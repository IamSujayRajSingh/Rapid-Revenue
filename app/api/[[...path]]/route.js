import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { SEED_RESOURCES } from '@/lib/data/resource-seed'

// Storage: Cloudflare D1 (SQLite). The `DB` binding is declared in wrangler.jsonc.
// Tables are created on first use, so a new database needs no manual setup.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'downloads',
    type TEXT NOT NULL DEFAULT 'pdf',
    tags TEXT NOT NULL DEFAULT '[]',
    url TEXT NOT NULL DEFAULT '',
    featured INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    downloadCount INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources (slug)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT, brand TEXT, revenue TEXT, message TEXT,
    source TEXT, resourceId TEXT, resourceTitle TEXT,
    createdAt TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON leads (createdAt)`,
]

let schemaReady = false
async function getDb() {
  const db = getCloudflareContext().env.DB
  if (!db) throw new Error('Database binding "DB" is not configured')
  if (!schemaReady) {
    await db.batch(SCHEMA.map(sql => db.prepare(sql)))
    schemaReady = true
  }
  return db
}

function json(data, status = 200) { return NextResponse.json(data, { status }) }
function slugify(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function parseTags(tags) { return Array.isArray(tags) ? tags.map(String) : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []) }
function isAdmin(request) {
  const key = request.headers.get('x-admin-key')
  return key && key === process.env.ADMIN_PASSWORD
}

function toResource(row) {
  return { ...row, tags: JSON.parse(row.tags || '[]'), featured: !!row.featured, published: !!row.published }
}
function toLead(row) {
  return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== null))
}

const RESOURCE_COLUMNS = ['id', 'title', 'slug', 'description', 'category', 'type', 'tags', 'url', 'featured', 'published', 'downloadCount', 'createdAt', 'updatedAt']
function insertResource(db, doc, orIgnore = false) {
  return db
    .prepare(`INSERT ${orIgnore ? 'OR IGNORE ' : ''}INTO resources (${RESOURCE_COLUMNS.join(', ')}) VALUES (${RESOURCE_COLUMNS.map(() => '?').join(', ')})`)
    .bind(doc.id, doc.title, doc.slug, doc.description, doc.category, doc.type, JSON.stringify(doc.tags), doc.url, doc.featured ? 1 : 0, doc.published ? 1 : 0, doc.downloadCount, doc.createdAt, doc.updatedAt)
}
const LEAD_COLUMNS = ['id', 'name', 'email', 'phone', 'brand', 'revenue', 'message', 'source', 'resourceId', 'resourceTitle', 'createdAt']
function insertLead(db, doc) {
  return db
    .prepare(`INSERT INTO leads (${LEAD_COLUMNS.join(', ')}) VALUES (${LEAD_COLUMNS.map(() => '?').join(', ')})`)
    .bind(...LEAD_COLUMNS.map(c => doc[c] ?? null))
}

async function ensureSeed(db) {
  const count = await db.prepare('SELECT COUNT(*) AS n FROM resources').first('n')
  if (count > 0 || !SEED_RESOURCES.length) return
  const now = new Date().toISOString()
  // Fixed ids + INSERT OR IGNORE: two requests seeding at the same time cannot create duplicates.
  await db.batch(SEED_RESOURCES.map(r => insertResource(db, {
    id: `seed-${slugify(r.title)}`,
    title: r.title,
    slug: slugify(r.title),
    description: r.description,
    category: r.category,
    type: r.type,
    tags: r.tags || [],
    url: r.url,
    featured: !!r.featured,
    downloadCount: 0,
    published: true,
    createdAt: now,
    updatedAt: now,
  }, true)))
}

export async function GET(request, { params }) {
  const p = await params
  const path = (p?.path || []).join('/')
  const url = new URL(request.url)
  try {
    const db = await getDb()

    if (path === '' || path === 'health') return json({ status: 'ok', ts: new Date().toISOString() })

    // Public resources list
    if (path === 'resources') {
      await ensureSeed(db)
      const q = url.searchParams.get('q') || ''
      const category = url.searchParams.get('category') || ''
      const tag = url.searchParams.get('tag') || ''
      const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1)
      const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '12', 10) || 12, 1), 60)
      const featured = url.searchParams.get('featured')
      const where = ['published = 1']
      const args = []
      if (category) { where.push('category = ?'); args.push(category) }
      if (tag) { where.push('EXISTS (SELECT 1 FROM json_each(resources.tags) WHERE json_each.value = ?)'); args.push(tag) }
      if (featured === 'true') where.push('featured = 1')
      if (q) {
        // Case-insensitive "contains" on title, description and each tag.
        const needle = q.toLowerCase()
        where.push(`(instr(lower(title), ?) > 0 OR instr(lower(description), ?) > 0
          OR EXISTS (SELECT 1 FROM json_each(resources.tags) WHERE instr(lower(json_each.value), ?) > 0))`)
        args.push(needle, needle, needle)
      }
      const cond = where.join(' AND ')
      const total = await db.prepare(`SELECT COUNT(*) AS n FROM resources WHERE ${cond}`).bind(...args).first('n')
      const { results } = await db
        .prepare(`SELECT * FROM resources WHERE ${cond} ORDER BY featured DESC, createdAt DESC, rowid LIMIT ? OFFSET ?`)
        .bind(...args, limit, (page - 1) * limit)
        .all()
      return json({ items: results.map(toResource), total, page, limit, pages: Math.ceil(total / limit) })
    }

    if (path === 'resources/tags') {
      await ensureSeed(db)
      const { results } = await db
        .prepare('SELECT DISTINCT json_each.value AS tag FROM resources, json_each(resources.tags) WHERE resources.published = 1')
        .all()
      return json({ tags: results.map(r => r.tag).sort() })
    }

    if (path.startsWith('resources/')) {
      const slug = path.replace('resources/', '')
      const row = await db.prepare('SELECT * FROM resources WHERE slug = ? AND published = 1 ORDER BY rowid LIMIT 1').bind(slug).first()
      if (!row) return json({ error: 'Not found' }, 404)
      return json(toResource(row))
    }

    // Admin listing (all resources including drafts)
    if (path === 'admin/resources') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
      await ensureSeed(db)
      const { results } = await db.prepare('SELECT * FROM resources ORDER BY createdAt DESC, rowid').all()
      return json({ items: results.map(toResource) })
    }

    // Admin leads listing
    if (path === 'admin/leads') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
      const { results } = await db.prepare('SELECT * FROM leads ORDER BY createdAt DESC LIMIT 200').all()
      return json({ items: results.map(toLead) })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    return json({ error: e.message || 'Server error' }, 500)
  }
}

export async function POST(request, { params }) {
  const p = await params
  const path = (p?.path || []).join('/')
  try {
    const body = await request.json().catch(() => ({}))
    const db = await getDb()

    if (path === 'lead') {
      const doc = { id: crypto.randomUUID(), name: String(body.name || ''), email: String(body.email || ''), phone: String(body.phone || ''), brand: String(body.brand || ''), revenue: String(body.revenue || ''), message: String(body.message || ''), source: String(body.source || 'homepage'), createdAt: new Date().toISOString() }
      await insertLead(db, doc).run()
      return json({ ok: true, id: doc.id })
    }

    // Public: email-gated download
    if (path === 'resources/download') {
      const { resourceId, email, name, brand } = body
      if (!resourceId || !email) return json({ error: 'Missing resourceId or email' }, 400)
      const item = await db.prepare('SELECT * FROM resources WHERE id = ? AND published = 1').bind(String(resourceId)).first()
      if (!item) return json({ error: 'Resource not found' }, 404)
      await db.batch([
        db.prepare('UPDATE resources SET downloadCount = downloadCount + 1 WHERE id = ?').bind(item.id),
        insertLead(db, {
          id: crypto.randomUUID(), email: String(email), name: String(name || ''), brand: String(brand || ''),
          source: `library:${item.slug}`,
          resourceId: item.id, resourceTitle: item.title,
          createdAt: new Date().toISOString(),
        }),
      ])
      return json({ ok: true, url: item.url, title: item.title, type: item.type })
    }

    if (path === 'admin/login') {
      const { password } = body
      if (!password || password !== process.env.ADMIN_PASSWORD) return json({ error: 'Invalid password' }, 401)
      return json({ ok: true, token: password })
    }

    if (path === 'admin/resources') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
      const now = new Date().toISOString()
      const doc = {
        id: crypto.randomUUID(),
        title: String(body.title || 'Untitled'),
        slug: body.slug ? slugify(body.slug) : slugify(body.title || 'untitled') + '-' + Math.random().toString(36).slice(2, 6),
        description: String(body.description || ''),
        category: String(body.category || 'downloads'),
        type: String(body.type || 'pdf'),
        tags: parseTags(body.tags),
        url: String(body.url || ''),
        featured: !!body.featured,
        published: body.published !== false,
        downloadCount: 0,
        createdAt: now, updatedAt: now,
      }
      await insertResource(db, doc).run()
      return json({ ok: true, item: doc })
    }

    return json({ error: 'Not found' }, 404)
  } catch (e) {
    return json({ error: e.message || 'Server error' }, 500)
  }
}

export async function PUT(request, { params }) {
  const p = await params
  const path = (p?.path || []).join('/')
  try {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
    const body = await request.json().catch(() => ({}))
    const db = await getDb()

    if (path.startsWith('admin/resources/')) {
      const id = path.replace('admin/resources/', '')
      const set = { updatedAt: new Date().toISOString() }
      for (const k of ['title', 'description', 'category', 'type', 'url']) if (body[k] !== undefined) set[k] = String(body[k])
      for (const k of ['featured', 'published']) if (body[k] !== undefined) set[k] = body[k] ? 1 : 0
      if (body.slug !== undefined) set.slug = slugify(body.slug)
      if (body.tags !== undefined) set.tags = JSON.stringify(parseTags(body.tags))
      const cols = Object.keys(set)
      const r = await db.prepare(`UPDATE resources SET ${cols.map(c => `${c} = ?`).join(', ')} WHERE id = ?`).bind(...cols.map(c => set[c]), id).run()
      if (r.meta.changes === 0) return json({ error: 'Not found' }, 404)
      const row = await db.prepare('SELECT * FROM resources WHERE id = ?').bind(id).first()
      return json({ ok: true, item: toResource(row) })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) { return json({ error: e.message }, 500) }
}

export async function DELETE(request, { params }) {
  const p = await params
  const path = (p?.path || []).join('/')
  try {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
    const db = await getDb()
    if (path.startsWith('admin/resources/')) {
      const id = path.replace('admin/resources/', '')
      const r = await db.prepare('DELETE FROM resources WHERE id = ?').bind(id).run()
      if (r.meta.changes === 0) return json({ error: 'Not found' }, 404)
      return json({ ok: true })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) { return json({ error: e.message }, 500) }
}
