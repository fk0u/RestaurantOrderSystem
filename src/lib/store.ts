
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface MenuItem {
    id: number
    name: string
    price: number
    image: string
    category: string
    stock: number
    description: string
    popular: boolean
}

export type CartItem = MenuItem & {
    quantity: number
    note?: string
}

export type OrderMethod = 'dine-in' | 'takeaway' | 'delivery'

export type Table = {
    id: string
    number: number
    capacity: number
    status: 'available' | 'occupied'
}

export type DeliveryDetails = {
    name: string
    phone: string
    address: string
    location?: { lat: number, lng: number }
}

export type Voucher = {
    code: string
    discount: number // absolute value
    type: 'percent' | 'fixed'
}

interface AppState {
    // Onboarding
    orderMethod: OrderMethod | null
    tableId: string | null
    deliveryDetails: DeliveryDetails | null
    setOrderMethod: (method: OrderMethod) => void
    setTableId: (id: string) => void
    setDeliveryDetails: (details: DeliveryDetails) => void
    resetOnboarding: () => void

    // Cart
    cart: CartItem[]
    addToCart: (item: MenuItem) => void
    removeFromCart: (itemId: number) => void
    updateQuantity: (itemId: number, delta: number) => void
    updateItemNote: (itemId: number, note: string) => void
    clearCart: () => void

    // Voucher
    voucher: Voucher | null
    applyVoucher: (voucher: Voucher) => void
    removeVoucher: () => void

    // Wishlist
    wishlist: number[] // IDs
    toggleWishlist: (itemId: number) => void

    // History
    history: any[]
    addToHistory: (order: any) => void
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            orderMethod: null,
            tableId: null,
            deliveryDetails: null,
            setOrderMethod: (method) => set({ orderMethod: method }),
            setTableId: (id) => set({ tableId: id }),
            setDeliveryDetails: (details) => set({ deliveryDetails: details }),
            resetOnboarding: () => set({ orderMethod: null, tableId: null, deliveryDetails: null, cart: [], voucher: null }),

            cart: [],
            addToCart: (item) => {
                const { cart } = get()
                const existing = cart.find((c) => c.id === item.id)
                if (existing) {
                    if (existing.quantity < item.stock) {
                        set({
                            cart: cart.map((c) =>
                                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                            ),
                        })
                    }
                } else {
                    set({ cart: [...cart, { ...item, quantity: 1, note: '' }] })
                }
            },
            removeFromCart: (id) => {
                set({ cart: get().cart.filter((c) => c.id !== id) })
            },
            updateQuantity: (id, delta) => {
                const { cart } = get()
                set({
                    cart: cart
                        .map((c) => {
                            if (c.id === id) {
                                const newQty = c.quantity + delta
                                return { ...c, quantity: newQty }
                            }
                            return c
                        })
                        .filter((c) => c.quantity > 0),
                })
            },
            updateItemNote: (id, note) => {
                set({
                    cart: get().cart.map((c) => c.id === id ? { ...c, note } : c)
                })
            },
            clearCart: () => set({ cart: [], voucher: null }),

            voucher: null,
            applyVoucher: (voucher) => set({ voucher }),
            removeVoucher: () => set({ voucher: null }),

            wishlist: [],
            toggleWishlist: (id) => {
                const { wishlist } = get()
                if (wishlist.includes(id)) {
                    set({ wishlist: wishlist.filter((w) => w !== id) })
                } else {
                    set({ wishlist: [...wishlist, id] })
                }
            },

            history: [],
            addToHistory: (order) => set({ history: [order, ...get().history] }),
        }),
        {
            name: 'restaurant-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                orderMethod: state.orderMethod,
                tableId: state.tableId,
                deliveryDetails: state.deliveryDetails,
                cart: state.cart,
                wishlist: state.wishlist,
                history: state.history,
                // Do not persist voucher to avoid stale codes? Actually persistence is fine.
                voucher: state.voucher
            }),
        }
    )
)
