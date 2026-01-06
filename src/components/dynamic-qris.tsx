'use client'

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Download, Copy, Share2, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { generateQrisString, QRIS_STATIC_PAYLOAD } from '@/lib/qris'

interface DynamicQRISProps {
    amount: number
    onRefresh?: () => void
}

export function DynamicQRIS({ amount, onRefresh }: DynamicQRISProps) {
    const [qrData, setQrData] = useState<string | null>(null)
    const [merchantName, setMerchantName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Countdown Timer
    useEffect(() => {
        if (!qrData) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [qrData])

    // Fetch and Generate QR
    useEffect(() => {
        generateQRIS()
    }, [amount])

    const generateQRIS = async () => {
        setLoading(true)
        setError(null)
        setTimeLeft(900)

        // Simulate network delay for effect
        setTimeout(async () => {
            try {
                // Use Local Generation
                const qrString = generateQrisString(QRIS_STATIC_PAYLOAD, amount)

                if (!qrString) {
                    throw new Error('Gagal generate QRIS')
                }

                setQrData(qrString)
                setMerchantName('KOU, Digital & Kreatif')

                // Render to Canvas
                if (canvasRef.current) {
                    await QRCode.toCanvas(canvasRef.current, qrString, {
                        width: 240,
                        margin: 2,
                        color: { dark: '#1e293b', light: '#ffffff' },
                        errorCorrectionLevel: 'H'
                    })
                }

            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat membuat QR')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 800)
    }

    // Format Time 00:00
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const downloadQR = () => {
        if (canvasRef.current) {
            const link = document.createElement('a')
            link.download = `QRIS-Payment-${amount}.png`
            link.href = canvasRef.current.toDataURL()
            link.click()
        }
    }

    const copyQRString = () => {
        if (qrData) {
            navigator.clipboard.writeText(qrData)
            alert('Kode QRIS berhasil disalin!')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[2rem] shadow-xl w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" className="h-6" />
                </div>
                <h3 className="text-slate-500 font-medium">Scan untuk membayar</h3>
                <p className="text-2xl font-black text-slate-900 mt-1">Rp {amount.toLocaleString('id-ID')}</p>
            </div>

            {/* QR Area */}
            <div className="relative w-64 h-64 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 overflow-hidden mb-6">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10"
                    >
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                        <span className="text-xs text-slate-400 font-bold">Generating QR...</span>
                    </motion.div>
                )}

                {timeLeft === 0 && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-20 p-4 text-center">
                        <AlertTriangle className="w-10 h-10 text-orange-500 mb-2" />
                        <p className="font-bold text-slate-800">QR Code Kedaluwarsa</p>
                        <Button onClick={generateQRIS} size="sm" className="mt-4 bg-orange-500 hover:bg-orange-600">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                )}

                {error && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-20 p-4 text-center">
                        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
                        <p className="font-bold text-red-600 text-sm">{error}</p>
                        <Button onClick={generateQRIS} size="sm" variant="outline" className="mt-4 border-red-200 text-red-600">
                            Coba Lagi
                        </Button>
                    </div>
                )}

                <canvas ref={canvasRef} className={cn("w-full h-full object-contain p-2", (loading || timeLeft === 0 || error) ? "opacity-20" : "opacity-100")} />
            </div>

            {/* Timer & Merchant */}
            <div className="w-full space-y-4">
                <div className={cn("flex items-center justify-center gap-2 py-2 rounded-xl transition-colors", timeLeft < 60 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                </div>

                {merchantName && (
                    <p className="text-center text-xs text-slate-400">
                        Merchant: <span className="font-bold text-slate-600">{merchantName}</span>
                    </p>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" className="h-10 text-xs" onClick={downloadQR} disabled={!qrData || loading}>
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Simpan
                    </Button>
                    <Button variant="outline" className="h-10 text-xs" onClick={copyQRString} disabled={!qrData || loading}>
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Salin
                    </Button>
                </div>
            </div>
        </div>
    )
}
