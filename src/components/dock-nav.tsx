'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ShoppingCart, Heart, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function DockNav() {
    const pathname = usePathname()

    // Hide on Onboarding or Order details if needed
    if (pathname === '/onboarding' || pathname === '/') return null

    const tabs = [
        { name: 'Menu', href: '/menu', icon: Utensils },
        { name: 'Cart', href: '/cart', icon: ShoppingCart },
        { name: 'Wishlist', href: '/wishlist', icon: Heart },
        { name: 'History', href: '/history', icon: Clock },
    ]

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-full shadow-2xl border border-white/10 md:hidden">
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                            isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110 -translate-y-2" : "text-slate-400 hover:text-white"
                        )}
                    >
                        <Icon strokeWidth={2.5} className="w-5 h-5" />
                        {isActive && (
                            <span className="absolute -bottom-6 text-[10px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                {tab.name}
                            </span>
                        )}
                    </Link>
                )
            })}
        </div>
    )
}
