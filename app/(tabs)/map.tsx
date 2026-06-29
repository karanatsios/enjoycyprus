import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

/* ─── Statische Orte (Fallback wenn DB noch nicht befüllt) ─── */
const STATIC_PLACES = [
  // Sehenswürdigkeiten
  { id: 's1', name: 'Aphrodite Felsen (Petra tou Romiou)', type: 'sehenswuerdigkeit', description: 'Der Geburtsort der Göttin Aphrodite – einer der bekanntesten Orte Zyperns. Spektakuläre Felsformation am Meer, bei Sonnenuntergang besonders schön.', lat: 34.6133, lng: 32.5019, rating_avg: 0, rating_count: 0 },
  { id: 's2', name: 'Kolossi Burg', type: 'sehenswuerdigkeit', description: 'Mittelalterliche Burg aus dem 13. Jahrhundert, einst Hauptquartier der Kreuzritter.', lat: 34.6678, lng: 32.9231, rating_avg: 0, rating_count: 0 },
  { id: 's3', name: 'Kourion Amphitheater', type: 'sehenswuerdigkeit', description: 'Beeindruckendes griechisch-römisches Amphitheater mit Blick auf das Meer.', lat: 34.6606, lng: 32.8878, rating_avg: 0, rating_count: 0 },
  { id: 's4', name: 'Kyrenia Burg', type: 'sehenswuerdigkeit', description: 'Byzantinische Burg aus dem 7. Jahrhundert am Hafen von Kyrenia. Beherbergt das berühmte Schiffswrack-Museum.', lat: 35.3411, lng: 33.3178, rating_avg: 0, rating_count: 0 },
  { id: 's5', name: 'Bellapais Kloster', type: 'sehenswuerdigkeit', description: 'Gotisches Kloster aus dem 13. Jahrhundert mit atemberaubendem Blick über das Kyrenia-Gebirge.', lat: 35.3106, lng: 33.3461, rating_avg: 0, rating_count: 0 },
  { id: 's6', name: 'Famagusta Altstadt', type: 'sehenswuerdigkeit', description: 'Mittelalterliche Stadtmauern und die Katharinenkathedrale (heute Lala Mustafa Moschee).', lat: 35.1247, lng: 33.9422, rating_avg: 0, rating_count: 0 },
  { id: 's7', name: 'Akamas Halbinsel', type: 'sehenswuerdigkeit', description: 'Unberührte Naturlandschaft im Nordwesten Zyperns. Wanderwege, Schildkröten-Nistplätze und das Aphrodite-Bad.', lat: 35.0833, lng: 32.3167, rating_avg: 0, rating_count: 0 },
  { id: 's8', name: 'Tombs of the Kings', type: 'sehenswuerdigkeit', description: 'Eindrucksvolles unterirdisches Nekropolis aus dem 4. Jahrhundert v. Chr. UNESCO-Weltkulturerbe in Paphos.', lat: 34.7764, lng: 32.3947, rating_avg: 0, rating_count: 0 },
  { id: 's9', name: 'Paphos Mosaiken', type: 'sehenswuerdigkeit', description: 'Weltberühmte römische Bodenmosaiken aus dem 3./4. Jahrhundert n. Chr. UNESCO-Weltkulturerbe.', lat: 34.7569, lng: 32.4081, rating_avg: 0, rating_count: 0 },
  { id: 's10', name: 'Cape Greco', type: 'sehenswuerdigkeit', description: 'Atemberaubendes Kap im Südosten Zyperns mit kristallklarem Wasser und Meereshöhlen.', lat: 34.9583, lng: 34.0786, rating_avg: 0, rating_count: 0 },
  { id: 's11', name: 'Kykkos Kloster', type: 'sehenswuerdigkeit', description: 'Das reichste und bekannteste Kloster Zyperns, tief im Troodos-Gebirge.', lat: 34.9844, lng: 32.7397, rating_avg: 0, rating_count: 0 },
  { id: 's12', name: 'Troodos Gebirge', type: 'sehenswuerdigkeit', description: 'Das höchste Gebirge Zyperns mit dem Gipfel Olympos (1952m). Wanderwege und im Winter Skifahren.', lat: 34.9167, lng: 32.8667, rating_avg: 0, rating_count: 0 },
  { id: 's13', name: 'Hala Sultan Tekke', type: 'sehenswuerdigkeit', description: 'Muslimisches Heiligtum am Salzsee von Larnaka, eines der wichtigsten islamischen Pilgerziele.', lat: 34.8769, lng: 33.6094, rating_avg: 0, rating_count: 0 },
  { id: 's14', name: 'Lefkara Dorf', type: 'sehenswuerdigkeit', description: 'Malerisches Bergdorf bekannt für seine Spitzenklöppelei (Lefkaritika) und Silberschmiedekunst. UNESCO-Kulturerbe.', lat: 34.8667, lng: 33.3167, rating_avg: 0, rating_count: 0 },
  { id: 's15', name: 'Nikosia Altstadt & Ledra Street', type: 'sehenswuerdigkeit', description: 'Das Herz der geteilten Hauptstadt Zyperns. Venezianische Stadtmauern und der einzige Grenzübergang in einer Hauptstadt der Welt.', lat: 35.1725, lng: 33.3617, rating_avg: 0, rating_count: 0 },
  // Strände
  { id: 'b1', name: 'Nissi Beach', type: 'strand', description: 'Einer der beliebtesten Strände Zyperns in Ayia Napa. Weißer Sand, türkisblaues Wasser. Blaue Flagge zertifiziert.', lat: 34.9889, lng: 34.0019, rating_avg: 0, rating_count: 0 },
  { id: 'b2', name: 'Fig Tree Bay', type: 'strand', description: 'Schöner Sandstrand in Protaras mit ruhigem, flachem Wasser – ideal für Familien. Blaue Flagge zertifiziert.', lat: 35.0125, lng: 34.0572, rating_avg: 0, rating_count: 0 },
  { id: 'b3', name: 'Coral Bay', type: 'strand', description: 'Beliebter Sandstrand nördlich von Paphos mit vielen Wassersportmöglichkeiten.', lat: 34.8356, lng: 32.3700, rating_avg: 0, rating_count: 0 },
  { id: 'b4', name: 'Kourion Beach', type: 'strand', description: 'Wilder, unberührter Kiesstrand unter den Klippen des antiken Kourion. Ideal zum Schnorcheln.', lat: 34.6519, lng: 32.8744, rating_avg: 0, rating_count: 0 },
  { id: 'b5', name: "Lady's Mile Beach", type: 'strand', description: 'Langer, ruhiger Strand westlich von Limassol. Naturbelassen. Beliebter Kite-Surf-Spot.', lat: 34.6456, lng: 33.0017, rating_avg: 0, rating_count: 0 },
  { id: 'b6', name: 'Mackenzie Beach', type: 'strand', description: 'Urbaner Strand in Larnaka direkt neben dem Flughafen. Lebhafte Atmosphäre, viele Bars.', lat: 34.8689, lng: 33.6336, rating_avg: 0, rating_count: 0 },
  { id: 'b7', name: 'Lara Beach', type: 'strand', description: 'Abgelegener, unberührter Strand auf der Akamas-Halbinsel. Wichtiger Nistplatz für Caretta-Caretta-Schildkröten.', lat: 35.0544, lng: 32.3125, rating_avg: 0, rating_count: 0 },
  { id: 'b8', name: "Governor's Beach", type: 'strand', description: 'Einzigartiger Strand mit weißen Klippen und schwarzem Kieselstrand östlich von Limassol.', lat: 34.7186, lng: 33.2683, rating_avg: 0, rating_count: 0 },
  // Krankenhäuser
  { id: 'k1', name: 'Limassol General Hospital', type: 'krankenhaus', description: 'Staatliches Allgemeinkrankenhaus Limassol. Notaufnahme 24/7.', lat: 34.7058, lng: 33.0361, address: 'Nikiforou Foka, Limassol', phone: '+357 25 801100', rating_avg: 0, rating_count: 0 },
  { id: 'k2', name: 'Nikosia General Hospital', type: 'krankenhaus', description: 'Größtes staatliches Krankenhaus Zyperns. Alle Fachabteilungen. Notaufnahme rund um die Uhr.', lat: 35.1500, lng: 33.3667, address: 'Athalassas Avenue, Nikosia', phone: '+357 22 603000', rating_avg: 0, rating_count: 0 },
  { id: 'k3', name: 'Larnaka General Hospital', type: 'krankenhaus', description: 'Staatliches Krankenhaus Larnaka mit Notaufnahme und allen wichtigen Fachabteilungen.', lat: 34.9050, lng: 33.6439, address: 'Grigori Afxentiou, Larnaka', phone: '+357 24 800500', rating_avg: 0, rating_count: 0 },
  { id: 'k4', name: 'Paphos General Hospital', type: 'krankenhaus', description: 'Staatliches Krankenhaus Paphos. Notaufnahme 24h. Wichtigste medizinische Versorgung im Westen.', lat: 34.7744, lng: 32.4197, address: 'Neofytou Nikolaidi, Paphos', phone: '+357 26 803100', rating_avg: 0, rating_count: 0 },
  { id: 'k5', name: 'Near East University Hospital', type: 'krankenhaus', description: 'Modernes Universitätskrankenhaus in Nordzypern. Alle Fachabteilungen, Notaufnahme 24/7.', lat: 35.2028, lng: 33.3678, phone: '+90 392 675 1000', rating_avg: 0, rating_count: 0 },
  // Tourist Info
  { id: 't1', name: 'Tourist Info – Larnaka Flughafen', type: 'tourist_info', description: 'Offizielle Touristeninformation direkt im Ankunftsbereich des Flughafens. Karten, Broschüren, Hotelhilfe.', lat: 34.8753, lng: 33.6253, phone: '+357 24 643576', rating_avg: 0, rating_count: 0 },
  { id: 't2', name: 'Tourist Info – Paphos', type: 'tourist_info', description: 'Zentrale Touristeninformation Paphos. Ausflugstipps, Karten, Veranstaltungskalender.', lat: 34.7731, lng: 32.4242, phone: '+357 26 932841', rating_avg: 0, rating_count: 0 },
  { id: 't3', name: 'Tourist Info – Limassol', type: 'tourist_info', description: 'Touristeninformation im Stadtzentrum Limassol. Stadtführungen, Events, Ausflüge.', lat: 34.6769, lng: 33.0444, phone: '+357 25 362756', rating_avg: 0, rating_count: 0 },
  { id: 't4', name: 'Tourist Info – Nikosia', type: 'tourist_info', description: 'Touristeninformation in der Altstadt Nikosia. Stadtplan, Sehenswürdigkeiten, geführte Touren.', lat: 35.1719, lng: 33.3642, phone: '+357 22 674264', rating_avg: 0, rating_count: 0 },
  { id: 't5', name: 'Tourist Info – Ayia Napa', type: 'tourist_info', description: 'Touristeninformation im Zentrum von Ayia Napa. Nachtleben, Ausflüge, Strände.', lat: 34.9844, lng: 34.0022, phone: '+357 23 721796', rating_avg: 0, rating_count: 0 },
];

