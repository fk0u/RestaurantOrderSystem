'use client'

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void
    initialLat?: number
    initialLng?: number
}

function DraggableMarker({ onDragEnd, position }: { onDragEnd: (lat: number, lng: number) => void, position: [number, number] }) {
    const markerRef = useRef<any>(null)

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current
            if (marker != null) {
                const { lat, lng } = marker.getLatLng()
                onDragEnd(lat, lng)
            }
        },
    }

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    )
}

function MapEvents({ onMove }: { onMove: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onMove(e.latlng.lat, e.latlng.lng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })
    return null
}

export default function LocationPicker({ onLocationSelect, initialLat = -6.200000, initialLng = 106.816666 }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number]>([initialLat, initialLng])

    const handleUpdate = (lat: number, lng: number) => {
        setPosition([lat, lng])
        onLocationSelect(lat, lng)
    }

    return (
        <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden z-0">
            <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full z-0">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <DraggableMarker position={position} onDragEnd={handleUpdate} />
                <MapEvents onMove={handleUpdate} />
            </MapContainer>

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg z-[1000] text-center text-xs text-slate-500">
                <MapPin className="w-4 h-4 inline-block mr-1 text-orange-500" />
                Geser pin atau klik peta untuk menentukan lokasi rumahmu.
            </div>
        </div>
    )
}
