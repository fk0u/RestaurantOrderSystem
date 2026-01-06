'use client'
import { useState, useRef, useMemo } from 'react'
import { useStore, DeliveryDetails } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ChevronLeft, Minus, Plus, Receipt, Utensils, ShoppingBag, Truck, MapPin, Tag, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { DynamicQRIS } from '@/components/dynamic-qris'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Dynamic import for Leaflet map to avoid SSR issues
const LocationPicker = dynamic(() => import('@/components/location-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

const DELIVERY_FEE = 12000

export default function CartPage() {
    const {
        cart, removeFromCart, updateQuantity, updateItemNote,
        tableId, orderMethod, setOrderMethod,
        deliveryDetails, setDeliveryDetails,
        clearCart, addToHistory
    } = useStore()

    const router = useRouter()
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // Delivery Form State
    const [formDetails, setFormDetails] = useState<DeliveryDetails>(deliveryDetails || { name: '', phone: '', address: '' })
    const [pickerOpen, setPickerOpen] = useState(false)

    // Voucher State
    const [voucherInput, setVoucherInput] = useState('')
    const [appliedVoucher, setAppliedVoucher] = useState<{ code: string, discount: number } | null>(null)

    // Notes State
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
    const [tempNote, setTempNote] = useState('')

    const contentRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({ contentRef })

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.11

    // Smart Total Calculation
    const total = useMemo(() => {
        let t = subtotal + tax
        if (orderMethod === 'delivery') t += DELIVERY_FEE
        if (appliedVoucher) t -= appliedVoucher.discount
        return Math.max(0, t)
    }, [subtotal, tax, orderMethod, appliedVoucher])

    const handlePrint = () => {
        reactToPrintFn()
    }

    const validateDelivery = () => {
        if (orderMethod === 'delivery') {
            if (!formDetails.name || !formDetails.phone || !formDetails.address) {
                toast.error("Mohon lengkapi detail pengiriman")
                return false
            }
            if (!formDetails.location) {
                toast.error("Mohon tandai lokasi pengiriman di peta")
                return false
            }
        }
        return true
    }

    const handleApplyVoucher = () => {
        // Mock Voucher Logic
        if (voucherInput.toUpperCase() === 'DISKON50') {
            setAppliedVoucher({ code: 'DISKON50', discount: 50000 })
            toast.success("Voucher Berhasil Dipakai!", { description: "Hemat Rp 50.000" })
        } else if (voucherInput.toUpperCase() === 'HEMAT10') {
            const discount = subtotal * 0.1
            setAppliedVoucher({ code: 'HEMAT10', discount })
            toast.success("Voucher Berhasil Dipakai!", { description: `Hemat Rp ${discount.toLocaleString('id-ID')}` })
        } else {
            toast.error("Kode Voucher Tidak Valid")
        }
    }

    const activeOrderMethod = orderMethod || 'dine-in' // Default fallback

    const handlePaymentSuccess = async () => {
        const orderId = `ORD-${Date.now().toString().slice(-6)}`
        const orderData = {
            id: orderId,
            items: cart,
            total,
            subtotal,
            tax,
            deliveryFee: activeOrderMethod === 'delivery' ? DELIVERY_FEE : 0,
            voucher: appliedVoucher,
            method: paymentMethod,
            orderMethod: activeOrderMethod,
            tableId: activeOrderMethod === 'dine-in' ? tableId : null,
            deliveryDetails: activeOrderMethod === 'delivery' ? formDetails : null,
            date: new Date().toISOString(),
            status: 'processing' // Initial status
        }

        try {
            // Mock API Call (replace with real endpoint if needed)
            // Save valid details to store for persistence next time
            if (activeOrderMethod === 'delivery') {
                setDeliveryDetails(formDetails)
            }

            addToHistory(orderData)
            setIsSuccess(true)
        } catch (error) {
            console.error('Payment Error:', error)
            toast.error('Gagal memproses pesanan')
        }

        setTimeout(() => {
            setIsPaymentOpen(false)
            clearCart()
            router.push(`/order/${orderId}`)
        }, 2500)
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Receipt className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Keranjang Kosong</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Perut lapar? Yuk pesan makanan enak sekarang!</p>
                <Button onClick={() => router.push('/menu')} className="bg-orange-500 hover:bg-orange-600 rounded-xl h-12 px-8 font-bold">
                    Lihat Menu
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-40">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                    <h1 className="text-lg font-bold">Konfirmasi Pesanan</h1>
                </div>

                {/* Method Switcher Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setOrderMethod('dine-in')}
                        className={cn("flex flex-col items-center justify-center py-2 rounded-xl transition-all text-xs font-bold gap-1", activeOrderMethod === 'dine-in' ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600")}
                    >
                        <Utensils className="w-4 h-4" /> Dine In
                    </button>
                    <button
                        onClick={() => setOrderMethod('takeaway')}
                        className={cn("flex flex-col items-center justify-center py-2 rounded-xl transition-all text-xs font-bold gap-1", activeOrderMethod === 'takeaway' ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600")}
                    >
                        <ShoppingBag className="w-4 h-4" /> Takeaway
                    </button>
                    <button
                        onClick={() => setOrderMethod('delivery')}
                        className={cn("flex flex-col items-center justify-center py-2 rounded-xl transition-all text-xs font-bold gap-1", activeOrderMethod === 'delivery' ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600")}
                    >
                        <Truck className="w-4 h-4" /> Delivery
                    </button>
                </div>
            </div>

            <div className="p-4 mx-auto max-w-3xl space-y-6">
                {/* Order List */}
                <div className="space-y-4">
                    <h2 className="font-bold text-slate-700">Menu Pesanan</h2>
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base text-gray-800 truncate">{item.name}</h3>
                                        <p className="text-orange-600 text-sm font-black mb-2">Rp {item.price.toLocaleString('id-ID')}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600"><Minus className="w-3 h-3" /></button>
                                                <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => { if (item.quantity < item.stock) updateQuantity(item.id, 1) }} className="w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-lg shadow-sm"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                                {/* Notes Section */}
                                <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                    {editingNoteId === item.id ? (
                                        <div className="flex gap-2">
                                            <Input
                                                value={tempNote}
                                                onChange={(e) => setTempNote(e.target.value)}
                                                placeholder="Contoh: Pedas, Jangan pakai bawang..."
                                                className="h-9 text-sm"
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={() => { updateItemNote(item.id, tempNote); setEditingNoteId(null) }}>Simpan</Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-orange-500 transition-colors"
                                            onClick={() => { setEditingNoteId(item.id); setTempNote(item.note || '') }}
                                        >
                                            <Edit3 className="w-3 h-3" />
                                            {item.note ? <span className="text-slate-700 italic">"{item.note}"</span> : "Tambah Catatan"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Delivery Form (Only if Delivery) */}
                {activeOrderMethod === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-orange-500" /> Detail Pengiriman
                        </h2>
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <Input
                                placeholder="Nama Penerima"
                                value={formDetails.name}
                                onChange={e => setFormDetails({ ...formDetails, name: e.target.value })}
                                className="bg-slate-50 border-slate-200"
                            />
                            <Input
                                placeholder="Nomor Telepon (WhatsApp)"
                                type="tel"
                                value={formDetails.phone}
                                onChange={e => setFormDetails({ ...formDetails, phone: e.target.value })}
                                className="bg-slate-50 border-slate-200"
                            />
                            <Textarea
                                placeholder="Alamat Lengkap (Jalan, No. Rumah, Patokan)"
                                value={formDetails.address}
                                onChange={e => setFormDetails({ ...formDetails, address: e.target.value })}
                                className="bg-slate-50 border-slate-200"
                            />

                            <Button variant="outline" className="w-full justify-start text-slate-600" onClick={() => setPickerOpen(true)}>
                                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                {formDetails.location ? "Lokasi Terpilih (Klik untuk ubah)" : "Tandai Lokasi di Peta"}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Voucher Code */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                        <Tag className="w-4 h-4" />
                    </div>
                    {appliedVoucher ? (
                        <div className="flex-1 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-green-600">Voucher Terpasang!</p>
                                <p className="text-xs text-slate-400">{appliedVoucher.code}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-400 text-xs h-6" onClick={() => setAppliedVoucher(null)}>Hapus</Button>
                        </div>
                    ) : (
                        <>
                            <Input
                                placeholder="Punya kode voucher?"
                                value={voucherInput}
                                onChange={e => setVoucherInput(e.target.value)}
                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-9 placeholder:text-slate-400"
                            />
                            <Button size="sm" disabled={!voucherInput} onClick={handleApplyVoucher}>Pakai</Button>
                        </>
                    )}
                </div>
            </div>

            {/* Summary & Checkout Sticky */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 right-0 z-40 pb-32 md:pb-safe border-t border-gray-100">
                <div className="mx-auto max-w-2xl space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Pajak (11%)</span>
                        <span>Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                    {activeOrderMethod === 'delivery' && (
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Ongkos Kirim</span>
                            <span>Rp {DELIVERY_FEE.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                    {appliedVoucher && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span>Diskon Voucher</span>
                            <span>- Rp {appliedVoucher.discount.toLocaleString('id-ID')}</span>
                        </div>
                    )}

                    <div className="pt-2 border-t border-dashed border-gray-300 flex justify-between items-end">
                        <div className="text-left">
                            <p className="text-xs text-slate-400">Total Pembayaran</p>
                            <p className="text-2xl font-black text-slate-900">Rp {total.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform"
                            onClick={(e) => {
                                if (!validateDelivery()) e.preventDefault()
                            }}
                        >
                            Bayar Sekarang
                        </Button>
                    </DialogTrigger>
                    {/* Reuse existing Payment Dialog Content Logic - Simplified for brevity but keeping core logic */}
                    <DialogContent className="max-w-md w-[95%] rounded-3xl p-0 overflow-hidden bg-slate-50">
                        {!paymentMethod ? (
                            <div className="p-6">
                                <DialogHeader className="mb-6">
                                    <DialogTitle>Pilih Pembayaran</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    {activeOrderMethod === 'delivery' && (
                                        <button onClick={() => setPaymentMethod('cash')} className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4"><Truck className="w-6 h-6" /></div>
                                            <div className="text-left"><p className="font-bold text-slate-800">COD (Bayar di Tempat)</p><p className="text-xs text-slate-500">Bayar tunai ke kurir</p></div>
                                        </button>
                                    )}
                                    {activeOrderMethod !== 'delivery' && (
                                        <button onClick={() => setPaymentMethod('cash')} className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4"><Receipt className="w-6 h-6" /></div>
                                            <div className="text-left"><p className="font-bold text-slate-800">Bayar di Kasir</p><p className="text-xs text-slate-500">Cash / Debit</p></div>
                                        </button>
                                    )}
                                    <button onClick={() => setPaymentMethod('qris')} className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 font-black text-xs">QRIS</div>
                                        <div className="text-left"><p className="font-bold text-slate-800">Scan QRIS</p><p className="text-xs text-slate-500">GoPay, OVO, Dana</p></div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-0">
                                {paymentMethod === 'qris' ? (
                                    <div className="p-4">
                                        <Button variant="ghost" onClick={() => setPaymentMethod(null)} className="mb-2"><ChevronLeft className="w-4 h-4 mr-2" /> Kembali</Button>
                                        <DynamicQRIS amount={total} onRefresh={handlePaymentSuccess} />
                                    </div>
                                ) : (
                                    <div className="p-8 flex flex-col items-center text-center">
                                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500"><Receipt className="w-10 h-10" /></div>
                                        <h3 className="font-bold text-xl mb-2">{activeOrderMethod === 'delivery' ? 'Siapkan Uang Tunai' : 'Bayar di Kasir'}</h3>
                                        <p className="text-gray-500 mb-6">
                                            {activeOrderMethod === 'delivery'
                                                ? `Mohon siapkan uang pas sebesar Rp ${total.toLocaleString('id-ID')} untuk kurir kami.`
                                                : `Silakan ke kasir untuk membayar Rp ${total.toLocaleString('id-ID')}`
                                            }
                                        </p>
                                        <Button className="w-full bg-slate-900" onClick={handlePaymentSuccess}>Konfirmasi Pesanan</Button>
                                    </div>
                                )}
                            </div>
                        )}
                        {isSuccess && (
                            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"><Truck className="w-12 h-12" /></motion.div>
                                <h2 className="text-2xl font-bold mb-2">Pesanan Diterima!</h2>
                                <p className="text-gray-500 text-center mb-8">Mohon tunggu, kami sedang memproses pesananmu.</p>
                                <Button onClick={handlePrint} variant="outline" className="mb-4 w-full">Cetak Struk</Button>
                            </div>
                        )}
                        {/* Hidden Receipt */}
                        <div className="hidden">
                            <div ref={contentRef} className="p-8 font-mono text-sm">
                                <h1 className="text-center font-bold text-xl mb-4">RESTORAN ENAK</h1>
                                {/* ... Receipt content same as before but added delivery details ... */}
                                <div className="flex justify-between"><span>Method:</span><span>{activeOrderMethod.toUpperCase()}</span></div>
                                <hr className="border-dashed border-gray-400 my-2" />
                                <div className="space-y-2">
                                    {cart.map(item => (
                                        <div key={item.id}>
                                            <div className="flex justify-between"><span>{item.quantity}x {item.name}</span><span>{(item.quantity * item.price).toLocaleString('id-ID')}</span></div>
                                            {item.note && <div className="text-xs pl-4 italic">Note: {item.note}</div>}
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-dashed border-gray-400 my-2" />
                                <div className="flex justify-between font-bold"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Location Picker Modal */}
            <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
                <DialogContent className="max-w-xl w-full h-[80vh] flex flex-col p-4 bg-slate-50">
                    <DialogHeader>
                        <DialogTitle>Pilih Lokasi Pengiriman</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 rounded-2xl overflow-hidden relative border-2 border-slate-200">
                        <LocationPicker
                            initialLat={deliveryDetails?.location?.lat}
                            initialLng={deliveryDetails?.location?.lng}
                            onLocationSelect={(lat, lng) => {
                                setFormDetails(prev => ({ ...prev, location: { lat, lng } }))
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setPickerOpen(false)}>Simpan Lokasi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