/* ─── Typen ─── */
type Place = {
  id: string; name: string; type: string; description: string;
  lat: number; lng: number; address?: string; phone?: string;
  rating_avg: number; rating_count: number;
};
type Business = { id: string; company_name: string; category: string; city: string; phone: string; maps_link: string };
type LayerFilter = 'sehenswuerdigkeit' | 'strand' | 'krankenhaus' | 'tourist_info' | 'businesses';

/* ─── Konstanten ─── */
const LAYER_META: { id: LayerFilter; label: string; icon: string; color: string }[] = [
  { id: 'sehenswuerdigkeit', label: 'Sehenswürdigkeiten', icon: '📍', color: '#E67E22' },
  { id: 'strand',            label: 'Strände',            icon: '🏖️', color: '#0077B6' },
  { id: 'krankenhaus',       label: 'Krankenhäuser',      icon: '🏥', color: '#E74C3C' },
  { id: 'tourist_info',      label: 'Tourist Info',        icon: 'ℹ️', color: '#8E44AD' },
  { id: 'businesses',        label: 'Unternehmen',         icon: '🏢', color: '#27AE60' },
];

const CATEGORY_ICONS: Record<string, string> = {
  handwerk:'🔨',gastronomie:'🍽️',medizin:'⚕️',immobilien:'🏠',
  finanzen:'⚖️',shopping:'🛍️',beauty:'💆',dienstleistung:'🛠️',
  mobilitaet:'🚗',tourismus:'🌴',auswandern:'✈️',
};
const CITY_COORDS: Record<string, [number,number]> = {
  'Limassol':[34.6833,33.0333],'Nikosia / Nicosia':[35.1667,33.3667],
  'Larnaka / Larnaca':[34.9167,33.6333],'Paphos':[34.7667,32.4167],
  'Ayia Napa':[34.9833,34.0],'Protaras':[35.0167,34.05],
  'Kyrenia / Girne':[35.3417,33.3192],'Nikosia Nord / Lefkoşa':[35.1833,33.3667],
  'Famagusta Nord / Gazimağusa':[35.1167,33.95],
};

