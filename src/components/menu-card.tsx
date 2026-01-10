'use client'
import { MenuItem, useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Plus, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MenuCardProps {
    item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
    const { addToCart, toggleWishlist, wishlist } = useStore()
    const isWishlisted = wishlist.includes(item.id)
    const isLowStock = item.stock < 5

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="relative group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 flex flex-col h-full"
        >
            {/* Shimmer Effect on Hover */}
            <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(item.id)
                    }}
                    aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                    className="absolute top-2 right-2 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors z-10"
                >
                    <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600")} />
                </button>
                {isLowStock && item.stock > 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm z-10">
                        Sisa {item.stock}
                    </span>
                )}
                {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-sm bg-black/60 px-2 py-1 rounded">HABIS</span>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col flex-1 relative z-10">
                <h3 className="font-bold text-gray-800 text-[10px] sm:text-xs line-clamp-2 h-7 leading-tight">{item.name}</h3>
                <p className="text-orange-600 font-extrabold text-[10px] sm:text-xs mt-0.5">Rp {item.price.toLocaleString('id-ID')}</p>

                <div className="mt-auto pt-2">
                    <Button
                        size="sm"
                        className={cn(
                            "w-full rounded-xl h-7 text-[10px] shadow-lg transition-all",
                            item.stock === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                        )}
                        onClick={() => item.stock > 0 && addToCart(item)}
                        disabled={item.stock === 0}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        {item.stock === 0 ? 'Habis' : 'Add'}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
