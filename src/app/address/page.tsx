'use client'

import { useStore } from '@/lib/store'
import { MapPin, Plus, Trash2, Home, Briefcase, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AddressPage() {
    const router = useRouter()
    // Mock addresses for now, in real app would be from store/backend
    const addresses = [
        { id: 1, label: 'Rumah', address: 'Jl. Melati No. 12, Jakarta', icon: Home },
        { id: 2, label: 'Kantor', address: 'Sudirman Tower Lt. 5', icon: Briefcase },
    ]

    return (
        <div className="min-h-screen bg-slate-50 pb-safe">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-30 flex items-center gap-4 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                <h1 className="text-xl font-bold">Alamat Tersimpan</h1>
            </div>

            <div className="p-6 max-w-xl mx-auto">
                <div className="space-y-4">
                    {addresses.map((addr) => {
                        const Icon = addr.icon
                        return (
                            <div key={addr.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{addr.label}</h3>
                                        <p className="text-sm text-slate-500">{addr.address}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-300 hover:text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        )
                    })}
                </div>

                <Button className="w-full mt-6 h-14 rounded-2xl border-dashed border-2 border-slate-300 bg-transparent text-slate-500 hover:bg-slate-50 hover:border-orange-400 hover:text-orange-600 transition-all font-bold gap-2">
                    <Plus className="w-5 h-5" /> Tambah Alamat Baru
                </Button>
            </div>
        </div>
    )
}