/* ─── Leaflet HTML ─── */
function buildLeafletHTML(
  businesses: Business[],
  places: Place[],
  activeLayers: LayerFilter[],
  userLat?: number,
  userLng?: number,
): string {
  const layerColors: Record<string, string> = {
    sehenswuerdigkeit: '#E67E22', strand: '#0077B6',
    krankenhaus: '#E74C3C', tourist_info: '#8E44AD',
  };
  const layerIcons: Record<string, string> = {
    sehenswuerdigkeit: '📍', strand: '🏖️', krankenhaus: '🏥', tourist_info: 'ℹ️',
  };
  const typeLabel: Record<string, string> = {
    sehenswuerdigkeit: 'Sehenswürdigkeit', strand: 'Strand',
    krankenhaus: 'Krankenhaus', tourist_info: 'Tourist Info',
  };

  const placeMarkersJS = places
    .filter(p => activeLayers.includes(p.type as LayerFilter))
    .map(p => {
      const color = layerColors[p.type] ?? '#888';
      const icon  = layerIcons[p.type]  ?? '📍';
      const label = typeLabel[p.type]   ?? p.type;
      const desc  = (p.description ?? '').replace(/\\/g,'\\\\').replace(/`/g,"'").replace(/'/g,"\\'");
      const name  = p.name.replace(/\\/g,'\\\\').replace(/`/g,"'").replace(/'/g,"\\'");
      const addrLine = p.address ? `<br><span style='color:#666'>📍 ${p.address.replace(/'/g,"&#39;")}</span>` : '';
      const phoneLine = p.phone ? `<br><a href='tel:${p.phone}' style='color:#0077B6'>📞 ${p.phone}</a>` : '';
      const stars = p.rating_count > 0
        ? `${'⭐'.repeat(Math.round(p.rating_avg))} ${(+p.rating_avg).toFixed(1)} (${p.rating_count})`
        : 'Noch keine Bewertungen';
      return `
        L.marker([${p.lat},${p.lng}], {
          icon: L.divIcon({
            className:'',
            html:'<div style="background:${color};color:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:3px solid #fff;">${icon}</div>',
            iconSize:[40,40], iconAnchor:[20,20], popupAnchor:[0,-22]
          })
        }).addTo(map)
        .bindPopup(\`<div style="min-width:230px;font-family:sans-serif;line-height:1.5">
          <div style="font-weight:800;font-size:14px;color:#1A1A2E;margin-bottom:2px">${icon} \${escHtml('${name}')}</div>
          <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;margin-bottom:6px">${label}</div>
          <div style="font-size:12px;color:#444;margin-bottom:6px">\${escHtml('${desc}').substring(0,160)}…</div>
          <div style="font-size:11px;color:#888;margin-bottom:6px">${stars}</div>
          ${addrLine}${phoneLine}
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
            <button onclick="speakText('${name}. ${desc}'.substring(0,200))" style="background:#0077B6;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">🔊 Vorlesen</button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" style="background:#27AE60;color:#fff;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">🗺️ Route</a>
            <button onclick="openReview('${p.id}','${name}')" style="background:#E67E22;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">⭐ Bewerten</button>
          </div>
        </div>\`, {maxWidth:280});`;
    }).join('\n');

  const bizMarkersJS = activeLayers.includes('businesses') ? businesses.map(b => {
    const coords = CITY_COORDS[b.city];
    if (!coords) return '';
    const [lat,lng] = coords;
    const jlat = lat + (Math.random()-0.5)*0.02;
    const jlng = lng + (Math.random()-0.5)*0.02;
    const icon = CATEGORY_ICONS[b.category] ?? '🏢';
    return `L.marker([${jlat},${jlng}],{icon:L.divIcon({className:'',html:'<div style="background:#27AE60;color:#fff;border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #fff;">${icon}</div>',iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-18]})}).addTo(map).bindPopup('<b>${b.company_name.replace(/'/g,"&#39;")}</b><br>${b.city}${b.phone ? `<br><a href="tel:${b.phone}">📞 ${b.phone}</a>` : ''}<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=${jlat},${jlng}" target="_blank" style="background:#1565C0;color:#fff;padding:4px 10px;border-radius:6px;text-decoration:none">🗺️ Route</a>',{maxWidth:260});`;
  }).filter(Boolean).join('\n') : '';

  const userMarkerJS = (userLat && userLng)
    ? `L.marker([${userLat},${userLng}],{icon:L.divIcon({className:'',html:'<div style="background:#1565C0;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 10px rgba(0,0,0,0.4);border:3px solid #fff;">🔵</div>',iconSize:[36,36],iconAnchor:[18,18]})}).addTo(map).bindPopup('<b>📍 Mein Standort</b>').openPopup();`
    : '';

  const centerLat = userLat ?? 34.9;
  const centerLng = userLng ?? 33.1;
  const zoom      = userLat ? 11 : 9;

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%;}
  .leaflet-popup-content{margin:12px 14px;}
  #review-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9999;align-items:center;justify-content:center;}
  #review-box{background:#fff;border-radius:20px;padding:24px;max-width:320px;width:92%;font-family:sans-serif;}
  .star-btn{font-size:30px;cursor:pointer;background:none;border:none;padding:2px 4px;}
</style>
</head><body>
<div id="map"></div>
<div id="review-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9999;">
  <div id="review-box" style="background:#fff;border-radius:20px;padding:24px;max-width:320px;width:92%;margin:auto;margin-top:60px;font-family:sans-serif;">
    <div id="review-title" style="font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:4px"></div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Ihre Bewertung hilft anderen Reisenden!</div>
    <div id="stars" style="display:flex;gap:2px;margin-bottom:14px">
      <button class="star-btn" onclick="setStar(1)">☆</button>
      <button class="star-btn" onclick="setStar(2)">☆</button>
      <button class="star-btn" onclick="setStar(3)">☆</button>
      <button class="star-btn" onclick="setStar(4)">☆</button>
      <button class="star-btn" onclick="setStar(5)">☆</button>
    </div>
    <textarea id="review-comment" placeholder="Ihr Kommentar (optional)..." style="width:100%;border:1.5px solid #E0E0E8;border-radius:12px;padding:10px;font-size:13px;resize:none;height:80px;box-sizing:border-box;margin-bottom:10px"></textarea>
    <input id="review-name" placeholder="Ihr Name (optional)" style="width:100%;border:1.5px solid #E0E0E8;border-radius:12px;padding:10px;font-size:13px;box-sizing:border-box;margin-bottom:14px"/>
    <div style="display:flex;gap:8px">
      <button onclick="submitReview()" style="flex:1;background:#0077B6;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer">⭐ Absenden</button>
      <button onclick="closeReview()" style="background:#F0F4FA;color:#666;border:none;border-radius:12px;padding:13px;font-size:14px;cursor:pointer">✕</button>
    </div>
    <div id="review-msg" style="margin-top:10px;font-size:12px;text-align:center"></div>
  </div>
</div>
<script>
  function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  var map = L.map('map',{zoomControl:true}).setView([${centerLat},${centerLng}],${zoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:19}).addTo(map);

  function speakText(text){
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);
    u.lang='de-DE'; u.rate=0.9;
    window.speechSynthesis.speak(u);
  }

  var currentPlaceId='', currentStar=0;
  function openReview(id,name){
    currentPlaceId=id; currentStar=0;
    document.getElementById('review-title').textContent='⭐ '+name+' bewerten';
    document.getElementById('review-comment').value='';
    document.getElementById('review-name').value='';
    document.getElementById('review-msg').textContent='';
    updateStars(0);
    document.getElementById('review-modal').style.display='flex';
  }
  function closeReview(){document.getElementById('review-modal').style.display='none';}
  function setStar(n){currentStar=n;updateStars(n);}
  function updateStars(n){
    document.getElementById('stars').querySelectorAll('button').forEach(function(b,i){b.textContent=i<n?'⭐':'☆';});
  }
  async function submitReview(){
    if(!currentStar){document.getElementById('review-msg').textContent='Bitte Sterne wählen.';return;}
    var msg=document.getElementById('review-msg');
    msg.style.color='#888'; msg.textContent='Wird gespeichert…';
    try{
      var res=await fetch('https://jewactcyhvzrceoiajau.supabase.co/rest/v1/place_reviews',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':'sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB','Authorization':'Bearer sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB','Prefer':'return=minimal'},
        body:JSON.stringify({place_id:currentPlaceId,rating:currentStar,comment:document.getElementById('review-comment').value,author_name:document.getElementById('review-name').value||'Anonym'})
      });
      if(res.ok){msg.style.color='#27AE60';msg.textContent='✅ Vielen Dank!';setTimeout(closeReview,1500);}
      else{msg.style.color='#E74C3C';msg.textContent='Fehler beim Speichern.';}
    }catch(e){msg.style.color='#E74C3C';msg.textContent='Netzwerkfehler.';}
  }

  ${placeMarkersJS}
  ${bizMarkersJS}
  ${userMarkerJS}

  map.on('click',function(e){
    var lat=e.latlng.lat.toFixed(6),lng=e.latlng.lng.toFixed(6);
    L.popup().setLatLng(e.latlng)
      .setContent('<a href="https://www.google.com/maps/dir/?api=1&destination='+lat+','+lng+'" target="_blank" style="background:#1565C0;color:#fff;padding:7px 16px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block">🗺️ Route hierher</a>')
      .openOn(map);
  });

  // Nachricht nach außen wenn Marker geklickt (für Panel)
  map.on('popupopen', function(e){
    try{ window.parent.postMessage({type:'mapPopup'}, '*'); }catch(_){}
  });
