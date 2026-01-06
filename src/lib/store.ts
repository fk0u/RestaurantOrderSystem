
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

export type CartItem = MenuItem & { quantity: number }

export type OrderMethod = 'dine-in' | 'takeaway'

export type Table = {
    id: string
    number: number
    capacity: number
    status: 'available' | 'occupied'
}

interface AppState {
    // Onboarding
    orderMethod: OrderMethod | null
    tableId: string | null
    setOrderMethod: (method: OrderMethod) => void
    setTableId: (id: string) => void
    resetOnboarding: () => void

    // Cart
    cart: CartItem[]
    addToCart: (item: MenuItem) => void
    removeFromCart: (itemId: number) => void
    updateQuantity: (itemId: number, delta: number) => void
    clearCart: () => void

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
            setOrderMethod: (method) => set({ orderMethod: method }),
            setTableId: (id) => set({ tableId: id }),
            resetOnboarding: () => set({ orderMethod: null, tableId: null, cart: [] }),

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
                    set({ cart: [...cart, { ...item, quantity: 1 }] })
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
            clearCart: () => set({ cart: [] }),

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
                // Persist everything except maybe temporary session if needed.
                // User implied persistence for Wishlist and maybe TableId if refreshed?
                // "Simpan tableId ke localStorage". So yes.
                orderMethod: state.orderMethod,
                tableId: state.tableId,
                cart: state.cart,
                wishlist: state.wishlist,
                history: state.history,
            }),
        }
    )
)
