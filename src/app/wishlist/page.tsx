'use client'
import { useEffect, useState } from 'react'
import { useStore, MenuItem } from '@/lib/store'
import { MenuCard } from '@/components/menu-card'
import { MenuCardSkeleton } from '@/components/skeleton-loader'
import { Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function WishlistPage() {
    const { wishlist } = useStore()
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
                setMenuItems(data)
                setLoading(false)
            })
    }, [])

    const wishlistedItems = menuItems.filter(item => wishlist.includes(item.id))

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <div className="bg-white p-4 flex gap-4 items-center shadow-sm sticky top-0 z-30">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft /></Button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    Wishlist <Heart className="fill-red-500 text-red-500 w-5 h-5" />
                </h1>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                {loading ? (
                    [...Array(4)].map((_, i) => <MenuCardSkeleton key={i} />)
                ) : wishlistedItems.length > 0 ? (
                    wishlistedItems.map(item => (
                        <MenuCard key={item.id} item={item} />
                    ))
                ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-700">Wishlist Kosong</h3>
                        <p className="text-gray-400 text-sm mt-1">Simpan menu favoritmu di sini biar gampang carinya.</p>
                        <Button className="mt-6" variant="outline" onClick={() => router.push('/menu')}>
                            Cari Menu Dulu
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
