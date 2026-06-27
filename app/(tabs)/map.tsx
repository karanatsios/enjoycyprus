import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

const CITIES = [
  { name: 'Nikosia', lat: 35.1667, lng: 33.3667, icon: '🏛️' },
  { name: 'Limassol', lat: 34.6833, lng: 33.0333, icon: '🌊' },
  { name: 'Larnaka', lat: 34.9167, lng: 33.6333, icon: '✈️' },
  { name: 'Paphos', lat: 34.7667, lng: 32.4167, icon: '🏖️' },
  { name: 'Ayia Napa', lat: 34.9833, lng: 34.0, icon: '🎶' },
  { name: 'Kyrenia', lat: 35.3417, lng: 33.3192, icon: '⚓' },
  { name: 'Famagusta', lat: 35.1167, lng: 33.9500, icon: '🏰' },
];

const CATEGORY_ICONS: Record<string, string> = {
  handwerk: '🔨', gastronomie: '🍽️', medizin: '⚕️', immobilien: '🏠',
  finanzen: '⚖️', shopping: '🛍️', beauty: '💆', dienstleistung: '🛠️',
  mobilitaet: '🚗', tourismus: '🏖️', auswandern: '✈️',
};

type Business = {
  id: string; company_name: string; category: string;
  city: string; phone: string; maps_link: string;
  lat?: number; lng?: number;
};

// Approximate city coords for businesses without GPS
const CITY_COORDS: Record<string, [number, number]> = {
  'Limassol': [34.6833, 33.0333],
  'Nikosia / Nicosia': [35.1667, 33.3667],
  'Larnaka / Larnaca': [34.9167, 33.6333],
  'Paphos': [34.7667, 32.4167],
  'Ayia Napa': [34.9833, 34.0],
  'Protaras': [35.0167, 34.0500],
  'Paralimni': [35.0333, 33.9833],
  'Kyrenia / Girne': [35.3417, 33.3192],
  'Nikosia Nord / Lefkoşa': [35.1833, 33.3667],
  'Famagusta Nord / Gazimağusa': [35.1167, 33.9500],
  'Famagusta Süd': [35.1167, 33.9500],
  'Morphou / Güzelyurt': [35.2000, 32.9833],
};

function buildLeafletHTML(businesses: Business[], userLat?: number, userLng?: number): string {
  const cityMarkers = CITIES.map(c =>
    `L.marker([${c.lat}, ${c.lng}], {icon: cityIcon('${c.icon}')})
      .addTo(map)
      .bindPopup('<b>${c.name}</b>');`
  ).join('\n');

  const bizMarkers = businesses.map(b => {
    const coords = CITY_COORDS[b.city];
    if (!coords) return '';
    const [lat, lng] = coords;
    const jitter = (Math.random() - 0.5) * 0.02;
    const icon = CATEGORY_ICONS[b.category] ?? '📍';
    const mapsUrl = b.maps_link || `https://www.google.com/maps/search/${encodeURIComponent(b.company_name + ' ' + b.city)}`;
    return `L.marker([${lat + jitter}, ${lng + jitter}], {icon: bizIcon('${icon}')})
      .addTo(map)
      .bindPopup('<b>${b.company_name.replace(/'/g, '&#39;')}</b><br>${b.city}<br><a href="${mapsUrl}" target="_blank">📍 Google Maps</a>${b.phone ? `<br><a href="tel:${b.phone}">📞 ${b.phone}</a>` : ''}<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=${lat + jitter},${lng + jitter}" target="_blank" style="background:#1565C0;color:#fff;padding:4px 10px;border-radius:6px;text-decoration:none;">🗺️ Route</a>');`;
  }).filter(Boolean).join('\n');

  const userMarker = (userLat && userLng)
    ? `L.marker([${userLat}, ${userLng}], {icon: userIcon()}).addTo(map).bindPopup('<b>📍 Mein Standort</b>').openPopup();`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%;}
  .city-icon{font-size:22px;background:#fff;border-radius:50%;padding:4px;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid #1565C0;display:flex;align-items:center;justify-content:center;}
  .biz-icon{font-size:18px;background:#fff;border-radius:8px;padding:3px;box-shadow:0 2px 6px rgba(0,0,0,0.15);border:2px solid #27AE60;}
  .user-icon{font-size:24px;}
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {zoomControl:true}).setView([34.9, 33.1], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© OpenStreetMap', maxZoom:18
  }).addTo(map);

  function cityIcon(e){
    return L.divIcon({className:'',html:'<div class="city-icon">'+e+'</div>',iconSize:[36,36],iconAnchor:[18,18]});
  }
  function bizIcon(e){
    return L.divIcon({className:'',html:'<div class="biz-icon">'+e+'</div>',iconSize:[30,30],iconAnchor:[15,15]});
  }
  function userIcon(){
    return L.divIcon({className:'',html:'<div class="user-icon">🔵</div>',iconSize:[30,30],iconAnchor:[15,15]});
  }

  ${cityMarkers}
  ${bizMarkers}
  ${userMarker}

  // Klick auf Karte → Route zu Google Maps
  map.on('click', function(e){
    var lat = e.latlng.lat.toFixed(6), lng = e.latlng.lng.toFixed(6);
    var url = 'https://www.google.com/maps/dir/?api=1&destination='+lat+','+lng;
    var popup = L.popup().setLatLng(e.latlng)
      .setContent('<a href="'+url+'" target="_blank" style="background:#1565C0;color:#fff;padding:6px 14px;border-radius:8px;text-decoration:none;font-weight:700;">🗺️ Route hierher</a>')
      .openOn(map);
  });
</script>
</body>
</html>`;
}

export default function MapScreen() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    getLocation();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('businesses').select('id,company_name,category,city,phone,maps_link').eq('status', 'approved');
    if (data) setBusinesses(data);
    setLoading(false);
  };

  const getLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
        () => null
      );
    }
  };

  const mapHTML = buildLeafletHTML(businesses, userLat, userLng);

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />
      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>Karte</Text>
          <View style={{ minWidth: 70 }} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <View style={s.mapWrap}>
          {Platform.OS === 'web' ? (
            // @ts-ignore
            <iframe
              srcDoc={mapHTML}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Karte"
            />
          ) : (
            <View style={s.fallback}>
              <Text style={s.fallbackText}>🗺️ Karte nur in der Web-Version verfügbar.</Text>
            </View>
          )}
        </View>
      )}

      {/* Legende */}
      <View style={s.legend}>
        <View style={s.legendItem}><Text style={s.legendDot}>🔵</Text><Text style={s.legendText}>Mein Standort</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>🏛️</Text><Text style={s.legendText}>Städte</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>📍</Text><Text style={s.legendText}>Unternehmen</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>🗺️</Text><Text style={s.legendText}>Route tippen</Text></View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },
  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 16, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  mapWrap: { flex: 1, margin: 12, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: '#D0D8E8' },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fallbackText: { fontSize: 15, color: '#888' },
  legend: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  legendItem: { alignItems: 'center', gap: 2 },
  legendDot: { fontSize: 16 },
  legendText: { fontSize: 9, color: '#888', fontWeight: '600' },
});