</script>
</body></html>`;
}

/* ─── Komponente ─── */
export default function MapScreen() {
  const router = useRouter();
  const [businesses, setBusinesses]   = useState<Business[]>([]);
  const [places, setPlaces]           = useState<Place[]>(STATIC_PLACES as Place[]);
  const [userLat, setUserLat]         = useState<number | undefined>();
  const [userLng, setUserLng]         = useState<number | undefined>();
  const [loading, setLoading]         = useState(true);
  const [activeLayers, setActiveLayers] = useState<LayerFilter[]>(['sehenswuerdigkeit', 'strand', 'krankenhaus', 'tourist_info']);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => { fetchData(); getLocation(); }, []);

  const fetchData = async () => {
    const [bizRes, placesRes] = await Promise.all([
      supabase.from('businesses').select('id,company_name,category,city,phone,maps_link').eq('status','approved'),
      supabase.from('places').select('*'),
    ]);
    if (bizRes.data) setBusinesses(bizRes.data);
    // Supabase-Daten überschreiben statische, falls Tabelle existiert
    if (placesRes.data && placesRes.data.length > 0) setPlaces(placesRes.data);
    setLoading(false);
  };

  const getLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
        () => null,
      );
    }
  };

  const toggleLayer = (id: LayerFilter) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    setSelectedPlace(null);
  };

  const mapHTML = useMemo(
    () => buildLeafletHTML(businesses, places, activeLayers, userLat, userLng),
    [businesses, places, activeLayers, userLat, userLng],
  );

  // Gefilterte Orte für die Liste unten
  const visiblePlaces = places.filter(p => activeLayers.includes(p.type as LayerFilter));

  const speak = (p: Place) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`${p.name}. ${p.description}`);
      u.lang = 'de-DE';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const typeLabel: Record<string, string> = {
    sehenswuerdigkeit: 'Sehenswürdigkeit', strand: 'Strand',
    krankenhaus: 'Krankenhaus', tourist_info: 'Tourist Info',
  };

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      {/* Sub-Header */}
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
        {LAYER_META.map(f => {
          const active = activeLayers.includes(f.id);
          return (
            <TouchableOpacity
              key={f.id}
              style={[s.chip, active && { backgroundColor: f.color, borderColor: f.color }]}
              onPress={() => toggleLayer(f.id)}
            >
              <Text style={[s.chipTxt, active && s.chipTxtActive]}>{f.icon} {f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Karte */}
          <View style={s.mapWrap}>
            {Platform.OS === 'web' ? (
              // @ts-ignore
              <iframe srcDoc={mapHTML} style={{ width:'100%', height:'100%', border:'none' }} title="Karte" />
            ) : (
              <View style={s.fallback}><Text style={s.fallbackTxt}>Karte nur in der Web-Version.</Text></View>
            )}
          </View>

          {/* Info-Panel: ausgewählter Ort */}
          {selectedPlace && (
            <View style={s.detailCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.detailName}>{selectedPlace.name}</Text>
                <TouchableOpacity onPress={() => setSelectedPlace(null)}><Text style={{ fontSize: 18, color: '#888' }}>✕</Text></TouchableOpacity>
              </View>
              {(() => {
                const m = LAYER_META.find(l => l.id === selectedPlace.type);
                return <Text style={[s.detailType, { color: m?.color ?? '#888' }]}>{m?.icon} {typeLabel[selectedPlace.type] ?? selectedPlace.type}</Text>;
              })()}
              <Text style={s.detailDesc}>{selectedPlace.description}</Text>
              {selectedPlace.phone ? <Text style={s.detailPhone}>📞 {selectedPlace.phone}</Text> : null}
              <View style={s.detailBtns}>
                <TouchableOpacity style={[s.detailBtn, { backgroundColor: '#0077B6' }]} onPress={() => speak(selectedPlace)}>
                  <Text style={s.detailBtnTxt}>🔊 Vorlesen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.detailBtn, { backgroundColor: '#27AE60' }]}
                  onPress={() => { if (Platform.OS === 'web') window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`, '_blank'); }}
                >
                  <Text style={s.detailBtnTxt}>🗺️ Route</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Ortsliste unter der Karte */}
          {!selectedPlace && visiblePlaces.length > 0 && (
            <View style={s.listWrap}>
              <Text style={s.listTitle}>📋 {visiblePlaces.length} Orte in der Karte</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.listRow}>
                {visiblePlaces.map(p => {
                  const m = LAYER_META.find(l => l.id === p.type);
                  return (
                    <TouchableOpacity key={p.id} style={[s.placeCard, { borderLeftColor: m?.color ?? '#888' }]} onPress={() => setSelectedPlace(p)}>
                      <Text style={s.placeCardIcon}>{m?.icon}</Text>
                      <Text style={s.placeCardName} numberOfLines={2}>{p.name}</Text>
                      <Text style={[s.placeCardType, { color: m?.color ?? '#888' }]}>{typeLabel[p.type] ?? p.type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },
  subHeader: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 16, marginTop: -1, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  filterScroll: { flexGrow: 0, marginTop: 10 },
  filterRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff' },
  chipTxt: { fontSize: 12, fontWeight: '700', color: '#555' },
  chipTxtActive: { color: '#fff' },
  mapWrap: { flex: 1, margin: 12, marginBottom: 6, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: '#D0D8E8', minHeight: 280 },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fallbackTxt: { fontSize: 15, color: '#888' },

  detailCard: {
    marginHorizontal: 12, marginBottom: 8, backgroundColor: '#fff',
    borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  detailName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', flex: 1, marginRight: 8 },
  detailType: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 2, marginBottom: 6 },
  detailDesc: { fontSize: 12, color: '#555', lineHeight: 18, marginBottom: 6 },
  detailPhone: { fontSize: 12, color: '#0077B6', marginBottom: 8 },
  detailBtns: { flexDirection: 'row', gap: 8 },
  detailBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  detailBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  listWrap: { marginHorizontal: 12, marginBottom: 10 },
  listTitle: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6 },
  listRow: { gap: 10, paddingBottom: 2 },
  placeCard: {
    width: 130, backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  placeCardIcon: { fontSize: 22, marginBottom: 4 },
  placeCardName: { fontSize: 11, fontWeight: '700', color: '#1A1A2E', lineHeight: 15, marginBottom: 4 },
  placeCardType: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});
