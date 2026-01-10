'use client'

import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

// Mock Data for Charts
const WEEKLY_DATA = [
    { day: 'Sen', sales: 2.5 },
    { day: 'Sel', sales: 3.2 },
    { day: 'Rab', sales: 4.8 },
    { day: 'Kam', sales: 3.5 },
    { day: 'Jum', sales: 5.2 },
    { day: 'Sab', sales: 7.8 },
    { day: 'Min', sales: 6.5 },
]

export default function AdminPage() {
    const { history } = useStore()

    // Calculate simple stats from history
    const totalSales = history.reduce((acc, order) => acc + (order.total || 0), 0)
    const totalOrders = history.length
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Ringkasan performa restoranmu hari ini.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-green-600">Live Updates</span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Penjualan"
                    value={`Rp ${totalSales.toLocaleString('id-ID')}`}
                    trend="+12.5%"
                    isUp={true}
                    icon={DollarSign}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    title="Total Pesanan"
                    value={totalOrders.toString()}
                    trend="+5.2%"
                    isUp={true}
                    icon={ShoppingBag}
                    color="bg-orange-100 text-orange-600"
                />
                <StatCard
                    title="Rata-rata Order"
                    value={`Rp ${avgOrderValue.toLocaleString('id-ID')}`}
                    trend="-2.1%"
                    isUp={false}
                    icon={TrendingUp}
                    color="bg-blue-100 text-blue-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-6">Tren Penjualan Mingguan (Juta Rp)</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {WEEKLY_DATA.map((d, i) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.sales * 10}%` }}
                                    className="w-full bg-slate-100 rounded-t-xl relative group-hover:bg-orange-500 transition-colors"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {d.sales}jt
                                    </div>
                                </motion.div>
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-800">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-6">Menu Terpopuler</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Nasi Goreng Spesial', count: 124, percent: 85 },
                            { name: 'Mie Goreng Jawa', count: 98, percent: 65 },
                            { name: 'Ayam Bakar Madu', count: 85, percent: 55 },
                            { name: 'Es Teh Manis', count: 245, percent: 95 },
                        ].map((item, i) => (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="w-8 font-bold text-slate-400">#{i + 1}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-700">{item.name}</span>
                                        <span className="text-xs text-slate-500">{item.count} terjual</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percent}%` }}
                                            className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-6">Pesanan Terbaru</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-sm border-b border-slate-100">
                                <th className="pb-4 pl-4 font-medium">Order ID</th>
                                <th className="pb-4 font-medium">Customer</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Total</th>
                                <th className="pb-4 font-medium">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {history.slice(0, 5).map((order) => (
                                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-4 font-mono font-bold text-slate-700">{order.id}</td>
                                    <td className="py-4 font-bold">{order.deliveryDetails?.name || 'Dine In User'}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'cooking' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4">Rp {order.total.toLocaleString('id-ID')}</td>
                                    <td className="py-4 text-slate-400">{new Date(order.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">Belum ada pesanan masuk.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, isUp, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{value}</h2>
                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    )
}
