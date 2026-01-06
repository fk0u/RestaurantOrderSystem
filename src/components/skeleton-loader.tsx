import { Skeleton } from "@/components/ui/skeleton"

export function MenuCardSkeleton() {
    return (
        <div className="bg-white rounded-[2rem] p-3 border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/80 to-transparent w-full h-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
            <div className="space-y-2 px-1">
                <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-2 px-1">
                <div className="h-5 bg-slate-100 rounded-full w-1/3" />
                <div className="h-9 w-9 bg-slate-100 rounded-xl" />
            </div>
        </div>
    )
}

export function TableGridSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-3 p-4">
            {[...Array(16)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl bg-gray-200/50" />
            ))}
        </div>
    )
}
