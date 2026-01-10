'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Bell, Globe, Moon, Shield, Volume2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        sound: true,
        promo: true,
    })

    return (
        <div className="min-h-screen bg-slate-50 pb-safe">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-30 flex items-center gap-4 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                <h1 className="text-xl font-bold">Pengaturan</h1>
            </div>

            <div className="p-6 space-y-8 max-w-xl mx-auto">
                {/* General Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Umum</h2>
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                        <SettingItem
                            icon={Bell}
                            label="Notifikasi"
                            desc="Update status pesanan"
                            action={<Switch checked={settings.notifications} onCheckedChange={(c) => setSettings({ ...settings, notifications: c })} />}
                        />
                        <SettingItem
                            icon={Volume2}
                            label="Suara Efek"
                            desc="Suara saat navigasi & klik"
                            action={<Switch checked={settings.sound} onCheckedChange={(c) => setSettings({ ...settings, sound: c })} />}
                        />
                        <SettingItem
                            icon={Moon}
                            label="Mode Gelap"
                            desc="Tampilan gelap yang nyaman"
                            action={<Switch checked={settings.darkMode} onCheckedChange={(c) => setSettings({ ...settings, darkMode: c })} />}
                        />
                    </div>
                </section>

                {/* Account Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Akun & Kemanan</h2>
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                        <SettingItem
                            icon={Globe}
                            label="Bahasa"
                            desc="Indonesia"
                            action={<span className="text-sm font-bold text-slate-400">ID</span>}
                        />
                        <SettingItem
                            icon={Shield}
                            label="Kebijakan Privasi"
                            action={null}
                        />
                    </div>
                </section>

                <p className="text-center text-xs text-slate-400 mt-8">Version 1.2.0 (Build 2024)</p>
            </div>
        </div>
    )
}

function SettingItem({ icon: Icon, label, desc, action }: any) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">{label}</h3>
                    {desc && <p className="text-xs text-slate-400">{desc}</p>}
                </div>
            </div>
            <div>{action}</div>
        </div>
    )
}
