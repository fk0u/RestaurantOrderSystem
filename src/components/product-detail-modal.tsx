'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ChefHat, Flame, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuItem } from '@/lib/store'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductDetailModalProps {
    isOpen: boolean
    onClose: () => void
    item: MenuItem | null
    onAddToCart: (item: MenuItem, quantity: number, notes: string, modifiers: any) => void
}

const SPICY_LEVELS = [
    { value: 0, label: 'Tidak Pedas', icon: '😄' },
    { value: 1, label: 'Sedang', icon: '🌶️' },
    { value: 2, label: 'Pedas', icon: '🔥' },
    { value: 3, label: 'Extra Pedas', icon: '🥵' },
]

const TOPPINGS = [
    { id: 'egg', name: 'Telur Mata Sapi', price: 5000 },
    { id: 'cheese', name: 'Keju Mozzarella', price: 7000 },
    { id: 'crackers', name: 'Kerupuk', price: 2000 },
]

export function ProductDetailModal({ isOpen, onClose, item, onAddToCart }: ProductDetailModalProps) {
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState('')
    const [spicyLevel, setSpicyLevel] = useState(0)
    const [selectedToppings, setSelectedToppings] = useState<string[]>([])

    useEffect(() => {
        if (isOpen) {
            setQuantity(1)
            setNotes('')
            setSpicyLevel(0)
            setSelectedToppings([])
        }
    }, [isOpen, item])

    if (!item) return null

    const toggleTopping = (id: string) => {
        setSelectedToppings(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const toppingsTotal = selectedToppings.reduce((acc, id) => {
        const t = TOPPINGS.find(t => t.id === id)
        return acc + (t ? t.price : 0)
    }, 0)

    const totalPrice = (item.price + toppingsTotal) * quantity

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] overflow-hidden"
                    />

                    {/* Modal/Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-50 rounded-t-[2.5rem] lg:rounded-[2.5rem] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[480px] lg:h-[85vh] h-[92vh] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Close Button & Image Header */}
                        <div className="relative h-48 lg:h-56 w-full shrink-0">
                            <Button
                                size="icon"
                                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10"
                                onClick={onClose}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-2">
                                <span className="inline-block px-1.5 py-0.5 bg-orange-500 rounded-md text-[9px] font-bold uppercase tracking-wider mb-1 shadow-lg">
                                    {item.category}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">{item.name}</h2>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
                            {/* Description */}
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {item.description}
                            </p>

                            <hr className="border-slate-200" />

                            {/* Spicy Level */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-red-500" /> Tingkat Pedas
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {SPICY_LEVELS.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => setSpicyLevel(level.value)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all",
                                                spicyLevel === level.value
                                                    ? "border-red-500 bg-red-50 text-red-600"
                                                    : "border-slate-100 bg-white text-slate-400 hover:border-slate-300"
                                            )}
                                        >
                                            <span className="text-2xl mb-1">{level.icon}</span>
                                            <span className="text-[10px] font-bold text-center leading-tight">{level.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toppings */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <ChefHat className="w-4 h-4 text-orange-500" /> Tambah Topping
                                </h3>
                                <div className="space-y-2">
                                    {TOPPINGS.map((t) => {
                                        const isSelected = selectedToppings.includes(t.id)
                                        return (
                                            <div
                                                key={t.id}
                                                onClick={() => toggleTopping(t.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                                    isSelected
                                                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500/20"
                                                        : "border-slate-100 bg-white hover:border-slate-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                                        isSelected ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-slate-100"
                                                    )}>
                                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className={cn("font-medium", isSelected ? "text-slate-800" : "text-slate-600")}>{t.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">+ {t.price.toLocaleString('id-ID')}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Catatan Khusus</h3>
                                <textarea
                                    className="w-full h-24 p-4 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 placeholder:text-slate-400 font-medium resize-none transition-shadow"
                                    placeholder="Contoh: Jangan terlalu asin, dagingnya sedikit gosong..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-xs font-bold text-slate-500">Jumlah</span>
                                <div className="flex-1" />
                                <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1 h-8">
                                    <button
                                        aria-label="Kurangi jumlah"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-black text-sm w-6 text-center text-slate-800">{quantity}</span>
                                    <button
                                        aria-label="Tambah jumlah"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center hover:bg-slate-900 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <Button
                                className="w-full h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform"
                                onClick={() => onAddToCart(item, quantity, notes, { spicyLevel, selectedToppings })}
                            >
                                <div className="flex justify-between w-full items-center px-1">
                                    <span>Tambah ke Keranjang</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
