"use client";

import { useEffect, useRef } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Establishment } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

interface InteractiveMapProps {
  establishments: Establishment[];
  height?: number;
}

export function InteractiveMap({ establishments, height = 260 }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !mapboxgl.accessToken) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    establishments.forEach((establishment) => {
      const el = document.createElement('div');
      el.className =
        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-text shadow-lg';
      el.innerText = '€';
      markersRef.current.push(
        new mapboxgl.Marker(el)
          .setLngLat([establishment.longitude, establishment.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `<div style="padding: 4px 0">
                <strong>${establishment.name}</strong>
                <p style="margin:0;font-size:12px;color:#888">${establishment.offers[0]?.title ?? 'Offre Mapéro'}</p>
              </div>`,
            ),
          )
          .addTo(mapRef.current as mapboxgl.Map),
      );
    });

    if (establishments.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      establishments.forEach((establishment) => {
        bounds.extend([establishment.longitude, establishment.latitude]);
      });
      mapRef.current.fitBounds(bounds, { padding: 40, maxZoom: 15 });
    }
  }, [establishments]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl border border-white/10 text-sm text-text/60"
        style={{ height }}
      >
        Ajoutez un token Mapbox pour activer la carte interactive.
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="overflow-hidden rounded-3xl border border-white/10"
      style={{ height }}
    />
  );
}
