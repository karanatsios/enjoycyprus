import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
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

const PLACE_ICONS: Record<string, string> = {
  sehenswuerdigkeit: '📍',
  strand: '🏖️',
  krankenhaus: '🏥',
  tourist_info: 'ℹ️',
};

const PLACE_COLORS: Record<string, string> = {
  sehenswuerdigkeit: '#E67E22',
  strand: '#27AE60',
  krankenhaus: '#E74C3C',
  tourist_info: '#8E44AD',
};

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

type Business = {
  id: string; company_name: string; category: string;
  city: string; phone: string; maps_link: string;
};

type Place = {
  id: string; name: string; type: string; description: string;
  lat: number; lng: number; address?: string; phone?: string;
  website?: string; rating_avg: number; rating_count: number;
};

type LayerFilter = 'businesses' | 'sehenswuerdigkeit' | 'strand' | 'krankenhaus' | 'tourist_info';

function buildLeafletHTML(
  businesses: Business[],
  places: Place[],
  activeLayers: LayerFilter[],
  userLat?: number,
  userLng?: number
): string {
  const cityMarkers = CITIES.map(c =>
    `L.marker([${c.lat}, ${c.lng}], {icon: cityIcon('${c.icon}')})
      .addTo(map).bindPopup('<b>${c.name}</b>');`
  ).join('\n');

  const bizMarkers = activeLayers.includes('businesses') ? businesses.map(b => {
    const coords = CITY_COORDS[b.city];
    if (!coords) return '';
    const [lat, lng] = coords;
    const jitter = (Math.random() - 0.5) * 0.02;
    const icon = CATEGORY_ICONS[b.category] ?? '📍';
    const mapsUrl = b.maps_link || `https://www.google.com/maps/search/${encodeURIComponent(b.company_name + ' ' + b.city)}`;
    return `L.marker([${lat + jitter}, ${lng + jitter}], {icon: bizIcon('${icon}', '#27AE60')})
      .addTo(map)
      .bindPopup('<b>${b.company_name.replace(/'/g, '&#39;')}</b><br>${b.city}<br><a href="${mapsUrl}" target="_blank">📍 Google Maps</a>${b.phone ? `<br><a href="tel:${b.phone}">📞 ${b.phone}</a>` : ''}<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=${lat + jitter},${lng + jitter}" target="_blank" style="background:#1565C0;color:#fff;padding:4px 10px;border-radius:6px;text-decoration:none;">🗺️ Route</a>');`;
  }).filter(Boolean).join('\n') : '';

  const placeMarkers = places.filter(p => activeLayers.includes(p.type as LayerFilter)).map(p => {
    const icon = PLACE_ICONS[p.type] ?? '📍';
    const color = PLACE_COLORS[p.type] ?? '#888';
    const stars = '⭐'.repeat(Math.round(p.rating_avg || 0));
    const ratingText = p.rating_count > 0 ? `${stars} ${p.rating_avg?.toFixed(1)} (${p.rating_count} Bewertungen)` : 'Noch keine Bewertungen';
    const desc = (p.description || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;').substring(0, 200);
    const phone = p.phone ? `<br>📞 <a href="tel:${p.phone}">${p.phone}</a>` : '';
    const address = p.address ? `<br>📍 ${p.address.replace(/'/g, '&#39;')}` : '';

    return `L.marker([${p.lat}, ${p.lng}], {icon: placeIcon('${icon}', '${color}')})
      .addTo(map)
      .bindPopup(\`<div style="min-width:220px;font-family:sans-serif">
        <div style="font-size:15px;font-weight:800;color:#1A1A2E;margin-bottom:4px">${icon} ${p.name.replace(/`/g, "'")}</div>
        <div style="font-size:11px;color:${color};font-weight:700;margin-bottom:6px;text-transform:uppercase">${p.type.replace('sehenswuerdigkeit','Sehenswürdigkeit').replace('strand','Strand').replace('krankenhaus','Krankenhaus').replace('tourist_info','Tourist Info')}</div>
        <div style="font-size:12px;color:#444;line-height:1.5;margin-bottom:6px">${desc}</div>
        <div style="font-size:12px;color:#888;margin-bottom:6px">${ratingText}</div>
        ${address}${phone}
        <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
          <button onclick="speakText('${p.name.replace(/'/g, '')}. ${desc.replace(/'/g, '')}')" style="background:#0077B6;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px">🔊 Vorlesen</button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" style="background:#27AE60;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:12px">🗺️ Route</a>
          <a href="#" onclick="openReview('${p.id}','${p.name.replace(/'/g, '')}');return false;" style="background:#E67E22;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:12px">⭐ Bewerten</button>
        </div>
      </div>\`);`;
  }).join('\n');

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
  .place-icon{font-size:20px;background:#fff;border-radius:50%;padding:5px;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;}
  .user-icon{font-size:24px;}
  .leaflet-popup-content{margin:10px 14px;}
  #review-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;}
  #review-box{background:#fff;border-radius:16px;padding:24px;max-width:320px;width:90%;font-family:sans-serif;}
  .star-btn{font-size:28px;cursor:pointer;background:none;border:none;padding:2px;}
</style>
</head>
<body>
<div id="map"></div>

<!-- Bewertungs-Modal -->
<div id="review-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;">
  <div id="review-box" style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:90%;margin:auto;margin-top:80px;font-family:sans-serif;">
    <div style="font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:4px" id="review-title"></div>
    <div style="font-size:12px;color:#888;margin-bottom:12px">Ihre Bewertung hilft anderen Reisenden!</div>
    <div id="stars" style="display:flex;gap:4px;margin-bottom:12px">
      <button class="star-btn" onclick="setStar(1)">☆</button>
      <button class="star-btn" onclick="setStar(2)">☆</button>
      <button class="star-btn" onclick="setStar(3)">☆</button>
      <button class="star-btn" onclick="setStar(4)">☆</button>
      <button class="star-btn" onclick="setStar(5)">☆</button>
    </div>
    <textarea id="review-comment" placeholder="Ihr Kommentar (optional)..." style="width:100%;border:1.5px solid #E0E0E8;border-radius:10px;padding:10px;font-size:13px;resize:none;height:80px;box-sizing:border-box;margin-bottom:12px"></textarea>
    <input id="review-name" placeholder="Ihr Name (optional)" style="width:100%;border:1.5px solid #E0E0E8;border-radius:10px;padding:10px;font-size:13px;box-sizing:border-box;margin-bottom:12px"/>
    <div style="display:flex;gap:8px">
      <button onclick="submitReview()" style="flex:1;background:#0077B6;color:#fff;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer">⭐ Absenden</button>
      <button onclick="closeReview()" style="background:#F0F4FA;color:#666;border:none;border-radius:10px;padding:12px;font-size:14px;cursor:pointer">✕</button>
    </div>
    <div id="review-msg" style="margin-top:8px;font-size:12px;text-align:center"></div>
  </div>
</div>

<script>
  var map = L.map('map', {zoomControl:true}).setView([34.9, 33.1], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© OpenStreetMap', maxZoom:18
  }).addTo(map);

  function cityIcon(e){
    return L.divIcon({className:'',html:'<div class="city-icon">'+e+'</div>',iconSize:[36,36],iconAnchor:[18,18]});
  }
  function bizIcon(e, color){
    return L.divIcon({className:'',html:'<div class="biz-icon" style="border-color:'+color+'">'+e+'</div>',iconSize:[30,30],iconAnchor:[15,15]});
  }
  function placeIcon(e, color){
    return L.divIcon({className:'',html:'<div class="place-icon" style="border:2.5px solid '+color+'">'+e+'</div>',iconSize:[34,34],iconAnchor:[17,17]});
  }
  function userIcon(){
    return L.divIcon({className:'',html:'<div class="user-icon">🔵</div>',iconSize:[30,30],iconAnchor:[15,15]});
  }

  // Sprachausgabe
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }

  // Bewertungs-Modal
  var currentPlaceId = '';
  var currentStar = 0;
  function openReview(id, name) {
    currentPlaceId = id;
    currentStar = 0;
    document.getElementById('review-title').textContent = '⭐ ' + name + ' bewerten';
    document.getElementById('review-comment').value = '';
    document.getElementById('review-name').value = '';
    document.getElementById('review-msg').textContent = '';
    updateStars(0);
    document.getElementById('review-modal').style.display = 'flex';
  }
  function closeReview() {
    document.getElementById('review-modal').style.display = 'none';
  }
  function setStar(n) {
    currentStar = n;
    updateStars(n);
  }
  function updateStars(n) {
    var btns = document.getElementById('stars').querySelectorAll('button');
    btns.forEach(function(b, i) { b.textContent = i < n ? '⭐' : '☆'; });
  }
  async function submitReview() {
    if (!currentStar) { document.getElementById('review-msg').textContent = 'Bitte wählen Sie eine Bewertung.'; return; }
    var comment = document.getElementById('review-comment').value;
    var name = document.getElementById('review-name').value || 'Anonym';
    var msg = document.getElementById('review-msg');
    msg.textContent = 'Wird gespeichert...';
    try {
      var res = await fetch('https://jewactcyhvzrceoiajau.supabase.co/rest/v1/place_reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB',
          'Authorization': 'Bearer sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ place_id: currentPlaceId, rating: currentStar, comment: comment, author_name: name })
      });
      if (res.ok) {
        msg.style.color = '#27AE60';
        msg.textContent = '✅ Vielen Dank für Ihre Bewertung!';
        setTimeout(closeReview, 1500);
      } else {
        msg.style.color = '#E74C3C';
        msg.textContent = 'Fehler beim Speichern.';
      }
    } catch(e) {
      msg.style.color = '#E74C3C';
      msg.textContent = 'Netzwerkfehler.';
    }
  }

  ${cityMarkers}
  ${bizMarkers}
  ${placeMarkers}
  ${userMarker}

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

