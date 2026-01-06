'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Clock, Receipt, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OrderItem {
    name: string
    quantity: number
    price: number
}

interface Order {
    id: string
    date: string
    total: number
    method: string
    tableId: string
    items: OrderItem[]
}

export default function HistoryPage() {
    const router = useRouter()
    const [history, setHistory] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch History
    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/history')
            const data = await res.json()
            if (Array.isArray(data)) {
                setHistory(data)
            }
        } catch (error) {
            console.error('Failed to load history', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-30">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-500" /> Riwayat Pesanan
                </h1>
            </div>

            <div className="p-4 space-y-4 mx-auto max-w-3xl">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Belum Ada Pesanan</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                            Kamu belum pesan apa-apa nih. Yuk pesan makan sekarang!
                        </p>
                        <Button className="mt-8 rounded-xl" onClick={() => router.push('/menu')}>
                            Pesan Sekarang
                        </Button>
                    </div>
                ) : (
                    history.map((order, idx) => (
                        <div key={idx}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
                            onClick={() => router.push(`/order/${order.id || ''}`)}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">
                                        {new Date(order.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <h3 className="font-bold text-slate-800">
                                        {order.tableId === 'TAKEAWAY' ? 'Take Away' : 'Dine In'}
                                        {order.tableId && order.tableId !== 'TAKEAWAY' && ` • Table #${order.tableId}`}
                                    </h3>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${order.method === 'cash' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {order.method === 'cash' ? 'CASH' : 'QRIS'}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-600"><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                                        <span className="font-medium text-slate-500">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Receipt className="w-4 h-4 mr-1" /> Total Bayar
                                </div>
                                <p className="text-lg font-black text-slate-800">Rp {order.total.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
