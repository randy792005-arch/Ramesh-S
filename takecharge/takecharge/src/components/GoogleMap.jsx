import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Minimal loader for Google Maps JS API
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));
    if (window.google && window.google.maps) return resolve(window.google.maps);

    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', () => reject(new Error('Failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', '1');
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
}

// Default center changed to Chennai, India
const GoogleMap = forwardRef(({ center = { lat: 13.0827, lng: 80.2707 }, zoom = 13, stations = [], onMarkerClick }, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useImperativeHandle(ref, () => ({
    panTo: (latLng) => {
      if (mapRef.current) mapRef.current.panTo(latLng);
    },
    setZoom: (z) => {
      if (mapRef.current) mapRef.current.setZoom(z);
    }
  }));

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return; // caller handles fallback

    let mounted = true;
    loadGoogleMaps(apiKey).then((maps) => {
      if (!mounted) return;
      mapRef.current = new maps.Map(containerRef.current, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: maps.ControlPosition.RIGHT_BOTTOM }
      });

      // initial markers
      markersRef.current = [];
      stations.forEach((s) => {
        const marker = new maps.Marker({
          position: { lat: s.latitude || s.lat || center.lat, lng: s.longitude || s.lng || center.lng },
          map: mapRef.current,
          title: s.name || s.stationName || '',
        });
        marker.addListener('click', () => onMarkerClick && onMarkerClick(s));
        markersRef.current.push(marker);
      });
    }).catch((err) => {
      console.warn('Google Maps load failed', err);
    });

    return () => { mounted = false; };
  }, []);

  // update markers when stations change
  useEffect(() => {
    const maps = window.google && window.google.maps;
    if (!maps || !mapRef.current) return;

    // clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    stations.forEach((s) => {
      const marker = new maps.Marker({
        position: { lat: s.latitude || s.lat || center.lat, lng: s.longitude || s.lng || center.lng },
        map: mapRef.current,
        title: s.name || s.stationName || '',
      });
      marker.addListener('click', () => onMarkerClick && onMarkerClick(s));
      markersRef.current.push(marker);
    });
  }, [stations]);

  // if no API key provided, caller should show fallback
  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }} />
  );
});

export default GoogleMap;
