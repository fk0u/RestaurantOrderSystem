'use client'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function FabCart() {
    const { cart } = useStore()
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Hide FAB on /cart and /onboarding
    if (pathname === '/cart' || pathname === '/onboarding' || pathname === '/') return null

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    if (totalItems === 0) return null

    return (
        <Link href="/cart">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                className="fixed right-4 bottom-24 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl z-50 flex items-center justify-center text-white cursor-pointer"
            >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                    {totalItems}
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse pointer-events-none" />
            </motion.div>
        </Link>
    )
}
