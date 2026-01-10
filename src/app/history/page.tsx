'use client'

import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Receipt, ChevronRight, ShoppingBag, MapPin, ChefHat, Truck, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HistoryPage() {
    const router = useRouter()
    const { history } = useStore() // Use real store history

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'processing': return { label: 'Diproses', color: 'bg-blue-100 text-blue-600', icon: ChefHat }
            case 'cooking': return { label: 'Dimasak', color: 'bg-orange-100 text-orange-600', icon: ChefHat }
            case 'delivery': return { label: 'Diantar', color: 'bg-yellow-100 text-yellow-600', icon: Truck }
            case 'delivered': return { label: 'Selesai', color: 'bg-green-100 text-green-600', icon: CheckCircle2 }
            default: return { label: status, color: 'bg-slate-100 text-slate-600', icon: Clock }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32 md:pl-0">
            {/* Header */}
            <div className="bg-white p-6 shadow-sm sticky top-0 z-30 flex items-center justify-between md:hidden">
                <h1 className="text-2xl font-black flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-500" /> Riwayat
                </h1>
            </div>

            <div className="p-6 mx-auto max-w-4xl space-y-6">
                <div className="hidden md:block mb-8">
                    <h1 className="text-3xl font-black text-slate-900">Riwayat Pesanan</h1>
                    <p className="text-slate-500">Lacak dan lihat kembali pesananmu.</p>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] p-8 shadow-sm">
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl font-black">Belum Ada Pesanan</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                            Kamu belum pesan apa-apa nih. Yuk pesan makan sekarang!
                        </p>
                        <Button className="mt-8 rounded-xl h-12 px-8 font-bold text-lg" onClick={() => router.push('/menu')}>
                            Pesan Sekarang
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence>
                        {history.map((order, idx) => {
                            const statusInfo = getStatusInfo(order.status)
                            const StatusIcon = statusInfo.icon

                            return (
                                <motion.div
                                    key={order.id || `history-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden group"
                                    onClick={() => router.push(`/order/${order.id}`)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusInfo.color}`}>
                                                <StatusIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium">#{order.id}</span>
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-lg">
                                                    {order.orderMethod === 'delivery' ? 'Delivery Order' : order.orderMethod === 'takeaway' ? 'Take Away' : 'Dine In'}
                                                </h3>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(order.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900">Rp {order.total.toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-slate-400 font-medium">{order.items.length} Item(s)</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                        {order.items.slice(0, 2).map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-sm items-center">
                                                <div className="flex gap-2 items-center">
                                                    <span className="font-bold bg-white px-2 py-1 rounded text-xs shadow-sm border border-slate-100">{item.quantity}x</span>
                                                    <span className="text-slate-700 font-medium">{item.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-xs text-slate-400 italic pt-1">+ {order.items.length - 2} items lainnya...</p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-sm font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                                        Lihat Detail Pesanan <ChevronRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

