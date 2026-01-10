'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    orderId: string
    onSubmit: (rating: number, comment: string) => void
}

export function ReviewModal({ isOpen, onClose, orderId, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Mohon beri rating bintang! ⭐")
            return
        }
        onSubmit(rating, comment)
        onClose()
        toast.success("Terima kasih atas ulasanmu! 🎉")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-[2rem]">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl font-black">Bagaimana makanannya?</DialogTitle>
                    <p className="text-sm text-slate-500">Order ID: {orderId}</p>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6 space-y-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                aria-label={`Beri rating ${star} bintang`}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                />
                            </button>
                        ))}
                    </div>

                    <Textarea
                        placeholder="Ceritakan pengalaman rasamu... (Opsional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus:border-orange-500"
                    />
                </div>

                <DialogFooter>
                    <Button
                        className="w-full h-12 rounded-xl text-lg font-bold"
                        onClick={handleSubmit}
                    >
                        Kirim Ulasan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
