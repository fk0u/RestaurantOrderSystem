'use client'
import { useState, useRef } from 'react'
import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ChevronLeft, Minus, Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DynamicQRIS } from '@/components/dynamic-qris'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, tableId, orderMethod, clearCart, addToHistory } = useStore()
    const router = useRouter()
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const contentRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({ contentRef })

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.11
    const total = subtotal + tax

    const handlePrint = () => {
        reactToPrintFn()
    }

    const handlePaymentSuccess = async () => {
        const orderData = {
            items: cart,
            total,
            method: paymentMethod,
            tableId: orderMethod === 'dine-in' ? tableId : 'TAKEAWAY',
            date: new Date().toISOString()
        }

        // Save order to DB
        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId: orderMethod === 'dine-in' ? tableId : 'TAKEAWAY',
                    items: cart,
                    totalAmount: total,
                    paymentMethod: paymentMethod
                })
            })

            if (!res.ok) throw new Error('Order failed')

            // Add to local history for immediate display
            addToHistory(orderData)
            setIsSuccess(true)
        } catch (error) {
            console.error('Payment Error:', error)
            toast.error('Gagal memproses pesanan', {
                description: "Coba lagi ya, atau panggil pelayan kami."
            })
        }
        setTimeout(() => {
            setIsPaymentOpen(false)
            clearCart()
            router.push('/history')
        }, 2000)
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Receipt className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Keranjang Kosong</h2>
                <p className="text-gray-500 mb-8">Belum ada makanan yang dipilih nih.</p>
                <Button onClick={() => router.push('/menu')}>Kembali ke Menu</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <div className="bg-white p-4 items-center flex gap-4 shadow-sm sticky top-0 z-30">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                <h1 className="text-lg font-bold">Keranjang Saya</h1>
            </div>

            {/* List */}
            <div className="p-4 space-y-4 mx-auto max-w-3xl pb-40">
                <AnimatePresence>
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-white p-4 rounded-3xl shadow-sm flex gap-4 items-center border border-gray-100 group hover:shadow-md transition-shadow"
                        >
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
                                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <h3 className="font-bold text-base text-gray-800 truncate mb-1">{item.name}</h3>
                                <p className="text-orange-600 text-sm font-black mb-3">Rp {item.price.toLocaleString('id-ID')}</p>

                                <div className="flex items-center gap-4 bg-gray-50 rounded-xl w-fit p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 active:scale-95 transition hover:bg-gray-50 border border-gray-100"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold text-base min-w-[20px] text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => {
                                            if (item.quantity < item.stock) updateQuantity(item.id, 1)
                                        }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white active:scale-95 transition shadow-sm ${item.quantity >= item.stock ? 'bg-gray-300' : 'bg-slate-900 hover:bg-black'}`}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 right-0 z-40 pb-32 md:pb-safe border-t border-gray-100">
                <div className="mx-auto max-w-2xl">
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>PPN 11%</span>
                            <span>Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        {orderMethod === 'dine-in' && (
                            <div className="flex justify-between text-sm text-gray-500 bg-orange-50 p-2 rounded-lg">
                                <span className="text-orange-600 font-medium">Table Number</span>
                                <span className="font-black text-orange-700">#{tableId?.replace('t', '')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-black text-xl text-slate-800 pt-4 border-t border-dashed border-gray-300">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform">
                                Bayar Sekarang
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md w-[95%] rounded-3xl p-0 overflow-hidden bg-slate-50">
                            {!paymentMethod ? (
                                <div className="p-6">
                                    <DialogHeader className="mb-6">
                                        <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('cash')}
                                            className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group shadow-sm"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                <Receipt className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-800">Bayar di Kasir</p>
                                                <p className="text-xs text-slate-500">Cash / Kartu Debit</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('qris')}
                                            className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform text-xs font-black">
                                                QRIS
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-800">Scan QRIS</p>
                                                <p className="text-xs text-slate-500">Dana, GoPay, OVO, dll</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-0">
                                    {paymentMethod === 'qris' ? (
                                        <div className="p-4">
                                            <Button variant="ghost" onClick={() => setPaymentMethod(null)} className="mb-2">
                                                <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
                                            </Button>
                                            <DynamicQRIS amount={total} />
                                        </div>
                                    ) : (
                                        <div className="p-8 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500">
                                                <Receipt className="w-10 h-10" />
                                            </div>
                                            <h3 className="font-bold text-xl mb-2">Bayar di Kasir</h3>
                                            <p className="text-gray-500 mb-6">Silakan menuju kasir untuk melakukan pembayaran sebesar <strong className="text-slate-900">Rp {total.toLocaleString('id-ID')}</strong></p>
                                            <Button className="w-full bg-slate-900" onClick={handlePaymentSuccess}>
                                                Saya Sudah Bayar
                                            </Button>
                                            <Button variant="ghost" onClick={() => setPaymentMethod(null)} className="mt-2">
                                                Kembali
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hidden Receipt for Printing */}
                            <div className="hidden">
                                <div ref={contentRef} className="p-8 font-mono text-sm">
                                    <h1 className="text-center font-bold text-xl mb-4">RESTORAN ENAK</h1>
                                    <p className="text-center mb-4 text-xs">Jl. Contoh No. 123, Indonesia</p>
                                    <hr className="border-dashed border-gray-400 my-2" />
                                    <div className="flex justify-between">
                                        <span>Date: {new Date().toLocaleDateString()}</span>
                                        <span>#ORD-{Date.now().toString().slice(-4)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Table: {orderMethod === 'dine-in' ? tableId : 'Takeaway'}</span>
                                    </div>
                                    <hr className="border-dashed border-gray-400 my-2" />
                                    <div className="space-y-2">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>{(item.quantity * item.price).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <hr className="border-dashed border-gray-400 my-2" />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="mt-8 text-center text-xs">
                                        Terima kasih atas kunjungan Anda!
                                    </div>
                                </div>
                            </div>

                            {isSuccess && (
                                <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <Receipt className="w-12 h-12" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold mb-2">Order Berhasil!</h2>
                                    <p className="text-gray-500 text-center mb-8">Pesananmu sudah masuk ke dapur.</p>
                                    <Button onClick={handlePrint} variant="outline" className="mb-4 w-full">
                                        Cetak Struk
                                    </Button>
                                    <p className="text-xs text-gray-400">Mengalihkan ke history...</p>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
