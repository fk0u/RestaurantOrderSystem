
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TableGrid } from '@/components/table-grid'
import { useStore, Table, DeliveryDetails, TakeawayDetails } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Utensils, ShoppingBag, Truck, ArrowRight, ChevronLeft, MapPin, Clock, User, Phone, Star } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

// Dynamic import for Leaflet map
const LocationPicker = dynamic(() => import('@/components/location-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function OnboardingPage() {
    // Steps: 1=Method, 2=Guests(DineIn), 3=Table(DineIn), 4=DeliveryDetails, 5=TakeawayDetails
    const [step, setStep] = useState(1)
    const [guests, setGuests] = useState(2)
    const [tables, setTables] = useState<Table[]>([])
    const [selectedTable, setSelectedTableLocal] = useState<string | null>(null)

    // Delivery State
    const [deliveryForm, setDeliveryForm] = useState<DeliveryDetails>({ name: '', phone: '', address: '' })
    const [pickerOpen, setPickerOpen] = useState(false)

    // Takeaway State
    const [takeawayForm, setTakeawayForm] = useState<TakeawayDetails>({ name: '', phone: '', time: '' })

    const { setOrderMethod, setTableId, setDeliveryDetails, setTakeawayDetails, resetOnboarding } = useStore()
    const router = useRouter()

    useEffect(() => {
        resetOnboarding()
        fetch('/api/table').then(res => res.json()).then(setTables)
    }, [])

    const handleMethod = (method: 'dine-in' | 'takeaway' | 'delivery') => {
        setOrderMethod(method)
        if (method === 'takeaway') {
            setStep(5) // New Takeaway Details Step
        } else if (method === 'delivery') {
            setStep(4)
        } else {
            setStep(2)
        }
    }

    const handleGuestNext = () => setStep(3)

    const handleTableFinish = () => {
        if (selectedTable) {
            setTableId(selectedTable)
            router.push('/menu')
        }
    }

    const handleDeliveryFinish = () => {
        if (deliveryForm.name && deliveryForm.phone && deliveryForm.address && deliveryForm.location) {
            setDeliveryDetails(deliveryForm)
            router.push('/menu')
        }
    }

    const handleTakeawayFinish = () => {
        if (takeawayForm.name && takeawayForm.phone && takeawayForm.time) {
            setTakeawayDetails(takeawayForm)
            router.push('/menu')
        }
    }

    return (
        <div className="min-h-[100dvh] lg:h-screen bg-slate-50 flex overflow-hidden font-sans">

            {/* DESKTOP LEFT PANEL - BRANDING */}
            <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden text-white">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                            <Utensils className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">RestoApp</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-5xl font-black leading-tight mb-6">
                        Experience the <span className="text-orange-500">Future</span> of Dining
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Whether you're here to dine in, grab a quick takeaway, or enjoy at home, we've crafted the perfect seamless experience for you.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex text-yellow-500 text-xs">
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-xs text-slate-500 font-bold">Loved by 10k+ Foodies</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-600 font-medium">
                    © 2026 RestoApp Inc. All rights reserved.
                </div>
            </div>

            {/* RIGHT PANEL - CONTENT */}
            <div className="flex-1 relative flex flex-col h-full lg:overflow-y-auto">
                {/* Mobile Background Ambience (Hidden on lg to avoid clash) */}
                <div className="lg:hidden fixed top-0 right-0 w-[300px] h-[300px] bg-orange-400/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="lg:hidden fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full h-full lg:justify-center lg:py-12">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: SELECT METHOD */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                className="flex-1 flex flex-col justify-end p-6 pb-safe z-10 w-full"
                            >
                                <div className="space-y-4 mb-10 lg:text-center">
                                    <motion.div variants={itemVariants}>
                                        <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-slate-200 lg:border-slate-100 text-slate-600 text-xs font-bold shadow-sm inline-block">
                                            👋 Selamat Datang
                                        </span>
                                    </motion.div>
                                    <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                        Mau makan<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">gimana hari ini?</span>
                                    </motion.h1>
                                    <motion.p variants={itemVariants} className="text-slate-500 text-lg">Pilih cara pesananmu untuk pengalaman terbaik.</motion.p>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-3">
                                    <motion.button
                                        variants={itemVariants}
                                        className="group relative w-full h-28 lg:h-64 rounded-[2.5rem] bg-white lg:bg-orange-50/50 p-1 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-all hover:scale-[1.02] overflow-hidden text-left lg:flex lg:flex-col lg:items-center lg:justify-center lg:text-center lg:border-2 lg:border-transparent lg:hover:border-orange-200"
                                        onClick={() => handleMethod('dine-in')}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative h-full flex items-center px-8 lg:px-4 lg:flex-col lg:justify-center justify-between w-full">
                                            <div className="lg:order-2 lg:mt-4">
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Dine In</h3>
                                                <p className="text-slate-400 text-sm font-medium">Makan di tempat</p>
                                            </div>
                                            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform lg:order-1">
                                                <Utensils className="w-6 h-6 lg:w-8 lg:h-8" />
                                            </div>
                                        </div>
                                    </motion.button>

                                    <div className="grid grid-cols-2 gap-4 lg:contents">
                                        <motion.button
                                            variants={itemVariants}
                                            className="group relative h-32 lg:h-64 rounded-[2.5rem] bg-white lg:bg-blue-50/50 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center p-4 text-center lg:border-2 lg:border-transparent lg:hover:border-blue-200"
                                            onClick={() => handleMethod('takeaway')}
                                        >
                                            <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors lg:mb-4">
                                                <ShoppingBag className="w-5 h-5 lg:w-8 lg:h-8" />
                                            </div>
                                            <h3 className="text-base lg:text-xl font-bold text-slate-800">Take Away</h3>
                                            <p className="text-slate-400 text-[10px] lg:text-sm font-medium uppercase tracking-wider">Bungkus</p>
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            className="group relative h-32 lg:h-64 rounded-[2.5rem] bg-slate-900 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center p-4 text-center text-white lg:border-2 lg:border-slate-800"
                                            onClick={() => handleMethod('delivery')}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white/10 text-green-400 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors lg:mb-4">
                                                <Truck className="w-5 h-5 lg:w-8 lg:h-8" />
                                            </div>
                                            <h3 className="text-base lg:text-xl font-bold">Delivery</h3>
                                            <p className="text-slate-400 text-[10px] lg:text-sm font-medium uppercase tracking-wider">Antar</p>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: GUESTS (DINE IN) */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col h-full bg-white z-20 lg:bg-transparent lg:justify-center"
                            >
                                <div className="p-6">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 -ml-2" onClick={() => setStep(1)}><ChevronLeft /></Button>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center lg:flex-none">
                                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">Berapa Orang?</h2>
                                    <p className="text-slate-500 mb-12 lg:text-lg">Sesuaikan jumlah rombonganmu</p>

                                    <div className="relative mb-16">
                                        <motion.div
                                            key={guests}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-[8rem] lg:text-[10rem] leading-none font-black text-slate-900 tracking-tighter"
                                        >
                                            {guests}
                                        </motion.div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 border border-dashed border-slate-200 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <Button
                                            size="icon"
                                            className="w-16 h-16 rounded-full text-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-none shadow-none"
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                        >
                                            -
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="w-16 h-16 rounded-full text-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30"
                                            onClick={() => setGuests(Math.min(20, guests + 1))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-6 lg:max-w-md lg:mx-auto lg:w-full">
                                    <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800" onClick={handleGuestNext}>
                                        Lanjut Pilih Meja
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: SELECT TABLE (DINE IN) */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col h-full bg-slate-50 z-20"
                            >
                                <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-30 border-b border-slate-100 lg:rounded-t-[2.5rem]">
                                    <Button variant="ghost" size="icon" onClick={() => setStep(2)}><ChevronLeft /></Button>
                                    <h2 className="text-base font-bold">Pilih Meja ({guests} Org)</h2>
                                    <div className="w-10" />
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px]">
                                        <TableGrid tables={tables} onSelect={setSelectedTableLocal} selectedId={selectedTable} />
                                        <div className="flex justify-center gap-6 mt-8 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border border-slate-300" /> Kosong</div>
                                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" /> Terisi</div>
                                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30" /> Pilihanmu</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white border-t border-slate-100 z-30 lg:rounded-b-[2.5rem]">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-pink-600 border-none"
                                        disabled={!selectedTable}
                                        onClick={handleTableFinish}
                                    >
                                        {selectedTable ? `Konfirmasi Meja #${tables.find(t => t.id === selectedTable)?.number}` : 'Pilih Meja Dulu'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: DELIVERY DETAILS */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                className="flex-1 flex flex-col bg-white h-full z-20 lg:bg-transparent lg:justify-center"
                            >
                                <div className="p-6 border-b border-slate-50 lg:border-none lg:text-center">
                                    <div className="flex items-center mb-6 lg:justify-center lg:relative">
                                        <Button variant="ghost" size="icon" className="-ml-2 lg:absolute lg:left-0" onClick={() => setStep(1)}><ChevronLeft /></Button>
                                        <h1 className="text-xl font-bold ml-2 lg:ml-0 lg:text-2xl">Detail Pengiriman</h1>
                                    </div>

                                    <div className="space-y-6 lg:max-w-md lg:mx-auto lg:text-left">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="Nama Penerima"
                                                    className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 transition-all font-medium"
                                                    value={deliveryForm.name}
                                                    onChange={e => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="Nomor WhatsApp"
                                                    type="tel"
                                                    className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 transition-all font-medium"
                                                    value={deliveryForm.phone}
                                                    onChange={e => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Textarea
                                                    placeholder="Alamat Lengkap (Jalan, Nomor, Patokan)"
                                                    className="pl-12 py-3 min-h-[100px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-orange-500 transition-all font-medium resize-none"
                                                    value={deliveryForm.address}
                                                    onChange={e => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className={`relative h-40 rounded-2xl overflow-hidden border-2 ${deliveryForm.location ? 'border-green-500' : 'border-slate-100'} cursor-pointer group`}
                                            onClick={() => setPickerOpen(true)}
                                        >
                                            {deliveryForm.location ? (
                                                <div className="w-full h-full bg-green-50 flex flex-col items-center justify-center text-green-600">
                                                    <MapPin className="w-8 h-8 mb-2" />
                                                    <span className="font-bold text-sm">Lokasi Terpilih</span>
                                                    <span className="text-xs opacity-75">Klik untuk ubah</span>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                                                    <MapPin className="w-8 h-8 mb-2" />
                                                    <span className="font-bold text-sm">Tandai Lokasi di Peta</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 mt-auto lg:mt-0 lg:max-w-md lg:mx-auto lg:w-full">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-900 text-white shadow-xl"
                                        disabled={!deliveryForm.name || !deliveryForm.phone || !deliveryForm.address || !deliveryForm.location}
                                        onClick={handleDeliveryFinish}
                                    >
                                        Lanjut Pesan <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Map Dialog */}
                                <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
                                    <DialogContent className="max-w-xl w-full h-[80vh] flex flex-col p-0 overflow-hidden bg-slate-50 rounded-[2rem]">
                                        <DialogHeader className="p-4 bg-white z-10 relative shadow-sm">
                                            <DialogTitle>Tandai Lokasi Rumahmu</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 relative">
                                            <LocationPicker
                                                initialLat={deliveryForm.location?.lat}
                                                initialLng={deliveryForm.location?.lng}
                                                onLocationSelect={(lat, lng) => {
                                                    setDeliveryForm(prev => ({ ...prev, location: { lat, lng } }))
                                                }}
                                            />
                                        </div>
                                        <DialogFooter className="p-4 bg-white z-10 relative border-t border-slate-100">
                                            <Button className="w-full h-12 rounded-xl text-lg font-bold" onClick={() => setPickerOpen(false)}>
                                                Simpan Lokasi Ini
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </motion.div>
                        )}

                        {/* STEP 5: TAKEAWAY DETAILS (NEW) */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="flex-1 flex flex-col bg-white h-full z-20 lg:bg-transparent lg:justify-center"
                            >
                                <div className="p-6 lg:text-center">
                                    <div className="flex items-center mb-8 lg:justify-center lg:relative">
                                        <Button variant="ghost" size="icon" className="-ml-2 lg:absolute lg:left-0" onClick={() => setStep(1)}><ChevronLeft /></Button>
                                        <h1 className="text-xl font-bold ml-2 lg:ml-0 lg:text-2xl">Detail Takeaway</h1>
                                    </div>

                                    <div className="space-y-6 lg:max-w-md lg:mx-auto lg:text-left">
                                        <div className="bg-blue-50 p-6 rounded-[2rem] text-blue-800 mb-8">
                                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5" /> Ambil Sendiri
                                            </h3>
                                            <p className="text-sm opacity-80 leading-relaxed">
                                                Silakan isi data diri untuk memudahkan proses pengambilan pesananmu di restoran nanti.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="Nama Pemesan"
                                                    className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all font-medium"
                                                    value={takeawayForm.name}
                                                    onChange={e => setTakeawayForm({ ...takeawayForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    placeholder="Nomor WhatsApp"
                                                    type="tel"
                                                    className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all font-medium"
                                                    value={takeawayForm.phone}
                                                    onChange={e => setTakeawayForm({ ...takeawayForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                                <Input
                                                    type="time"
                                                    className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all font-medium"
                                                    value={takeawayForm.time}
                                                    onChange={e => setTakeawayForm({ ...takeawayForm, time: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 mt-auto lg:mt-0 lg:max-w-md lg:mx-auto lg:w-full">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-900 text-white shadow-xl hover:scale-[1.02] transition-transform"
                                        disabled={!takeawayForm.name || !takeawayForm.phone || !takeawayForm.time}
                                        onClick={handleTakeawayFinish}
                                    >
                                        Lanjut Pesan Menu <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
