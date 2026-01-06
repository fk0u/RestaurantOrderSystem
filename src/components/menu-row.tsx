'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, MenuItem } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MenuRowProps {
    item: MenuItem
}

export function MenuRow({ item }: MenuRowProps) {
    const { addToCart, toggleWishlist, wishlist } = useStore()
    const isWishlisted = wishlist.includes(item.id)

    return (
        <motion.div
            className="group relative flex gap-4 p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all items-center"
            whileTap={{ scale: 0.98 }}
        >
            {/* Image */}
            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.popular && (
                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm">
                        POPULAR
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 truncate pr-2">{item.name}</h3>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-2">{item.description}</p>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-1">
                    <span className="font-black text-orange-600 text-sm">
                        Rp {item.price.toLocaleString('id-ID')}
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "w-8 h-8 rounded-full",
                                isWishlisted ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-red-500"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist(item.id)
                            }}
                        >
                            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                        </Button>

                        <Button
                            size="icon"
                            disabled={item.stock < 1}
                            className={cn(
                                "w-9 h-9 rounded-xl shadow-lg shadow-orange-500/20 transition-all",
                                item.stock < 1 ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-black hover:scale-105"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                addToCart(item)
                                toast.success(`${item.name} +1 ke keranjang`, {
                                    description: "Mantap! Mau tambah yang lain?",
                                    position: "top-center"
                                })
                            }}
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
