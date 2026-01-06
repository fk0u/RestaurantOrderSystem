'use client'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { QRIS_STATIC_PAYLOAD, generateQrisString } from '@/lib/qris'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface QrisPaymentProps {
    total: number
    onSuccess: () => void
}

export function QrisPayment({ total, onSuccess }: QrisPaymentProps) {
    const [payload, setPayload] = useState('')
    const [status, setStatus] = useState<'idle' | 'generating' | 'waiting' | 'paid'>('idle')

    useEffect(() => {
        if (status === 'idle') {
            setStatus('generating')
            // Simulate generation delay
            setTimeout(() => {
                const qris = generateQrisString(QRIS_STATIC_PAYLOAD, total)
                setPayload(qris)
                setStatus('waiting')

                // Simulate Payment Success after 5s
                setTimeout(() => {
                    setStatus('paid')
                    onSuccess()
                }, 8000)
            }, 1000)
        }
    }, [status, total, onSuccess])

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full bg-white rounded-xl">
            {status === 'generating' && (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
                    <p className="text-gray-500 font-medium">Membuat QRIS...</p>
                </div>
            )}

            {status === 'waiting' && (
                <>
                    <h3 className="font-bold text-xl text-slate-800">Scan QRIS</h3>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-slate-100">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={payload}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-lg font-bold text-slate-900">Rp {total.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-orange-500 font-bold bg-orange-100 px-3 py-1 rounded-full animate-pulse inline-block">Menunggu Pembayaran...</p>
                    </div>
                </>
            )}

            {status === 'paid' && (
                <div className="flex flex-col items-center gap-2 text-emerald-500">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="font-bold text-lg">Pembayaran Berhasil!</p>
                </div>
            )}
        </div>
    )
}
