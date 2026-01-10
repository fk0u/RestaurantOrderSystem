'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Home, ShoppingBag, User, History, Compass } from 'lucide-react'
import { useStore } from '@/lib/store'

export function DockNav() {
    const pathname = usePathname()
    const { cart } = useStore()
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

    // Hide on these paths
    if (pathname === '/onboarding' || pathname === '/') return null

    // Hide on detail pages (e.g. /order/123, /menu/item/123 if that existed)
    // The user specifically asked to hide dock on detail pages.
    // Assuming /order/[id] is a detail page.
    if (pathname.startsWith('/order/') && pathname.split('/').length > 2) return null
    // if (pathname === '/cart') return null // Removing this as per user request

    const navItems = [
        { name: 'Menu', href: '/menu', icon: Home },
        { name: 'Discover', href: '/discover', icon: Compass }, // Added Discover
        { name: 'Cart', href: '/cart', icon: ShoppingBag }, // Added Cart inline
        { name: 'History', href: '/history', icon: History },
        { name: 'Profile', href: '/profile', icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 pb-safe">
            <nav className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 transition-all active:scale-95",
                                isActive ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />

                                {/* Badge for Cart/History */}
                                {item.name === 'Cart' && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[1rem] px-1 flex items-center justify-center rounded-full border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold">
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

