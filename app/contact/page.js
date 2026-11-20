'use client'

import { useState } from 'react'
import PageHero from '@/components/site/page-hero'
import { SITE } from '@/lib/site-config'
import { Mail, MapPin, MessageCircle, Calendar, ArrowRight, Check, Phone } from 'lucide-react'

export default function ContactPage() {
  const [state, setState] = useState({ name:'', email:'', phone:'', brand:'', revenue:'', message:'' })
  const [status, setStatus] = useState('idle')
  async function submit(e) { e.preventDefault(); setStatus('loading'); try { const r = await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...state,source:'contact-page'})}); const d = await r.json(); setStatus(d.ok?'success':'error') } catch { setStatus('error') } }
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Contact" title={<>Let's engineer<br /><span className="italic font-light">your next chapter.</span></>} subtitle="Fill the form below or book a strategy call directly. We respond to every qualified inquiry within 24 hours." breadcrumbs={[{label:'Contact'}]} />
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-8">{status==='success'?(
          <div className="py-16 text-center"><div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center"><Check className="h-7 w-7 text-emerald-700" /></div><h3 className="mt-5 text-2xl font-semibold">Message received.</h3><p className="mt-2 text-body">We'll be in touch within 24 hours.</p></div>
        ):(<form onSubmit={submit}><div className="grid md:grid-cols-2 gap-4">
          {[{k:'name',l:'Full name'},{k:'email',l:'Work email',t:'email'},{k:'phone',l:'Phone / WhatsApp'},{k:'brand',l:'Brand / Company'}].map(f=>(<div key={f.k}><label className="block text-[12px] text-body mb-2">{f.l}</label><input required type={f.t||'text'} value={state[f.k]} onChange={e=>setState({...state,[f.k]:e.target.value})} className="w-full rounded-xl bg-background border border-border px-4 py-3 text-[14px] focus:outline-none focus:border-primary" /></div>))}
          <div className="md:col-span-2"><label className="block text-[12px] text-body mb-2">Current monthly revenue</label><select value={state.revenue} onChange={e=>setState({...state,revenue:e.target.value})} className="w-full rounded-xl bg-background border border-border px-4 py-3 text-[14px]"><option value="">Select range</option><option>Under ₹1L / month</option><option>₹1L–₹10L / month</option><option>₹10L–₹1Cr / month</option><option>₹1Cr–₹5Cr / month</option><option>₹5Cr+ / month</option></select></div>
          <div className="md:col-span-2"><label className="block text-[12px] text-body mb-2">What are you struggling with?</label><textarea rows={4} value={state.message} onChange={e=>setState({...state,message:e.target.value})} className="w-full rounded-xl bg-background border border-border px-4 py-3 text-[14px] resize-none" /></div></div>
          <button disabled={status==='loading'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-[14px] font-medium disabled:opacity-50">{status==='loading'?'Sending…':'Send message'}<ArrowRight className="h-4 w-4" /></button>
        </form>)}</div>
        <div className="space-y-3">
          <a href={SITE.calendly} target="_blank" rel="noopener" className="block rounded-2xl border border-border bg-gradient-to-br from-card to-transparent p-6 hover:border-primary/40 transition"><Calendar className="h-5 w-5" /><h3 className="mt-3 font-semibold">Book Strategy Call</h3><p className="mt-1 text-[13px] text-body">30-min free session with our team.</p></a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener" className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40"><MessageCircle className="h-5 w-5 text-[#25D366]" /><h3 className="mt-3 font-semibold">WhatsApp</h3><p className="mt-1 text-[13px] text-body">Fastest way to reach us.</p></a>
          <a href={SITE.phoneHref} className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40"><Phone className="h-5 w-5" /><h3 className="mt-3 font-semibold">Phone</h3><p className="mt-1 text-[13px] text-body">{SITE.phone}</p></a>
          <div className="rounded-2xl border border-border bg-card p-6"><Mail className="h-5 w-5" /><h3 className="mt-3 font-semibold">Email</h3><p className="mt-1 text-[13px] text-body">{SITE.email}</p></div>
          <div className="rounded-2xl border border-border bg-card p-6"><MapPin className="h-5 w-5" /><h3 className="mt-3 font-semibold">Location</h3><p className="mt-1 text-[13px] text-body">{SITE.location}</p></div>
          <div className="rounded-2xl border border-border bg-card p-4 aspect-video flex items-center justify-center text-[12px] text-body">Map placeholder</div>
        </div>
      </div></section>
    </main>
  )
}