const LAYER_FILTERS: { id: LayerFilter; label: string; color: string }[] = [
  { id: 'businesses',       label: '🏢 Unternehmen', color: '#27AE60' },
  { id: 'sehenswuerdigkeit', label: '📍 Sehensw.',   color: '#E67E22' },
  { id: 'strand',           label: '🏖️ Strände',     color: '#0077B6' },
  { id: 'krankenhaus',      label: '🏥 Krankenh.',   color: '#E74C3C' },
  { id: 'tourist_info',     label: 'ℹ️ Tourist Info', color: '#8E44AD' },
];

export default function MapScreen() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeLayers, setActiveLayers] = useState<LayerFilter[]>(['businesses', 'sehenswuerdigkeit', 'strand', 'krankenhaus', 'tourist_info']);

  useEffect(() => {
    fetchData();
    getLocation();
  }, []);

  const fetchData = async () => {
    const [bizRes, placesRes] = await Promise.all([
      supabase.from('businesses').select('id,company_name,category,city,phone,maps_link').eq('status', 'approved'),
      supabase.from('places').select('*'),
    ]);
    if (bizRes.data) setBusinesses(bizRes.data);
    if (placesRes.data) setPlaces(placesRes.data);
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

  const toggleLayer = (id: LayerFilter) => {
    setActiveLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const mapHTML = useMemo(
    () => buildLeafletHTML(businesses, places, activeLayers, userLat, userLng),
    [businesses, places, activeLayers, userLat, userLng]
  );

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />
      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>🗺️ Karte</Text>
          <View style={{ minWidth: 70 }} />
        </View>
      </View>

      {/* Layer-Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterRow}>
        {LAYER_FILTERS.map(f => {
          const active = activeLayers.includes(f.id);
          return (
            <TouchableOpacity
              key={f.id}
              style={[s.filterChip, active && { backgroundColor: f.color, borderColor: f.color }]}
              onPress={() => toggleLayer(f.id)}
            >
              <Text style={[s.filterChipText, active && s.filterChipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
        <View style={s.legendItem}><Text style={s.legendDot}>🔵</Text><Text style={s.legendText}>Standort</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>📍</Text><Text style={s.legendText}>Sehensw.</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>🏖️</Text><Text style={s.legendText}>Strände</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>🏥</Text><Text style={s.legendText}>Krankenh.</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>ℹ️</Text><Text style={s.legendText}>Tourist Info</Text></View>
        <View style={s.legendItem}><Text style={s.legendDot}>⭐</Text><Text style={s.legendText}>Bewerten</Text></View>
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
  filterScroll: { flexGrow: 0, marginTop: 8 },
  filterRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#555' },
  filterChipTextActive: { color: '#fff' },
});
