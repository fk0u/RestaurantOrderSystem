'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TableGrid } from '@/components/table-grid'
import { useStore, Table } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Utensils, ShoppingBag, Users, ArrowRight, ChevronLeft } from 'lucide-react'

export default function OnboardingPage() {
    const [step, setStep] = useState(1) // 1: Method, 2: Guests, 3: Table
    const [guests, setGuests] = useState(2)
    const [tables, setTables] = useState<Table[]>([])
    const [selectedTable, setSelectedTableLocal] = useState<string | null>(null)

    const { setOrderMethod, setTableId, resetOnboarding } = useStore()
    const router = useRouter()

    useEffect(() => {
        resetOnboarding()
        // Fetch tables
        fetch('/api/table').then(res => res.json()).then(setTables)
    }, [])

    const handleMethod = (method: 'dine-in' | 'takeaway') => {
        setOrderMethod(method)
        if (method === 'takeaway') {
            router.push('/menu')
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

    return (
        <div className="min-h-full bg-background flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        className="flex-1 flex flex-col justify-end p-8 pb-12 z-10"
                    >
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200">
                                    👋 Selamat Datang
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 mt-4 leading-[1.1]">
                                    Mau makan<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">gimana hari ini?</span>
                                </h1>
                                <p className="text-slate-500 text-lg">Pilih cara pesananmu untuk pengalaman terbaik.</p>
                            </motion.div>
                        </div>

                        <div className="grid gap-4">
                            <Button
                                className="h-24 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl shadow-orange-500/5 hover:scale-[1.02] transition-all p-0 overflow-hidden relative group"
                                onClick={() => handleMethod('dine-in')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between w-full px-8">
                                    <div className="text-left">
                                        <span className="block text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Dine In</span>
                                        <span className="text-slate-400 text-sm">Makan di tempat</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <Utensils className="w-6 h-6" />
                                    </div>
                                </div>
                            </Button>
                            <Button
                                className="h-24 rounded-[2rem] bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all p-0 overflow-hidden relative group border border-slate-800"
                                onClick={() => handleMethod('takeaway')}
                            >
                                <div className="flex items-center justify-between w-full px-8">
                                    <div className="text-left">
                                        <span className="block text-xl font-bold">Take Away</span>
                                        <span className="text-slate-400 text-sm">Bungkus bawa pulang</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex-1 flex flex-col p-6 z-10"
                    >
                        <div className="flex items-center mb-8 pt-4">
                            <Button variant="outline" size="icon" className="rounded-full border-slate-200" onClick={() => setStep(1)}><ChevronLeft /></Button>
                            <div className="w-full text-center pr-10">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Step 1/2</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Untuk berapa orang?</h2>
                            <p className="text-slate-500 mb-12">Sesuaikan dengan jumlah rombonganmu</p>

                            <div className="relative mb-12">
                                <motion.div
                                    key={guests}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-9xl font-black text-slate-900 tracking-tighter"
                                >
                                    {guests}
                                </motion.div>
                                <div className="flex -space-x-4 absolute -bottom-8 left-1/2 -translate-x-1/2">
                                    {[...Array(Math.min(guests, 5))].map((_, i) => (
                                        <motion.div key={i} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 border-4 border-white shadow-lg" />
                                    ))}
                                    {guests > 5 && <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-xs font-bold text-slate-500">+{guests - 5}</div>}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Button
                                    className="w-16 h-16 rounded-full text-3xl pb-2 bg-white border-2 border-slate-100 text-slate-800 shadow-lg hover:bg-slate-50"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                >
                                    -
                                </Button>
                                <Button
                                    className="w-16 h-16 rounded-full text-3xl pb-2 bg-slate-900 text-white shadow-xl hover:scale-110 transition-transform"
                                    onClick={() => setGuests(Math.min(10, guests + 1))}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <Button className="w-full h-16 rounded-[2rem] text-lg font-bold bg-primary text-primary-foreground shadow-xl shadow-orange-500/20 mt-auto" onClick={handleGuestNext}>
                            Lanjut Pilih Meja
                        </Button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex-1 flex flex-col h-full bg-slate-50"
                    >
                        <div className="p-6 pb-2 pt-8 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-100">
                            <Button variant="ghost" size="icon" onClick={() => setStep(2)}><ChevronLeft /></Button>
                            <h2 className="text-lg font-bold">Pilih Meja ({guests} Org)</h2>
                            <div className="w-10" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
                                <TableGrid
                                    tables={tables}
                                    onSelect={setSelectedTableLocal}
                                    selectedId={selectedTable}
                                />
                                <div className="flex justify-center gap-6 mt-8 text-xs font-medium text-slate-500">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border border-emerald-200 shadow-sm" /> Kosong</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-50 border border-red-100" /> Terisi</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow- Emerald-500/30" /> Pilihanmu</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100">
                            <Button
                                className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-xl transition-all"
                                disabled={!selectedTable}
                                onClick={handleTableFinish}
                            >
                                {selectedTable ? (
                                    <span className="flex items-center">
                                        Konfirmasi Meja #{tables.find(t => t.id === selectedTable)?.number} <ArrowRight className="ml-2" />
                                    </span>
                                ) : 'Pilih Meja Dulu'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

