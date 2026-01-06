'use client'

import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useEffect, useState, useMemo } from 'react'
import { ChevronLeft, CheckCircle2, Clock, Truck, ChefHat, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
            else if (diffSeconds < 30) setStatus('cooking')
            else if (diffSeconds < 60) setStatus('delivery')
            else setStatus('delivered')

            // Driver Simulation (Linear Interpolation)
            if (diffSeconds >= 30 && diffSeconds < 60 && order.deliveryDetails?.location) {
                const totalDeliveryTime = 30 // seconds
                const progress = Math.min(1, (diffSeconds - 30) / totalDeliveryTime)

                const start = RESTAURANT_LOC
                const end = order.deliveryDetails.location

                const lat = start.lat + (end.lat - start.lat) * progress
                const lng = start.lng + (end.lng - start.lng) * progress

                setDriverLocation({ lat, lng })
            } else if (diffSeconds >= 60 && order.deliveryDetails?.location) {
                setDriverLocation(order.deliveryDetails.location)
            }

        }, 1000)

        return () => clearInterval(interval)
    }, [order])

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-400">Order tidak ditemukan...</p>
        </div>
    )

    const currentStepIndex = STEPS.findIndex(s => s.id === status)

    return (
        <div className="min-h-screen bg-slate-50 pb-safe relative">
            {/* Map Background (Full Screen if Delivery) */}
            {order.orderMethod === 'delivery' && (
                <div className="fixed inset-0 z-0 h-[60vh] lg:h-screen lg:w-1/2 lg:right-0">
                    <OrderTrackerMap
                        userLocation={order.deliveryDetails?.location || RESTAURANT_LOC}
                        driverLocation={status === 'processing' || status === 'cooking' ? undefined : driverLocation}
                        status={status}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent lg:hidden pointer-events-none" />
                </div>
            )}

            {/* Content Overlay */}
            <div className={`relative z-10 flex flex-col min-h-screen ${order.orderMethod === 'delivery' ? 'justify-end lg:justify-start lg:w-1/2 lg:bg-white lg:shadow-xl' : ''}`}>

                {/* Header (Floating on Mobile) */}
                <div className="absolute top-4 left-4 z-20">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 backdrop-blur" onClick={() => router.push('/history')}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </div>

                <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] p-6 pb-12 mt-[50vh] lg:mt-0 lg:shadow-none lg:min-h-screen">
                    {/* Handle Bar */}
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 lg:hidden" />

                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="text-center lg:text-left mb-8">
                            <h1 className="text-2xl font-black text-slate-900 mb-1">
                                {status === 'delivered' ? 'Pesanan Sampai! 🎉' : `Estimasi: ${Math.max(0, 60 - Math.floor(elapsed))} detik`}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Order ID: <span className="font-mono font-bold text-slate-700">{order.id}</span>
                            </p>
                        </div>

                        {/* Driver Info Card */}
                        {order.orderMethod === 'delivery' && status !== 'processing' && status !== 'cooking' && (
                            <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 border border-orange-100 mb-6">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                    <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Driver" width={48} height={48} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800">Budi Santoso</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded font-bold">B 1234 KOU</span>
                                        • Honda Beat
                                    </div>
                                </div>
                                <Button size="icon" className="rounded-full bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20">
                                    <Phone className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="relative pl-4 space-y-8 border-l-2 border-slate-100 ml-2">
                            {STEPS.map((step, index) => {
                                const isActive = index === currentStepIndex
                                const isCompleted = index < currentStepIndex
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className={`relative pl-6 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                        <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${isActive ? 'bg-orange-500 text-white scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${isActive ? 'text-orange-600' : 'text-slate-800'}`}>{step.label}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Summary Preview */}
                        <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
                            <h3 className="font-bold text-slate-800 mb-4">Rincian Pesanan</h3>
                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-3">
                                            <div className="font-bold bg-slate-100 w-6 h-6 rounded flex items-center justify-center text-xs">{item.quantity}x</div>
                                            <div>
                                                <p className="font-medium text-slate-700">{item.name}</p>
                                                {item.note && <p className="text-xs text-slate-400 italic">"{item.note}"</p>}
                                            </div>
                                        </div>
                                        <span className="font-mono text-slate-500">{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-black text-lg text-slate-900 mt-4 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span>Rp {order.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
