'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const DUMMY_FEED = [
    {
        id: 1,
        type: 'video',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000', // Mock video thumb
        title: 'Nasi Goreng Spesial 🔥',
        desc: 'Pedasnya bikin nagih! Coba level 5 kalau berani!',
        likes: '1.2k',
        comments: 45,
        user: { name: 'Chef Juna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }
    },
    {
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000',
        title: 'Pizza Lumer 🧀',
        desc: 'Kejunya melimpah ruah, best seller minggu ini.',
        likes: '856',
        comments: 12,
        user: { name: 'Foodie JKT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' }
    },
    {
        id: 3,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=1000',
        title: 'Pancake Berries 🥞',
        desc: 'Sarapan manis untuk awali harimu.',
        likes: '2.4k',
        comments: 88,
        user: { name: 'Morning Vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella' }
    }
]

export default function DiscoverPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-black text-white pb-20 md:pb-0 md:pl-0">
            {/* Desktop Note: In real app this would be a grid, but adhering to "Vertical Feed" request for mobile feel even on desktop or just center it */}
            <div className="max-w-md mx-auto h-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
                {DUMMY_FEED.map((item) => (
                    <FeedItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

function FeedItem({ item }: { item: any }) {
    const [liked, setLiked] = useState(false)

    return (
        <div className="h-screen w-full snap-start relative bg-slate-900 flex items-center justify-center overflow-hidden">
            <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover opacity-80"
                priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* Content Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => setLiked(!liked)}
                        aria-label={liked ? "Batalkan suka" : "Suka konten"}
                        className={`p-3 rounded-full bg-white/10 backdrop-blur-md transition-all active:scale-90 ${liked ? 'bg-red-500/20 text-red-500' : 'text-white'}`}
                    >
                        <Heart className={`w-8 h-8 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-xs font-bold">{item.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button aria-label="Buka komentar" className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white transition-all active:scale-90">
                        <MessageCircle className="w-8 h-8" />
                    </button>
                    <span className="text-xs font-bold">{item.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button aria-label="Bagikan konten" className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white transition-all active:scale-90">
                        <Share2 className="w-8 h-8" />
                    </button>
                    <span className="text-xs font-bold">Share</span>
                </div>
            </div>

            {/* User Info & Desc */}
            <div className="absolute left-4 bottom-24 right-20 z-20 text-left">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                        <Image src={item.user.avatar} alt={item.user.name} fill />
                    </div>
                    <span className="font-bold text-lg">{item.user.name}</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full">
                        Follow
                    </Button>
                </div>
                <h2 className="text-2xl font-black mb-2">{item.title}</h2>
                <p className="text-sm text-slate-200 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-2 mt-4">
                    <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Trending Now</span>
                </div>
            </div>

            {/* Play Button Overlay (Decoration) */}
            {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 fill-white text-white ml-2" />
                    </div>
                </div>
            )}
        </div>
    )
}
