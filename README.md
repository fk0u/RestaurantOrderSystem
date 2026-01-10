# Restaurant Order System

A modern, full-featured restaurant ordering application built with Next.js 16 and React 19. This system is designed to handle dine-in, takeaway, and delivery orders with real-time tracking and QRIS payment integration.

## 🚀 Features

-   **Seamless Ordering**: Intuitive interface for customers to browse the menu, add items to cart, and place orders.
-   **Delivery Tracking**: Real-time order tracking using interactive maps (Leaflet), showing restaurant location, driver position, and delivery path.
-   **Dynamic QRIS Payment**: Integrated QRIS generator that automatically adjusts payment strings based on order amounts for easy scanning.
-   **Admin Dashboard**: comprehensive dashboard for restaurant managers to oversee orders, menus, and business metrics.
-   **Kitchen Display System (KDS)**: Dedicated interface for kitchen staff to view and manage incoming orders in real-time.
-   **Order History**: Users can view their past orders and re-order favorites.
-   **Wishlist**: Save favorite menu items for quick access.
-   **Responsive Design**: Mobile-first approach ensuring a smooth experience across all devices.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **UI Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Maps**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
-   **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Database**: Better-SQLite3 (Local)
-   **Icons**: Lucide React

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd RestaurantOrderSystem
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the application**
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard
│   ├── kitchen/      # Kitchen display system
│   ├── order/        # Order flow
│   ├── menu/         # Menu browsing
│   └── ...
├── components/       # Reusable UI components
├── lib/              # Utility functions and shared logic
└── mocks/            # Mock data for testing/development
```

## 📜 Scripts

-   `npm run dev`: Start various development server
-   `npm run build`: Build the application for production
-   `npm start`: Start the production server
-   `npm run lint`: Run ESLint to check for code quality issues
