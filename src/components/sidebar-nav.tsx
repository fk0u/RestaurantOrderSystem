'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Home, Compass, User, ShoppingBag, Settings, LogOut, LayoutDashboard, UtensilsCrossed, History as HistoryIcon } from 'lucide-react'
import { useStore } from '@/lib/store'

const navItems = [
    { name: 'Menu', href: '/menu', icon: Home },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'History', href: '/history', icon: HistoryIcon }, // Use HistoryIcon
    { name: 'Profile', href: '/profile', icon: User },
]

export function SidebarNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { cart } = useStore()
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    // Hide on onboarding
    if (pathname === '/onboarding' || pathname === '/') return null

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex flex-col w-56 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 z-50 p-4"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/20">
                    P
                </div>
                <span className="font-bold text-lg text-slate-800 tracking-tight">Platter</span>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 space-y-2">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative overflow-hidden",
                                isActive
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                />
                            )}
                            <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                            <span className="font-bold text-xs relative z-10">{item.name}</span>

                            {item.name === 'Cart' && totalItems > 0 && (
                                <span className="ml-auto bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )
                })}

                <div className="mt-8">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin</p>
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                            pathname.startsWith('/admin') && "bg-orange-50 text-orange-600"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-bold text-sm">Dashboard</span>
                    </Link>
                    <Link
                        href="/kitchen"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900 mt-1",
                            pathname.startsWith('/kitchen') && "bg-blue-50 text-blue-600"
                        )}
                    >
                        <UtensilsCrossed className="w-5 h-5" />
                        <span className="font-bold text-sm">Kitchen DS</span>
                    </Link>
                </div>
            </nav>

            {/* Bottom Profile */}
            <div className="mt-auto pt-6 border-t border-slate-100">
                <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 transition-colors text-left">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">Hendra K.</p>
                        <p className="text-xs text-slate-400 truncate">Gold Member</p>
                    </div>
                    <Settings className="w-4 h-4 text-slate-400" />
                </button>
            </div>
        </motion.aside>
    )
}
