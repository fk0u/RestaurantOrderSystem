'use client'

import { useStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, ChefHat, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KitchenPage() {
    const { history, addToHistory } = useStore() // In real app, we'd have a separate 'activeOrders' store or filter history
    // For demo, we'll simulate 'active' orders from history that are not yet 'delivered'

    // Auto-refresh simulation
    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const activeOrders = history.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center font-black text-2xl">
                        K
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Kitchen Display System</h1>
                        <p className="text-slate-400">Station 1 • Main Kitchen</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-mono font-bold tracking-widest">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                    {activeOrders.length === 0 ? (
                        <div className="col-span-full h-[60vh] flex flex-col items-center justify-center text-slate-600">
                            <ChefHat className="w-24 h-24 mb-4 opacity-20" />
                            <h3 className="text-2xl font-bold">No Active Orders</h3>
                            <p>Relax, Chef! Time to clean up.</p>
                        </div>
                    ) : (
                        activeOrders.map((order) => (
                            <OrderTicket key={order.id} order={order} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function OrderTicket({ order }: { order: any }) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - new Date(order.date).getTime()) / 1000)
            setElapsed(diff)
        }, 1000)
        return () => clearInterval(interval)
    }, [order.date])

    const getStatusColor = (status: string) => {
        if (status === 'cooking') return 'bg-orange-500'
        if (status === 'processing') return 'bg-blue-500'
        return 'bg-slate-700'
    }

    const isLate = elapsed > 600 // 10 minutes

    return (
        <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-slate-800 rounded-xl overflow-hidden flex flex-col border-2 ${isLate ? 'border-red-500' : 'border-transparent'}`}
        >
            <div className={`${getStatusColor(order.status)} p-3 flex justify-between items-center`}>
                <span className="font-bold text-lg">#{order.id.split('-')[1]}</span>
                <div className="flex items-center gap-1 font-mono text-sm bg-black/20 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400">
                        {order.deliveryDetails ? 'DELIVERY' : 'DINE IN'}
                    </span>
                    <span className="text-xs text-slate-500">
                        {new Date(order.date).toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="border-b border-slate-700 pb-2 last:border-0">
                            <div className="flex gap-3">
                                <span className="font-black text-orange-400 text-lg">{item.quantity}</span>
                                <div className="flex-1">
                                    <p className="font-bold leading-tight">{item.name}</p>
                                    {item.modifiers && (
                                        <div className="flex flex-wrap gap-1 mt-1 opacity-80">
                                            {item.modifiers.spicyLevel > 0 && (
                                                <span className="text-[10px] bg-red-900/50 text-red-300 px-1 rounded border border-red-800">Lvl {item.modifiers.spicyLevel}</span>
                                            )}
                                            {item.modifiers.selectedToppings?.map((t: string) => (
                                                <span key={t} className="text-[10px] bg-slate-700 px-1 rounded">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                    {item.note && (
                                        <p className="text-xs text-yellow-300 italic mt-1 bg-yellow-900/20 p-1 rounded">Note: {item.note}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-slate-700/50 mt-auto">
                <Button className="w-full bg-green-600 hover:bg-green-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Ready
                </Button>
            </div>
        </motion.div>
    )
}
