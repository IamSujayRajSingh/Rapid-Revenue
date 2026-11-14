'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react'
import { NAV, SITE } from '@/lib/site-config'
import Logo from '@/components/site/logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-4'}`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${scrolled ? 'glass px-4 py-2.5' : 'px-2 py-2'}`}>
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <Logo className="h-11 -my-1" />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV.map(item => (
                <div key={item.href} className="relative"
                     onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                     onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={item.href}
                        className="px-3 py-1.5 text-[13px] text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
                    {item.label}
                    {item.children && <ChevronDown className="h-3 w-3 opacity-50" />}
                  </Link>
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 min-w-[260px] rounded-2xl glass p-2 z-50"
                      >
                        {item.children.map(c => (
                          <Link key={c.href} href={c.href}
                                className="block px-3 py-2 rounded-lg text-[13px] text-neutral-300 hover:text-white hover:bg-white/5 transition">
                            {c.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={SITE.calendly} target="_blank" rel="noopener"
                 className="hidden sm:inline-flex group items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-[13px] font-medium hover:bg-neutral-200 transition-all">
                Book Strategy Call
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-full glass">
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 pb-8 px-6 overflow-y-auto lg:hidden"
          >
            <nav className="space-y-1">
              {NAV.map(item => (
                <div key={item.href} className="border-b border-white/5 py-2">
                  <Link href={item.href} onClick={() => setOpen(false)}
                        className="block py-2 text-lg font-medium text-white">
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-3 space-y-1 pb-2">
                      {item.children.map(c => (
                        <Link key={c.href} href={c.href} onClick={() => setOpen(false)}
                              className="block py-1.5 text-[14px] text-neutral-400">{c.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href={SITE.calendly} target="_blank" rel="noopener"
                 className="mt-6 flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3.5 font-medium">
                Book Strategy Call <ArrowUpRight className="h-4 w-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
