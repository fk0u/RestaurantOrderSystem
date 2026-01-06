'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { Utensils, Home, Car } from 'lucide-react'

// Custom Icons (using Leaflet DivIcon for Lucide React icons)
const createIcon = (iconHtml: string, color: string) => L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid white;">${iconHtml}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
})

// Hardcoded restaurant location (Jakarta Center-ish)
const RESTAURANT_LOC: [number, number] = [-6.200000, 106.816666]

interface OrderTrackerMapProps {
    userLocation: { lat: number, lng: number }
    driverLocation?: { lat: number, lng: number }
    status: string
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, map.getZoom())
    }, [center, map])
    return null
}

export default function OrderTrackerMap({ userLocation, driverLocation, status }: OrderTrackerMapProps) {
    const restaurantIcon = createIcon('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>', '#f97316') // Orange
    const homeIcon = createIcon('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', '#3b82f6') // Blue
    const carIcon = createIcon('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>', '#10b981') // Green

    const userLocArr: [number, number] = [userLocation.lat, userLocation.lng]
    const driverLocArr: [number, number] = driverLocation ? [driverLocation.lat, driverLocation.lng] : RESTAURANT_LOC

    return (
        <MapContainer center={RESTAURANT_LOC} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0 block">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />

            {/* Restaurant */}
            <Marker position={RESTAURANT_LOC} icon={restaurantIcon}>
                <Popup>Restoran Kami</Popup>
            </Marker>

            {/* User Home */}
            <Marker position={userLocArr} icon={homeIcon}>
                <Popup>Lokasi Pengiriman</Popup>
            </Marker>

            {/* Driver (Only if active) */}
            {driverLocation && (
                <Marker position={driverLocArr} icon={carIcon} zIndexOffset={100}>
                    <Popup>Driver</Popup>
                </Marker>
            )}

            {/* Path */}
            <Polyline positions={[RESTAURANT_LOC, userLocArr]} color="#94a3b8" dashArray="10, 10" opacity={0.6} />

            {/* Auto focus on driver if exists, else restaurant */}
            <MapUpdater center={driverLocation ? driverLocArr : RESTAURANT_LOC} />
        </MapContainer>
    )
}
