'use client'

import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { User, MapPin, Heart, Clock, Settings, LogOut, ChevronRight, Wallet, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ProfilePage() {
    const router = useRouter()
    const { history, wishlist, resetOnboarding } = useStore()

    const stats = [
        { label: 'Pesanan', value: history.length, icon: Clock },
        { label: 'Wishlist', value: wishlist.length, icon: Heart },
        { label: 'Vouchers', value: '3', icon: Wallet },
    ]

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header / Banner */}
            <div className="bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-white/10 overflow-hidden bg-slate-800">
                        <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" width={80} height={80} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Hendra K.</h1>
                        <p className="text-slate-400">Member since 2023</p>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold mt-1">
                            <Star className="w-4 h-4 fill-current" /> Gold Member
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-20 space-y-6">
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex justify-between">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.label} className="flex flex-col items-center gap-2 flex-1">
                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-black text-xl text-slate-900">{stat.value}</span>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Menu Sections */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-2">Akun Saya</h3>
                    <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
                        <MenuItem icon={User} label="Edit Profil" onClick={() => router.push('/profile/edit')} />
                        <MenuItem icon={MapPin} label="Alamat Tersimpan" sub="Rumah, Kantor" onClick={() => router.push('/address')} />
                        <MenuItem icon={Settings} label="Pengaturan" onClick={() => router.push('/settings')} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-2">Lainnya</h3>
                    <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
                        <MenuItem icon={Heart} label="Bantuan & Support" />
                        <MenuItem icon={Star} label="Beri Rating Aplikasi" />
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full h-14 rounded-2xl text-red-500 font-bold bg-white shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                        if (confirm('Yakin ingin logout? Data akan direset.')) {
                            resetOnboarding()
                            window.location.href = '/'
                        }
                    }}
                >
                    <LogOut className="w-5 h-5 mr-2" /> Log Out
                </Button>
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, label, sub, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-700">{label}</h4>
                {sub && <p className="text-xs text-slate-400">{sub}</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500" />
        </button>
    )
}
