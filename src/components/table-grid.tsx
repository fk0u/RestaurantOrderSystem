'use client'
import { Table } from '@/lib/store'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TableGridProps {
    tables: Table[]
    onSelect: (tableId: string) => void
    selectedId: string | null
}

export function TableGrid({ tables, onSelect, selectedId }: TableGridProps) {
    return (
        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-100/50 rounded-3xl border border-white/50 backdrop-blur-sm">
            {tables.map((table) => {
                const isOccupied = table.status === 'occupied'
                const isSelected = selectedId === table.id

                return (
                    <motion.button
                        key={table.id}
                        whileHover={{ scale: isOccupied ? 1 : 1.05 }}
                        whileTap={{ scale: isOccupied ? 1 : 0.9 }}
                        disabled={isOccupied}
                        onClick={() => onSelect(table.id)}
                        className={cn(
                            "aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-bold shadow-sm transition-all relative overflow-hidden",
                            isOccupied ? "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed grayscale-[0.5]" :
                                isSelected ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-110 z-10" :
                                    "bg-white text-slate-600 border border-emerald-100/50 hover:border-emerald-300 hover:shadow-md"
                        )}
                    >
                        <span className="z-10">#{table.number}</span>
                        <span className="text-[10px] font-normal opacity-80 z-10 mt-1">{table.capacity} Org</span>

                        {/* Visual Flair */}
                        {!isOccupied && !isSelected && (
                            <div className="absolute bottom-0 w-full h-1 bg-emerald-500/10" />
                        )}
                    </motion.button>
                )
            })}
        </div>
    )
}
