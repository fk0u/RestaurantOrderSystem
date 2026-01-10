'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Camera, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default function EditProfilePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.back()
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-white pb-safe">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                <h1 className="text-xl font-bold">Edit Profil</h1>
                <Button
                    variant="ghost"
                    className="text-orange-600 font-bold"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Simpan'}
                </Button>
            </div>

            <div className="p-6 max-w-md mx-auto space-y-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                        <Image
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Profile"
                            fill
                            className="rounded-full border-4 border-slate-50 shadow-xl bg-slate-100"
                        />
                        <button
                            aria-label="Ganti foto profil"
                            className="absolute bottom-0 right-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg active:scale-90 transition-transform"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <Input defaultValue="Hendra K." className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-bold text-slate-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <Input defaultValue="hendra@example.com" className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-slate-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nomor HP</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <Input defaultValue="081234567890" className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium text-slate-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
