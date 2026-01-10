
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useEffect, useState, useMemo } from 'react'
import { ChevronLeft, CheckCircle2, Clock, Truck, ChefHat, MapPin, Phone, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ReviewModal } from '@/components/review-modal'

const OrderTrackerMap = dynamic(() => import('@/components/order-tracker-map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
})

const RESTAURANT_LOC = { lat: -6.200000, lng: 106.816666 }

const STEPS = [
    { id: 'processing', label: 'Pesanan Diterima', icon: CheckCircle2, desc: 'Restoran mengkonfirmasi pesananmu.' },
    { id: 'cooking', label: 'Sedang Disiapkan', icon: ChefHat, desc: 'Koki sedang memasak hidangan lezatmu.' },
    { id: 'delivery', label: 'Sedang Diantar', icon: Truck, desc: 'Driver sedang menuju lokasimu.' },
    { id: 'delivered', label: 'Pesanan Selesai', icon: MapPin, desc: 'Selamat menikmati!' },
]

export default function OrderTrackingPage() {
    const params = useParams()
    const router = useRouter()
    const { history } = useStore()
    const [order, setOrder] = useState<any>(null)
    const [status, setStatus] = useState('processing')
    const [driverLocation, setDriverLocation] = useState(RESTAURANT_LOC)
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (params.id && history.length > 0) {
            const found = history.find((o: any) => o.id === params.id)
            if (found) {
                setOrder(found)
            } else {
                // Return to history if not found after short delay
                // setTimeout(() => router.push('/history'), 3000)
            }
        }
    }, [params.id, history])

    // Simulate Status & Driver Movement
    useEffect(() => {
        if (!order) return

        const interval = setInterval(() => {
            const now = Date.now()
            const created = new Date(order.date).getTime()
            const diffSeconds = (now - created) / 1000

            setElapsed(diffSeconds)

            // Timeline Simulation (Accelerated for demo)
            if (diffSeconds < 10) setStatus('processing')
            else if (diffSeconds < 25) setStatus('cooking')
            else if (diffSeconds < 55) setStatus('delivery')
            else setStatus('delivered')

            // Driver Simulation (Linear Interpolation)
            if (diffSeconds >= 25 && diffSeconds < 55 && order.deliveryDetails?.location) {
                const totalDeliveryTime = 30 // seconds
                const progress = Math.min(1, (diffSeconds - 25) / totalDeliveryTime)

                const start = RESTAURANT_LOC
                const end = order.deliveryDetails.location

                const lat = start.lat + (end.lat - start.lat) * progress
                const lng = start.lng + (end.lng - start.lng) * progress

                setDriverLocation({ lat, lng })
            } else if (diffSeconds >= 55 && order.deliveryDetails?.location) {
                setDriverLocation(order.deliveryDetails.location)
            }

        }, 1000)

        return () => clearInterval(interval)
    }, [order])



    // Review Logic
    const [reviewOpen, setReviewOpen] = useState(false)
    const { addReview } = useStore()

    const handleReviewSubmit = (rating: number, comment: string) => {
        if (!order) return
        addReview({
            id: `REV-${Date.now()}`,
            orderId: order.id,
            rating,
            comment,
            date: new Date().toISOString(),
            user: 'Hendra K.'
        })
    }

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-400">Order tidak ditemukan...</p>
        </div>
    )

    const currentStepIndex = STEPS.findIndex(s => s.id === status)

    return (
        <div className="min-h-screen bg-slate-50 pb-safe relative overflow-hidden">
            <ReviewModal
                isOpen={reviewOpen}
                onClose={() => setReviewOpen(false)}
                orderId={order?.id}
                onSubmit={handleReviewSubmit}
            />

            {/* Map Background (Full Screen if Delivery) */}
            {order.orderMethod === 'delivery' && (
                <div className="fixed inset-0 z-0 h-[65vh] lg:h-screen lg:w-1/2 lg:right-0">
                    <OrderTrackerMap
                        userLocation={order.deliveryDetails?.location || RESTAURANT_LOC}
                        driverLocation={status === 'processing' || status === 'cooking' ? undefined : driverLocation}
                        status={status}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent lg:hidden pointer-events-none" />
                </div>
            )}

            {/* Header (Floating on Mobile) */}
            <div className="fixed top-4 left-4 z-20">
                <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 backdrop-blur" onClick={() => router.push('/menu')}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* Content Overlay */}
            <div className={`relative z-10 flex flex-col min-h-screen ${order.orderMethod === 'delivery' ? 'justify-end lg:justify-start lg:w-1/2 lg:bg-white lg:shadow-xl' : ''}`}>

                {/* Main Sheet */}
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] p-6 pb-12 mt-[55vh] lg:mt-0 lg:shadow-none lg:min-h-screen relative"
                >
                    {/* Handle Bar */}
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 lg:hidden" />

                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="text-center lg:text-left mb-8">
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mb-2 uppercase tracking-wider"
                            >
                                {status.replace('-', ' ')}
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
                                {status === 'delivered' ? 'Pesanan Sampai! 🎉' : `Estimasi: ${Math.max(0, 55 - Math.floor(elapsed))} detik`}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Order ID: <span className="font-mono font-bold text-slate-700">{order.id}</span>
                            </p>
                        </div>

                        {/* Review Button when Delivered */}
                        {status === 'delivered' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6"
                            >
                                <Button
                                    className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform text-white"
                                    onClick={() => setReviewOpen(true)}
                                >
                                    <Star className="w-5 h-5 mr-2 fill-white" /> Beri Ulasan
                                </Button>
                            </motion.div>
                        )}


                        {/* Driver Info Card */}
                        {order.orderMethod === 'delivery' && status !== 'processing' && status !== 'cooking' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 text-white p-5 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-slate-900/20 mb-6 relative overflow-hidden"
                            >
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700 relative z-10">
                                    <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Driver" width={56} height={56} />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h3 className="font-bold text-lg leading-tight">Budi Santoso</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.9 • Honda Beat
                                    </div>
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <Button size="icon" className="rounded-full bg-green-500 hover:bg-green-600 text-white border-none h-10 w-10">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" className="rounded-full bg-slate-700 hover:bg-slate-600 text-white border-none h-10 w-10">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Timeline */}
                        <div className="relative pl-4 space-y-8 border-l-2 border-slate-100 ml-2 py-2">
                            {STEPS.map((step, index) => {
                                const isActive = index === currentStepIndex
                                const isCompleted = index < currentStepIndex
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className={`relative pl-8 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                        <div className={`absolute -left-[23px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${isActive ? 'bg-orange-500 text-white scale-110 shadow-orange-500/30' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-base ${isActive ? 'text-orange-600' : 'text-slate-800'}`}>{step.label}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">{step.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Summary Preview */}
                        <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-orange-500 rounded-full inline-block" />
                                Rincian Pesanan
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-4">
                                            <div className="font-bold bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0">{item.quantity}x</div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-base">{item.name}</p>
                                                {/* Modifiers Display */}
                                                {item.modifiers && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.modifiers.spicyLevel > 0 && (
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-bold border border-red-100">
                                                                Level {item.modifiers.spicyLevel}
                                                            </span>
                                                        )}
                                                        {item.modifiers.selectedToppings?.map((t: string) => (
                                                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded font-bold border border-orange-100 capitalize">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.note && <p className="text-xs text-slate-400 italic mt-1">"{item.note}"</p>}
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-slate-50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span>Rp {order.subtotal?.toLocaleString('id-ID') || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Pajak & Layanan</span>
                                    <span>Rp {order.tax?.toLocaleString('id-ID') || 0}</span>
                                </div>
                                {order.deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Ongkos Kirim</span>
                                        <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {order.voucher && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Diskon ({order.voucher.code})</span>
                                        <span>- Rp {order.voucher.discount.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-xl text-slate-900 pt-2 border-t border-slate-200 mt-2">
                                    <span>Total</span>
                                    <span>Rp {order.total?.toLocaleString('id-ID') || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
