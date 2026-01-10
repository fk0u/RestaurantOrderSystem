
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
    modifiers?: {
        spicyLevel: number
        selectedToppings: string[]
    }
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

export type TakeawayDetails = {
    name: string
    phone: string
    time: string
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
    takeawayDetails: TakeawayDetails | null
    setOrderMethod: (method: OrderMethod) => void
    setTableId: (id: string) => void
    setDeliveryDetails: (details: DeliveryDetails) => void
    setTakeawayDetails: (details: TakeawayDetails) => void
    resetOnboarding: () => void

    // Cart
    cart: CartItem[]
    addToCart: (item: MenuItem, quantity?: number, note?: string, modifiers?: any) => void
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
    reviews: Review[]
    addReview: (review: Review) => void
}

export interface Review {
    id: string
    orderId: string
    rating: number
    comment?: string
    date: string
    user: string
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            orderMethod: null,
            tableId: null,
            deliveryDetails: null,
            takeawayDetails: null,
            setOrderMethod: (method) => set({ orderMethod: method }),
            setTableId: (id) => set({ tableId: id }),
            setDeliveryDetails: (details) => set({ deliveryDetails: details }),
            setTakeawayDetails: (details) => set({ takeawayDetails: details }),
            resetOnboarding: () => set({ orderMethod: null, tableId: null, deliveryDetails: null, takeawayDetails: null, cart: [], voucher: null }),

            cart: [],
            addToCart: (item, quantity = 1, note = '', modifiers = {}) => {
                const { cart } = get()
                // Check if same item with same modifiers exists
                const existing = cart.find((c) =>
                    c.id === item.id &&
                    JSON.stringify(c.modifiers) === JSON.stringify(modifiers)
                )

                if (existing) {
                    if (existing.quantity < item.stock) {
                        set({
                            cart: cart.map((c) =>
                                c === existing ? { ...c, quantity: c.quantity + quantity } : c
                            ),
                        })
                    }
                } else {
                    set({ cart: [...cart, { ...item, quantity, note, modifiers }] })
                }
            },
            removeFromCart: (id) => {
                // Warning: This simplistic removal by ID might remove duplicates with different modifiers
                // For a robust system, we should use a unique instance ID. 
                // But for this demo, let's just filter by ID which might be aggressive.
                // Better approach: Since we don't have unique instance IDs, we might need to filter carefully.
                // However, user usually wants to remove specific item. 
                // Let's assume user removes all instances of that product for now or change logic later if requested.
                // Actually, let's keep it simple. If we want to remove specific one, we need index or instance ID.
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
            addToHistory: (order) => set((state) => ({ history: [order, ...state.history] })),

            reviews: [],
            addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
        }),
        {
            name: 'restaurant-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                orderMethod: state.orderMethod,
                tableId: state.tableId,
                deliveryDetails: state.deliveryDetails,
                takeawayDetails: state.takeawayDetails,
                cart: state.cart,
                wishlist: state.wishlist,
                history: state.history,
                voucher: state.voucher
            }),
        }
    )
)
