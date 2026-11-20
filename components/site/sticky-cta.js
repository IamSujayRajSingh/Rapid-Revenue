'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MessageCircle, X } from 'lucide-react'
import { SITE } from '@/lib/site-config'

export default function StickyCTA() {
  const [show, setShow] = useState(false)
  const [exit, setExit] = useState(false)
  const [exitDismissed, setExitDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)

    const onLeave = (e) => {
      if (e.clientY < 5 && !exitDismissed && !sessionStorage.getItem('exit-shown')) {
        setExit(true)
        sessionStorage.setItem('exit-shown', '1')
      }
    }
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [exitDismissed])

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 items-end"
          >
            <a href={SITE.whatsapp} target="_blank" rel="noopener"
               className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-heading/[0.08] hover:scale-105 transition-transform">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </a>
            <a href={SITE.calendly} target="_blank" rel="noopener"
               className="group hidden md:inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-4 pr-5 py-3 text-[13px] font-medium shadow-2xl shadow-heading/[0.08] hover:bg-primary-hover transition-all">
              <Calendar className="h-4 w-4" />
              Book Strategy Call
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-background via-background/90 to-transparent pt-6">
        <a href={SITE.calendly} target="_blank" rel="noopener"
           className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 text-[14px] font-medium shadow-2xl shadow-heading/[0.08]">
          <Calendar className="h-4 w-4" />
          Book Strategy Call
        </a>
      </div>

      {/* Exit intent */}
      <AnimatePresence>
        {exit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-heading/40 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => { setExit(false); setExitDismissed(true) }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl border border-border bg-card p-8 md:p-10"
            >
              <button onClick={() => { setExit(false); setExitDismissed(true) }}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full glass flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <div className="text-[11px] tracking-[0.25em] uppercase text-body">Before you go</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-gradient">
                Is your growth actually<br />profitable?
              </h3>
              <p className="mt-4 text-[15px] text-body">
                Book a free 30-minute Profit Engineering diagnostic. We'll audit your unit economics and show you where the leaks are — no pitch.
              </p>
              <a href={SITE.calendly} target="_blank" rel="noopener"
                 className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-[14px] font-medium">
                Book my free diagnostic
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
