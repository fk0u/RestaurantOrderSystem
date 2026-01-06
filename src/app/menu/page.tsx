'use client'
import { useEffect, useState } from 'react'
import { MenuCard } from '@/components/menu-card'
import { MenuRow } from '@/components/menu-row'
import { MenuSliderItem } from '@/components/menu-slider-item'
import { MenuCardSkeleton } from '@/components/skeleton-loader'
import { MenuItem } from '@/lib/store'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function MenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    // Ensure access to state if needed for debugging or logic, but components handle specific logic.

    useEffect(() => {
        // Simulate network delay for skeleton demo
        setTimeout(() => {
            fetch('/api/menu').then(res => res.json()).then(data => {
                setMenu(data)
                setLoading(false)
            })
        }, 1000)
    }, [])

    const categories = ['All', ...Array.from(new Set(menu.map(i => i.category)))]
    const filtered = menu.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = activeCategory === 'All' || item.category === activeCategory
        return matchSearch && matchCat
    })

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Hero / Header */}
            <div className="bg-gradient-to-br from-indigo-900 via-primary to-rose-600 p-8 pt-16 rounded-b-[3rem] shadow-2xl text-white mb-8 relative overflow-hidden">
                <div className="relative z-10 max-w-xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20 backdrop-blur-md mb-3 inline-block">
                            🍴 Menu Hari Ini
                        </span>
                        <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-sm">Mau makan enak? 😋</h1>
                        <p className="text-white/80 text-base font-medium">Temukan rasa yang bikin nagih.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 relative max-w-sm mx-auto group z-20"
                    >
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Search className="absolute left-5 top-4 w-5 h-5 text-white/70 group-focus-within:text-white transition-colors" />
                        <Input
                            className="pl-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/60 rounded-full focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white shadow-2xl transition-all"
                            placeholder="Cari nasi goreng, ayam..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse slow" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Categories Stick Header */}
            <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-xl py-2 mb-4">
                <div className="flex gap-2 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden no-scrollbar snap-x mx-auto max-w-4xl py-2">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            [...Array(4)].map((_, i) => <div key={i} className="h-10 w-24 bg-slate-200 rounded-full animate-pulse shrink-0" />)
                        ) : (
                            categories.map((cat, idx) => (
                                <motion.button
                                    layout
                                    key={cat}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all snap-center relative overflow-hidden",
                                        activeCategory === cat
                                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                                    )}
                                >
                                    {activeCategory === cat && (
                                        <motion.div
                                            layoutId="cat-active"
                                            className="absolute inset-0 bg-white/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {cat}
                                </motion.button>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Recommended Section (Slider) */}
            {!loading && !search && activeCategory === 'All' && (
                <div className="mb-8">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">🔥 Rekomendasi Chef</h2>
                    </div>
                    <div className="flex overflow-x-auto px-6 gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
                        {menu.filter(i => i.popular).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                className="snap-start"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <MenuSliderItem item={item} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main List (Rows) */}
            <div className="px-4 pb-32 mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-slate-700">
                        {search ? `Searching "${search}"` : 'Daftar Menu'}
                    </h2>
                    <span className="text-xs font-medium text-slate-400">{filtered.length} items</span>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => <MenuCardSkeleton key={i} />)
                    ) : (
                        filtered.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                            >
                                <MenuRow item={item} />
                            </motion.div>
                        ))
                    )}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-4xl"
                        >
                            🧐
                        </motion.div>
                        <h3 className="text-xl font-bold text-slate-800">Menu tidak ditemukan</h3>
                        <p className="text-slate-500">Mungkin coba cari yang lain?</p>
                    </div>
                )}
            </div>
        </div>
    )
}
