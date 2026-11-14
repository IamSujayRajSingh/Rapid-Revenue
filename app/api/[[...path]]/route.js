import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { SEED_RESOURCES } from '@/lib/data/resource-seed'

let cachedClient = null
async function getDb() {
  if (cachedClient) return cachedClient.db(process.env.DB_NAME)
  const client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  cachedClient = client
  return client.db(process.env.DB_NAME)
}

function json(data, status = 200) { return NextResponse.json(data, { status }) }
function slugify(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function isAdmin(request) {
  const key = request.headers.get('x-admin-key')
  return key && key === process.env.ADMIN_PASSWORD
}

async function ensureSeed(db) {
  const count = await db.collection('resources').countDocuments()
  if (count > 0) return
  const now = new Date().toISOString()
  const docs = SEED_RESOURCES.map(r => ({
    id: uuidv4(),
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
  }))
  if (docs.length) await db.collection('resources').insertMany(docs)
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
      const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1)
      const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '12', 10), 1), 60)
      const featured = url.searchParams.get('featured')
      const filter = { published: true }
      if (category) filter.category = category
      if (tag) filter.tags = tag
      if (featured === 'true') filter.featured = true
      if (q) {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        filter.$or = [{ title: rx }, { description: rx }, { tags: rx }]
      }
      const total = await db.collection('resources').countDocuments(filter)
      const items = await db.collection('resources')
        .find(filter, { projection: { _id: 0 } })
        .sort({ featured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()
      return json({ items, total, page, limit, pages: Math.ceil(total / limit) })
    }

    if (path === 'resources/tags') {
      await ensureSeed(db)
      const tags = await db.collection('resources').distinct('tags', { published: true })
      return json({ tags: tags.sort() })
    }

    if (path.startsWith('resources/')) {
      const slug = path.replace('resources/', '')
      const item = await db.collection('resources').findOne({ slug, published: true }, { projection: { _id: 0 } })
      if (!item) return json({ error: 'Not found' }, 404)
      return json(item)
    }

    // Admin listing (all resources including drafts)
    if (path === 'admin/resources') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
      await ensureSeed(db)
      const items = await db.collection('resources').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
      return json({ items })
    }

    // Admin leads listing
    if (path === 'admin/leads') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, 401)
      const items = await db.collection('leads').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(200).toArray()
      return json({ items })
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
      const doc = { id: uuidv4(), name: body.name || '', email: body.email || '', phone: body.phone || '', brand: body.brand || '', revenue: body.revenue || '', message: body.message || '', source: body.source || 'homepage', createdAt: new Date().toISOString() }
      await db.collection('leads').insertOne(doc)
      return json({ ok: true, id: doc.id })
    }

    // Public: email-gated download
    if (path === 'resources/download') {
      const { resourceId, email, name, brand } = body
      if (!resourceId || !email) return json({ error: 'Missing resourceId or email' }, 400)
      const item = await db.collection('resources').findOne({ id: resourceId, published: true })
      if (!item) return json({ error: 'Resource not found' }, 404)
      await db.collection('resources').updateOne({ id: resourceId }, { $inc: { downloadCount: 1 } })
      await db.collection('leads').insertOne({
        id: uuidv4(), email, name: name || '', brand: brand || '',
        source: `library:${item.slug}`,
        resourceId, resourceTitle: item.title,
        createdAt: new Date().toISOString(),
      })
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
        id: uuidv4(),
        title: body.title || 'Untitled',
        slug: body.slug ? slugify(body.slug) : slugify(body.title || 'untitled') + '-' + Math.random().toString(36).slice(2, 6),
        description: body.description || '',
        category: body.category || 'downloads',
        type: body.type || 'pdf',
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
        url: body.url || '',
        featured: !!body.featured,
        published: body.published !== false,
        downloadCount: 0,
        createdAt: now, updatedAt: now,
      }
      await db.collection('resources').insertOne(doc)
      const { _id, ...clean } = doc
      return json({ ok: true, item: clean })
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
      const allowed = ['title', 'description', 'category', 'type', 'url', 'featured', 'published']
      for (const k of allowed) if (body[k] !== undefined) set[k] = body[k]
      if (body.slug !== undefined) set.slug = slugify(body.slug)
      if (body.tags !== undefined) set.tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(t => t.trim()).filter(Boolean)
      const r = await db.collection('resources').updateOne({ id }, { $set: set })
      if (r.matchedCount === 0) return json({ error: 'Not found' }, 404)
      const item = await db.collection('resources').findOne({ id }, { projection: { _id: 0 } })
      return json({ ok: true, item })
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
      const r = await db.collection('resources').deleteOne({ id })
      if (r.deletedCount === 0) return json({ error: 'Not found' }, 404)
      return json({ ok: true })
    }
    return json({ error: 'Not found' }, 404)
  } catch (e) { return json({ error: e.message }, 500) }
}
