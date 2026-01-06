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
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-safe">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-t-3xl md:rounded-full md:mb-6 md:border pointer-events-auto h-20 md:h-16 w-full md:w-auto md:px-8 max-w-md md:gap-8 flex items-center justify-around md:justify-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className="relative flex flex-col items-center justify-center w-full md:w-16 h-full px-2 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-glow"
                                    className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <tab.icon
                                className={cn(
                                    "w-6 h-6 transition-colors duration-200",
                                    isActive ? "text-orange-500" : "text-gray-400"
                                )}
                            />
                            <span className={cn(
                                "text-xs mt-1 font-medium transition-colors duration-200",
                                isActive ? "text-orange-500" : "text-gray-400"
                            )}>
                                {tab.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
