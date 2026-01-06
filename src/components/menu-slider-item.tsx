'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, MenuItem } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MenuSliderItemProps {
    item: MenuItem
}

export function MenuSliderItem({ item }: MenuSliderItemProps) {
    const { addToCart } = useStore()

    return (
        <motion.div
            className="group relative flex gap-3 p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all items-center min-w-[280px] w-[280px]"
            whileTap={{ scale: 0.98 }}
        >
            {/* Image */}
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
                    TOP
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 truncate">{item.name}</h3>
                <p className="text-slate-500 text-[10px] line-clamp-2 leading-relaxed mb-2 h-8">{item.description}</p>

                <div className="flex items-center justify-between">
                    <span className="font-black text-orange-600 text-sm">
                        Rp {item.price.toLocaleString('id-ID')}
                    </span>

                    <Button
                        size="icon"
                        className={cn(
                            "w-7 h-7 rounded-lg shadow-md shadow-orange-500/10 transition-all",
                            item.stock < 1 ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-black hover:scale-105"
                        )}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (item.stock > 0) addToCart(item)
                        }}
                        disabled={item.stock < 1}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
