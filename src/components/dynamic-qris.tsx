'use client'

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Download, Copy, Share2, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { generateQrisString, QRIS_STATIC_PAYLOAD } from '@/lib/qris'
import { createWorker } from 'tesseract.js'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

interface DynamicQRISProps {
    amount: number
    onRefresh?: () => void // Kept name for compatibility, but acts as 'onConfirm'
}

export function DynamicQRIS({ amount, onRefresh }: DynamicQRISProps) {
    const [qrData, setQrData] = useState<string | null>(null)
    const [merchantName, setMerchantName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // OCR States
    const [isVerifying, setIsVerifying] = useState(false)
    const [isValidProof, setIsValidProof] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Validation Error Modal State
    const [validationError, setValidationError] = useState<{ title: string; message: string } | null>(null)

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
            toast.success('Kode QRIS berhasil disalin!')
        }
    }

    const verifyPaymentProof = async (file: File) => {
        setIsVerifying(true)
        const toastId = toast.loading('Memverifikasi bukti pembayaran...')

        try {
            const worker = await createWorker('ind')
            const { data: { text } } = await worker.recognize(file)
            await worker.terminate()

            const cleanText = text.toLowerCase()
            console.log("OCR Result:", cleanText)

            // 1. Verify Merchant (Strict)
            const hasMerchant = cleanText.includes('kou') || cleanText.includes('digital') || cleanText.includes('kreatif')

            // 2. Verify Amount (Strict)
            const amountStr = amount.toString()
            const formattedDot = amount.toLocaleString('id-ID').replace(/,/g, '.')
            const formattedComma = amount.toLocaleString('en-US').replace(/,/g, ',')
            const digitsOnly = cleanText.replace(/[^0-9\s]/g, '')

            const hasAmount = cleanText.includes(amountStr) ||
                cleanText.includes(formattedDot) ||
                cleanText.includes(formattedComma) ||
                digitsOnly.includes(amountStr)

            if (!hasMerchant) {
                throw new Error('Merchant invalid')
            }

            if (!hasAmount) {
                throw new Error('Nominal invalid')
            }

            setIsValidProof(true)
            toast.success('Bukti pembayaran valid!', { id: toastId })

        } catch (error: any) {
            console.error(error)
            setIsValidProof(false)
            toast.dismiss(toastId)

            // Set specific error message for Modal
            if (error.message === 'Merchant invalid') {
                setValidationError({
                    title: "Merchant Tidak Sesuai",
                    message: "Bukti transfer tidak mentransfer ke Merchant yang benar (KOU Digital & Kreatif). Silahkan cek kembali."
                })
            } else if (error.message === 'Nominal invalid') {
                setValidationError({
                    title: "Nominal Salah",
                    message: `Nominal yang terdeteksi tidak sesuai dengan total tagihan (Rp ${amount.toLocaleString('id-ID')}). Harap bayar sesuai tagihan.`
                })
            } else {
                setValidationError({
                    title: "Gagal Verifikasi",
                    message: "Bukti pembayaran tidak dapat dibaca dengan jelas atau tidak valid. Pastikan foto terang dan jelas."
                })
            }
        } finally {
            setIsVerifying(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setIsValidProof(false) // Reset valid status on new file
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)

            // Trigger Verification
            verifyPaymentProof(file)
        }
    }

    const handleConfirmPayment = () => {
        if (!selectedFile) return
        if (!isValidProof) {
            toast.error('Gagal Konfirmasi', {
                description: "Bukti pembayaran belum terverifikasi valid."
            })
            return
        }
        // Trigger parent callback if it exists, or just close
        if (onRefresh) onRefresh()
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

            {/* Content: QR or Upload Preview */}
            <div className="relative w-64 h-64 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 overflow-hidden mb-6 group">
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

                {timeLeft === 0 && !loading && !previewUrl && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-20 p-4 text-center">
                        <AlertTriangle className="w-10 h-10 text-orange-500 mb-2" />
                        <p className="font-bold text-slate-800">QR Code Kedaluwarsa</p>
                        <Button onClick={generateQRIS} size="sm" className="mt-4 bg-orange-500 hover:bg-orange-600">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                )}

                {/* Proof Preview */}
                {previewUrl ? (
                    <div className="absolute inset-0 z-30 bg-black">
                        <img src={previewUrl} alt="Bukti Transfer" className="w-full h-full object-contain" />
                        <button
                            onClick={() => {
                                setPreviewUrl(null)
                                setSelectedFile(null)
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <canvas ref={canvasRef} className={cn("w-full h-full object-contain p-2", (loading || timeLeft === 0 || error) ? "opacity-20" : "opacity-100")} />
                )}
            </div>

            {/* Timer & Merchant */}
            {!previewUrl && (
                <div className="w-full space-y-4 mb-6">
                    <div className={cn("flex items-center justify-center gap-2 py-2 rounded-xl transition-colors", timeLeft < 60 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>

                    {merchantName && (
                        <p className="text-center text-xs text-slate-400">
                            Merchant: <span className="font-bold text-slate-600">{merchantName}</span>
                        </p>
                    )}
                </div>
            )}

            {/* Actions: Upload & Confirm */}
            <div className="w-full space-y-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {!previewUrl ? (
                    <Button
                        variant="outline"
                        className="w-full h-12 border-dashed border-2 border-slate-300 text-slate-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Upload Bukti Transfer
                    </Button>
                ) : (
                    <Button
                        className={cn(
                            "w-full h-12 font-bold transition-all",
                            isValidProof ? "bg-green-500 hover:bg-green-600 text-white" : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        )}
                        onClick={handleConfirmPayment}
                        disabled={isVerifying || !isValidProof}
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Memeriksa...
                            </>
                        ) : isValidProof ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Konfirmasi Pembayaran
                            </>
                        ) : (
                            "Bukti Tidak Valid"
                        )}
                    </Button>
                )}

                {!previewUrl && (
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" className="h-10 text-xs text-slate-400" onClick={downloadQR} disabled={!qrData || loading}>
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Simpan QR
                        </Button>
                        <Button variant="ghost" className="h-10 text-xs text-slate-400" onClick={copyQRString} disabled={!qrData || loading}>
                            <Copy className="w-3.5 h-3.5 mr-2" />
                            Salin Kode
                        </Button>
                    </div>
                )}
            </div>

            {/* Error Logic Modal */}
            <Dialog open={!!validationError} onOpenChange={(open) => !open && setValidationError(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {validationError?.title}
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-slate-700 font-medium">
                            {validationError?.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setValidationError(null)} variant="secondary" className="w-full sm:w-auto">
                            Coba Lagi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
