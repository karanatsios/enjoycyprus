import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../lib/supabase';

/* ─── Statische Orte (Fallback) ─── */
const STATIC_PLACES = [
  { id: 's1', name: 'Aphrodite Felsen (Petra tou Romiou)', type: 'sehenswuerdigkeit', description: 'Der Geburtsort der Göttin Aphrodite – einer der bekanntesten Orte Zyperns. Spektakuläre Felsformation am Meer.', lat: 34.6133, lng: 32.5019, rating_avg: 0, rating_count: 0 },
  { id: 's2', name: 'Kolossi Burg', type: 'sehenswuerdigkeit', description: 'Mittelalterliche Burg aus dem 13. Jahrhundert, einst Hauptquartier der Kreuzritter.', lat: 34.6678, lng: 32.9231, rating_avg: 0, rating_count: 0 },
  { id: 's3', name: 'Kourion Amphitheater', type: 'sehenswuerdigkeit', description: 'Beeindruckendes griechisch-römisches Amphitheater mit Blick auf das Meer.', lat: 34.6606, lng: 32.8878, rating_avg: 0, rating_count: 0 },
  { id: 's4', name: 'Kyrenia Burg', type: 'sehenswuerdigkeit', description: 'Byzantinische Burg aus dem 7. Jahrhundert am Hafen von Kyrenia.', lat: 35.3411, lng: 33.3178, rating_avg: 0, rating_count: 0 },
  { id: 's5', name: 'Bellapais Kloster', type: 'sehenswuerdigkeit', description: 'Gotisches Kloster aus dem 13. Jahrhundert mit Blick über das Kyrenia-Gebirge.', lat: 35.3106, lng: 33.3461, rating_avg: 0, rating_count: 0 },
  { id: 's6', name: 'Famagusta Altstadt', type: 'sehenswuerdigkeit', description: 'Mittelalterliche Stadtmauern und die Katharinenkathedrale (heute Lala Mustafa Moschee).', lat: 35.1247, lng: 33.9422, rating_avg: 0, rating_count: 0 },
  { id: 's7', name: 'Akamas Halbinsel', type: 'sehenswuerdigkeit', description: 'Unberührte Naturlandschaft im Nordwesten Zyperns. Wanderwege und Schildkröten-Nistplätze.', lat: 35.0833, lng: 32.3167, rating_avg: 0, rating_count: 0 },
  { id: 's8', name: 'Tombs of the Kings', type: 'sehenswuerdigkeit', description: 'Unterirdisches Nekropolis aus dem 4. Jh. v. Chr. UNESCO-Weltkulturerbe in Paphos.', lat: 34.7764, lng: 32.3947, rating_avg: 0, rating_count: 0 },
  { id: 's9', name: 'Paphos Mosaiken', type: 'sehenswuerdigkeit', description: 'Weltberühmte römische Bodenmosaiken. UNESCO-Weltkulturerbe.', lat: 34.7569, lng: 32.4081, rating_avg: 0, rating_count: 0 },
  { id: 's10', name: 'Cape Greco', type: 'sehenswuerdigkeit', description: 'Atemberaubendes Kap im Südosten mit kristallklarem Wasser und Meereshöhlen.', lat: 34.9583, lng: 34.0786, rating_avg: 0, rating_count: 0 },
  { id: 's11', name: 'Kykkos Kloster', type: 'sehenswuerdigkeit', description: 'Das reichste Kloster Zyperns, tief im Troodos-Gebirge.', lat: 34.9844, lng: 32.7397, rating_avg: 0, rating_count: 0 },
  { id: 's12', name: 'Troodos Gebirge', type: 'sehenswuerdigkeit', description: 'Höchstes Gebirge Zyperns (Olympos 1952m). Wanderwege und Skifahren im Winter.', lat: 34.9167, lng: 32.8667, rating_avg: 0, rating_count: 0 },
  { id: 's13', name: 'Hala Sultan Tekke', type: 'sehenswuerdigkeit', description: 'Muslimisches Heiligtum am Salzsee von Larnaka.', lat: 34.8769, lng: 33.6094, rating_avg: 0, rating_count: 0 },
  { id: 's14', name: 'Lefkara Dorf', type: 'sehenswuerdigkeit', description: 'Malerisches Bergdorf bekannt für Spitzenklöppelei (Lefkaritika). UNESCO-Kulturerbe.', lat: 34.8667, lng: 33.3167, rating_avg: 0, rating_count: 0 },
  { id: 's15', name: 'Nikosia Altstadt & Ledra Street', type: 'sehenswuerdigkeit', description: 'Herz der geteilten Hauptstadt. Einziger Grenzübergang in einer Hauptstadt der Welt.', lat: 35.1725, lng: 33.3617, rating_avg: 0, rating_count: 0 },
  { id: 'b1', name: 'Nissi Beach', type: 'strand', description: 'Beliebtester Strand Zyperns in Ayia Napa. Weißer Sand, türkisblaues Wasser. Blaue Flagge.', lat: 34.9889, lng: 34.0019, rating_avg: 0, rating_count: 0 },
  { id: 'b2', name: 'Fig Tree Bay', type: 'strand', description: 'Schöner Sandstrand in Protaras mit ruhigem Wasser – ideal für Familien. Blaue Flagge.', lat: 35.0125, lng: 34.0572, rating_avg: 0, rating_count: 0 },
  { id: 'b3', name: 'Coral Bay', type: 'strand', description: 'Beliebter Sandstrand nördlich von Paphos mit Wassersport.', lat: 34.8356, lng: 32.3700, rating_avg: 0, rating_count: 0 },
  { id: 'b4', name: 'Kourion Beach', type: 'strand', description: 'Wilder Kiesstrand unter den Klippen des antiken Kourion. Ideal zum Schnorcheln.', lat: 34.6519, lng: 32.8744, rating_avg: 0, rating_count: 0 },
  { id: 'b5', name: "Lady's Mile Beach", type: 'strand', description: 'Langer, ruhiger Strand westlich von Limassol. Kite-Surf-Spot.', lat: 34.6456, lng: 33.0017, rating_avg: 0, rating_count: 0 },
  { id: 'b6', name: 'Mackenzie Beach', type: 'strand', description: 'Urbaner Strand in Larnaka neben dem Flughafen. Viele Bars und Restaurants.', lat: 34.8689, lng: 33.6336, rating_avg: 0, rating_count: 0 },
  { id: 'b7', name: 'Lara Beach', type: 'strand', description: 'Abgelegener Strand auf der Akamas-Halbinsel. Nistplatz für Caretta-Caretta-Schildkröten.', lat: 35.0544, lng: 32.3125, rating_avg: 0, rating_count: 0 },
  { id: 'b8', name: "Governor's Beach", type: 'strand', description: 'Strand mit weißen Klippen und schwarzem Kieselstrand östlich von Limassol.', lat: 34.7186, lng: 33.2683, rating_avg: 0, rating_count: 0 },
  { id: 'k1', name: 'Limassol General Hospital', type: 'krankenhaus', description: 'Staatliches Allgemeinkrankenhaus. Notaufnahme 24/7.', lat: 34.7058, lng: 33.0361, address: 'Nikiforou Foka, Limassol', phone: '+357 25 801100', rating_avg: 0, rating_count: 0 },
  { id: 'k2', name: 'Nikosia General Hospital', type: 'krankenhaus', description: 'Größtes staatliches Krankenhaus Zyperns. Notaufnahme rund um die Uhr.', lat: 35.1500, lng: 33.3667, address: 'Athalassas Avenue, Nikosia', phone: '+357 22 603000', rating_avg: 0, rating_count: 0 },
  { id: 'k3', name: 'Larnaka General Hospital', type: 'krankenhaus', description: 'Staatliches Krankenhaus Larnaka mit Notaufnahme.', lat: 34.9050, lng: 33.6439, address: 'Grigori Afxentiou, Larnaka', phone: '+357 24 800500', rating_avg: 0, rating_count: 0 },
  { id: 'k4', name: 'Paphos General Hospital', type: 'krankenhaus', description: 'Staatliches Krankenhaus Paphos. Notaufnahme 24h.', lat: 34.7744, lng: 32.4197, address: 'Neofytou Nikolaidi, Paphos', phone: '+357 26 803100', rating_avg: 0, rating_count: 0 },
  { id: 'k5', name: 'Near East University Hospital', type: 'krankenhaus', description: 'Universitätskrankenhaus Nordzypern. Notaufnahme 24/7.', lat: 35.2028, lng: 33.3678, phone: '+90 392 675 1000', rating_avg: 0, rating_count: 0 },
  { id: 'g1', name: 'Gesundheitszentrum Nicosia (GESY)', type: 'gesundheitszentrum', description: 'Staatliches Gesundheitszentrum im Rahmen des zyprischen GESY-Systems.', lat: 35.1725, lng: 33.3617, address: 'Nikis Avenue 11, Nicosia', phone: '+357 22 605 000', rating_avg: 0, rating_count: 0 },
  { id: 'g2', name: 'Gesundheitszentrum Limassol (GESY)', type: 'gesundheitszentrum', description: 'Staatliches Gesundheitszentrum Limassol.', lat: 34.6769, lng: 33.0444, address: 'Gladstonos Street, Limassol', phone: '+357 25 803 100', rating_avg: 0, rating_count: 0 },
  { id: 'g3', name: 'Gesundheitszentrum Larnaca (GESY)', type: 'gesundheitszentrum', description: 'Staatliches Gesundheitszentrum Larnaca.', lat: 34.9189, lng: 33.6331, address: 'Ermou Street 22, Larnaca', phone: '+357 24 801 500', rating_avg: 0, rating_count: 0 },
  { id: 'g4', name: 'Gesundheitszentrum Paphos (GESY)', type: 'gesundheitszentrum', description: 'Staatliches Gesundheitszentrum Paphos.', lat: 34.7756, lng: 32.4236, phone: '+357 26 806 100', rating_avg: 0, rating_count: 0 },
  { id: 'b1m', name: 'Deutsche Botschaft Nicosia', type: 'botschaft', description: 'Konsularische Sprechzeiten: Mo–Fr 08:00–12:00. Termine online buchen.', lat: 35.1647, lng: 33.3611, address: 'Nikitaras 10, 1080 Nicosia', phone: '+357 22 451 145', rating_avg: 0, rating_count: 0 },
  { id: 'b2m', name: 'Österreichische Botschaft Nicosia', type: 'botschaft', description: 'Konsularische Angelegenheiten für österreichische Staatsbürger.', lat: 35.1694, lng: 33.3547, address: 'Glafkos Klerides, Nicosia', phone: '+357 22 471 711', rating_avg: 0, rating_count: 0 },
  { id: 'b3m', name: 'Schweizer Botschaft Nicosia', type: 'botschaft', description: 'Schweizer Vertretung auf Zypern.', lat: 35.1681, lng: 33.3528, address: 'Metochiou & Falirou, 2408 Engomi, Nicosia', phone: '+357 22 464 664', rating_avg: 0, rating_count: 0 },
  { id: 'b4m', name: 'British High Commission Nicosia', type: 'botschaft', description: 'Britische Vertretung für alle britischen Staatsbürger auf der Insel.', lat: 35.1736, lng: 33.3703, address: 'Alexander Pallis Street, 1587 Nicosia', phone: '+357 22 861 100', rating_avg: 0, rating_count: 0 },
  { id: 'b5m', name: 'US-Botschaft Nicosia', type: 'botschaft', description: 'American Citizen Services, Visa, Reisepässe.', lat: 35.1667, lng: 33.3500, address: 'Metochiou & Ploutarchou, 2407 Engomi, Nicosia', phone: '+357 22 393 939', rating_avg: 0, rating_count: 0 },
  { id: 'b6m', name: 'Russische Botschaft Nicosia', type: 'botschaft', description: 'Russische Vertretung auf Zypern.', lat: 35.1722, lng: 33.3611, address: 'Agiou Prokopiou 2, Engomi, Nicosia', phone: '+357 22 774 622', rating_avg: 0, rating_count: 0 },
  { id: 't1', name: 'Tourist Info – Larnaka Flughafen', type: 'tourist_info', description: 'Touristeninformation im Ankunftsbereich des Flughafens.', lat: 34.8753, lng: 33.6253, phone: '+357 24 643576', rating_avg: 0, rating_count: 0 },
  { id: 't2', name: 'Tourist Info – Paphos', type: 'tourist_info', description: 'Zentrale Touristeninformation Paphos.', lat: 34.7731, lng: 32.4242, phone: '+357 26 932841', rating_avg: 0, rating_count: 0 },
  { id: 't3', name: 'Tourist Info – Limassol', type: 'tourist_info', description: 'Touristeninformation im Stadtzentrum Limassol.', lat: 34.6769, lng: 33.0444, phone: '+357 25 362756', rating_avg: 0, rating_count: 0 },
  { id: 't4', name: 'Tourist Info – Nikosia', type: 'tourist_info', description: 'Touristeninformation in der Altstadt Nikosia.', lat: 35.1719, lng: 33.3642, phone: '+357 22 674264', rating_avg: 0, rating_count: 0 },
  { id: 't5', name: 'Tourist Info – Ayia Napa', type: 'tourist_info', description: 'Touristeninformation im Zentrum von Ayia Napa.', lat: 34.9844, lng: 34.0022, phone: '+357 23 721796', rating_avg: 0, rating_count: 0 },
];

/* ─── Typen ─── */
type Place = {
  id: string; name: string; type: string; description: string;
  lat: number; lng: number; address?: string; phone?: string;
  rating_avg: number; rating_count: number;
};
type Business = {
  id: string; company_name: string; category: string;
  city: string; phone: string; maps_link: string;
};

/* ─── Alle Filter-Chips in einer Reihe ─── */
const PLACE_FILTERS = [
  { id: 'sehenswuerdigkeit',  label: 'Sehensw.',    icon: '📍', color: '#E67E22' },
  { id: 'strand',             label: 'Strände',      icon: '🏖️', color: '#0077B6' },
  { id: 'krankenhaus',        label: 'Krankenh.',    icon: '🏥', color: '#E74C3C' },
  { id: 'gesundheitszentrum', label: 'Gesundh.',     icon: '⚕️', color: '#00897B' },
  { id: 'botschaft',          label: 'Botschaften',  icon: '🏛️', color: '#5C6BC0' },
  { id: 'tourist_info',       label: 'Tourist Info', icon: 'ℹ️', color: '#8E44AD' },
];

const BIZ_FILTERS = [
  { id: 'gastronomie',    label: 'Gastro',       icon: '🍽️', color: '#27AE60' },
  { id: 'handwerk',       label: 'Handwerk',     icon: '🔨', color: '#795548' },
  { id: 'medizin',        label: 'Medizin',      icon: '⚕️', color: '#E74C3C' },
  { id: 'immobilien',     label: 'Immo',         icon: '🏠', color: '#1565C0' },
  { id: 'finanzen',       label: 'Finanzen',     icon: '⚖️', color: '#FF8F00' },
  { id: 'shopping',       label: 'Shopping',     icon: '🛍️', color: '#AD1457' },
  { id: 'beauty',         label: 'Beauty',       icon: '💆', color: '#E91E63' },
  { id: 'dienstleistung', label: 'Services',     icon: '🛠️', color: '#546E7A' },
  { id: 'mobilitaet',     label: 'Mobilität',    icon: '🚗', color: '#00838F' },
  { id: 'tourismus',      label: 'Tourismus',    icon: '🌴', color: '#2E7D32' },
  { id: 'auswandern',     label: 'Auswandern',   icon: '✈️', color: '#4527A0' },
];

const CITY_COORDS: Record<string, [number, number]> = {
  'Limassol': [34.6833, 33.0333],
  'Nikosia / Nicosia': [35.1667, 33.3667],
  'Larnaka / Larnaca': [34.9167, 33.6333],
  'Paphos': [34.7667, 32.4167],
  'Ayia Napa': [34.9833, 34.0],
  'Protaras': [35.0167, 34.05],
  'Kyrenia / Girne': [35.3417, 33.3192],
  'Nikosia Nord / Lefkoşa': [35.1833, 33.3667],
  'Famagusta Nord / Gazimağusa': [35.1167, 33.95],
};

/* ─── Leaflet HTML ─── */
function buildLeafletHTML(
  businesses: Business[],
  places: Place[],
  activePlaceLayers: string[],
  activeBizCategories: string[],
  userLat?: number,
  userLng?: number,
): string {
  const placeColor: Record<string, string> = {
    sehenswuerdigkeit: '#E67E22', strand: '#0077B6',
    krankenhaus: '#E74C3C', gesundheitszentrum: '#00897B',
    botschaft: '#5C6BC0', tourist_info: '#8E44AD',
  };
  const placeIcon: Record<string, string> = {
    sehenswuerdigkeit: '📍', strand: '🏖️', krankenhaus: '🏥',
    gesundheitszentrum: '⚕️', botschaft: '🏛️', tourist_info: 'ℹ️',
  };
  const typeLabel: Record<string, string> = {
    sehenswuerdigkeit: 'Sehenswürdigkeit', strand: 'Strand',
    krankenhaus: 'Krankenhaus', gesundheitszentrum: 'Gesundheitszentrum',
    botschaft: 'Botschaft', tourist_info: 'Tourist Info',
  };

  const placeMarkersJS = places
    .filter(p => activePlaceLayers.includes(p.type))
    .map(p => {
      const color = placeColor[p.type] ?? '#888';
      const icon  = placeIcon[p.type]  ?? '📍';
      const label = typeLabel[p.type]  ?? p.type;
      const desc  = (p.description ?? '').replace(/'/g, "\\'").replace(/`/g, "'");
      const name  = p.name.replace(/'/g, "\\'").replace(/`/g, "'");
      const addrLine = p.address ? `<br><span style='color:#666'>📍 ${p.address.replace(/'/g, "&#39;")}</span>` : '';
      const phoneLine = p.phone ? `<br><a href='tel:${p.phone}' style='color:#0077B6'>📞 ${p.phone}</a>` : '';
      return `L.marker([${p.lat},${p.lng}],{icon:L.divIcon({className:'',html:'<div style="background:${color};color:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:3px solid #fff;">${icon}</div>',iconSize:[40,40],iconAnchor:[20,20],popupAnchor:[0,-22]})}).addTo(map).bindPopup(\`<div style="min-width:230px;font-family:sans-serif;line-height:1.5"><div style="font-weight:800;font-size:14px;color:#1A1A2E;margin-bottom:2px">${icon} ${name}</div><div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;margin-bottom:6px">${label}</div><div style="font-size:12px;color:#444;margin-bottom:6px">${desc.substring(0,160)}</div>${addrLine}${phoneLine}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button onclick="speakText('${name}. ${desc.substring(0,200)}')" style="background:#0077B6;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">🔊 Vorlesen</button><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" style="background:#27AE60;color:#fff;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">🗺️ Route</a><button onclick="openReview('${p.id}','${name}')" style="background:#E67E22;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">⭐ Bewerten</button></div></div>\`,{maxWidth:280});`;
    }).join('\n');

  const bizMarkersJS = businesses
    .filter(b => activeBizCategories.includes(b.category))
    .map(b => {
      const coords = CITY_COORDS[b.city];
      if (!coords) return '';
      const [lat, lng] = coords;
      const jlat = lat + (Math.random() - 0.5) * 0.025;
      const jlng = lng + (Math.random() - 0.5) * 0.025;
      const meta = BIZ_FILTERS.find(f => f.id === b.category);
      const icon  = meta?.icon  ?? '🏢';
      const color = meta?.color ?? '#27AE60';
      const name  = b.company_name.replace(/'/g, "&#39;");
      const phoneLine = b.phone ? `<br><a href='tel:${b.phone}'>📞 ${b.phone}</a>` : '';
      return `L.marker([${jlat},${jlng}],{icon:L.divIcon({className:'',html:'<div style="background:${color};color:#fff;border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;">${icon}</div>',iconSize:[36,36],iconAnchor:[18,18],popupAnchor:[0,-20]})}).addTo(map).bindPopup('<div style="min-width:200px;font-family:sans-serif"><b style="font-size:14px">${icon} ${name}</b><br><span style="color:${color};font-size:11px;font-weight:700;text-transform:uppercase">${meta?.label ?? b.category}</span><br>${b.city}${phoneLine}<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=${jlat},${jlng}" target="_blank" style="background:#1565C0;color:#fff;padding:6px 12px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12px">🗺️ Route</a></div>',{maxWidth:260});`;
    }).filter(Boolean).join('\n');

  const userMarkerJS = (userLat && userLng)
    ? `L.marker([${userLat},${userLng}],{icon:L.divIcon({className:'',html:'<div style="background:#1565C0;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 10px rgba(0,0,0,0.4);border:3px solid #fff;">🔵</div>',iconSize:[36,36],iconAnchor:[18,18]})}).addTo(map).bindPopup('<b>📍 Mein Standort</b>').openPopup();`
    : '';

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}.leaflet-popup-content{margin:12px 14px;}
#rm{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9999;}
#rb{background:#fff;border-radius:20px;padding:24px;max-width:320px;width:92%;margin:auto;margin-top:60px;font-family:sans-serif;}
.sb{font-size:30px;cursor:pointer;background:none;border:none;padding:2px 4px;}</style>
</head><body>
<div id="map"></div>
<div id="rm" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9999;">
  <div id="rb" style="background:#fff;border-radius:20px;padding:24px;max-width:320px;width:92%;margin:auto;margin-top:60px;font-family:sans-serif;">
    <div id="rt" style="font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:4px"></div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Ihre Bewertung hilft anderen Reisenden!</div>
    <div id="stars" style="display:flex;gap:2px;margin-bottom:14px">
      <button class="sb" onclick="setStar(1)">☆</button><button class="sb" onclick="setStar(2)">☆</button>
      <button class="sb" onclick="setStar(3)">☆</button><button class="sb" onclick="setStar(4)">☆</button>
      <button class="sb" onclick="setStar(5)">☆</button>
    </div>
    <textarea id="rc" placeholder="Ihr Kommentar (optional)..." style="width:100%;border:1.5px solid #E0E0E8;border-radius:12px;padding:10px;font-size:13px;resize:none;height:80px;box-sizing:border-box;margin-bottom:10px"></textarea>
    <input id="rn" placeholder="Ihr Name (optional)" style="width:100%;border:1.5px solid #E0E0E8;border-radius:12px;padding:10px;font-size:13px;box-sizing:border-box;margin-bottom:14px"/>
    <div style="display:flex;gap:8px">
      <button onclick="submitReview()" style="flex:1;background:#0077B6;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer">⭐ Absenden</button>
      <button onclick="closeReview()" style="background:#F0F4FA;color:#666;border:none;border-radius:12px;padding:13px;font-size:14px;cursor:pointer">✕</button>
    </div>
    <div id="rmsg" style="margin-top:10px;font-size:12px;text-align:center"></div>
  </div>
</div>
<script>
  var map=L.map('map',{zoomControl:true}).setView([${userLat ?? 34.9},${userLng ?? 33.1}],${userLat ? 11 : 9});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:19}).addTo(map);
  function speakText(t){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang='de-DE';u.rate=0.9;window.speechSynthesis.speak(u);}
  var cpid='',cstar=0;
  function openReview(id,name){cpid=id;cstar=0;document.getElementById('rt').textContent='⭐ '+name+' bewerten';document.getElementById('rc').value='';document.getElementById('rn').value='';document.getElementById('rmsg').textContent='';updateStars(0);document.getElementById('rm').style.display='flex';}
  function closeReview(){document.getElementById('rm').style.display='none';}
  function setStar(n){cstar=n;updateStars(n);}
  function updateStars(n){document.getElementById('stars').querySelectorAll('button').forEach(function(b,i){b.textContent=i<n?'⭐':'☆';});}
  async function submitReview(){
    if(!cstar){document.getElementById('rmsg').textContent='Bitte Sterne wählen.';return;}
    var msg=document.getElementById('rmsg');msg.style.color='#888';msg.textContent='Wird gespeichert…';
    try{var res=await fetch('https://jewactcyhvzrceoiajau.supabase.co/rest/v1/place_reviews',{method:'POST',headers:{'Content-Type':'application/json','apikey':'sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB','Authorization':'Bearer sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB','Prefer':'return=minimal'},body:JSON.stringify({place_id:cpid,rating:cstar,comment:document.getElementById('rc').value,author_name:document.getElementById('rn').value||'Anonym'})});
    if(res.ok){msg.style.color='#27AE60';msg.textContent='✅ Vielen Dank!';setTimeout(closeReview,1500);}else{msg.style.color='#E74C3C';msg.textContent='Fehler beim Speichern.';}}catch(e){msg.style.color='#E74C3C';msg.textContent='Netzwerkfehler.';}
  }
  ${placeMarkersJS}
  ${bizMarkersJS}
  ${userMarkerJS}
  map.on('click',function(e){var lat=e.latlng.lat.toFixed(6),lng=e.latlng.lng.toFixed(6);L.popup().setLatLng(e.latlng).setContent('<a href="https://www.google.com/maps/dir/?api=1&destination='+lat+','+lng+'" target="_blank" style="background:#1565C0;color:#fff;padding:7px 16px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block">🗺️ Route hierher</a>').openOn(map);});
</script></body></html>`;
}

/* ─── Hauptkomponente ─── */
export default function MapScreen() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [places, setPlaces]         = useState<Place[]>(STATIC_PLACES as Place[]);
  const [userLat, setUserLat]       = useState<number | undefined>();
  const [userLng, setUserLng]       = useState<number | undefined>();
  const [loading, setLoading]       = useState(true);
  const [activePlaceLayers, setActivePlaceLayers]   = useState<string[]>(['sehenswuerdigkeit', 'strand', 'krankenhaus', 'gesundheitszentrum', 'botschaft', 'tourist_info']);
  const [activeBizCategories, setActiveBizCategories] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedBiz, setSelectedBiz]     = useState<Business | null>(null);

  useEffect(() => {
    fetchData();
    getLocation();

    // Live-Rating-Updates via Supabase Realtime
    const channel = supabase
      .channel('places-ratings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'places' }, payload => {
        const updated = payload.new as Place;
        setPlaces(prev => {
          const idx = prev.findIndex(p => p.id === updated.id);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = { ...next[idx], rating_avg: updated.rating_avg, rating_count: updated.rating_count };
          return next;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    const [bizRes, placesRes] = await Promise.all([
      supabase.from('businesses').select('id,company_name,category,city,phone,maps_link').eq('status', 'approved'),
      supabase.from('places').select('*'),
    ]);
    if (bizRes.data) setBusinesses(bizRes.data);
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

  const togglePlaceLayer = (id: string) => {
    setActivePlaceLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    setSelectedPlace(null); setSelectedBiz(null);
  };

  const toggleBizCategory = (id: string) => {
    setActiveBizCategories(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    setSelectedPlace(null); setSelectedBiz(null);
  };

  const mapHTML = useMemo(
    () => buildLeafletHTML(businesses, places, activePlaceLayers, activeBizCategories, userLat, userLng),
    [businesses, places, activePlaceLayers, activeBizCategories, userLat, userLng],
  );

  const visiblePlaces = places.filter(p => activePlaceLayers.includes(p.type));
  const visibleBiz    = businesses.filter(b => activeBizCategories.includes(b.category));

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const PLACE_TYPE_LABEL: Record<string, string> = {
    sehenswuerdigkeit: 'Sehenswürdigkeit', strand: 'Strand',
    krankenhaus: 'Krankenhaus', gesundheitszentrum: 'Gesundheitszentrum',
    botschaft: 'Botschaft', tourist_info: 'Tourist Info',
  };

  const totalVisible = visiblePlaces.length + visibleBiz.length;

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

      {/* Filter: Orte */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterRow}>
        {PLACE_FILTERS.map(f => {
          const active = activePlaceLayers.includes(f.id);
          return (
            <TouchableOpacity key={f.id} style={[s.chip, active && { backgroundColor: f.color, borderColor: f.color }]} onPress={() => togglePlaceLayer(f.id)}>
              <Text style={[s.chipTxt, active && s.chipTxtActive]}>{f.icon} {f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filter: Unternehmen-Kategorien */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.filterScroll, { marginTop: 4 }]} contentContainerStyle={s.filterRow}>
        {BIZ_FILTERS.map(f => {
          const active = activeBizCategories.includes(f.id);
          return (
            <TouchableOpacity key={f.id} style={[s.chip, active && { backgroundColor: f.color, borderColor: f.color }]} onPress={() => toggleBizCategory(f.id)}>
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
              <iframe srcDoc={mapHTML} style={{ width: '100%', height: '100%', border: 'none' }} title="Karte" />
            ) : (
              <View style={s.fallback}><Text style={s.fallbackTxt}>Karte nur in der Web-Version.</Text></View>
            )}
          </View>

          {/* Detail-Panel: Ort */}
          {selectedPlace && (
            <View style={s.detailCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={s.detailName} numberOfLines={2}>{selectedPlace.name}</Text>
                <TouchableOpacity onPress={() => setSelectedPlace(null)}><Text style={{ fontSize: 18, color: '#888', marginLeft: 8 }}>✕</Text></TouchableOpacity>
              </View>
              {(() => { const m = PLACE_FILTERS.find(l => l.id === selectedPlace.type); return <Text style={[s.detailType, { color: m?.color ?? '#888' }]}>{m?.icon} {PLACE_TYPE_LABEL[selectedPlace.type]}</Text>; })()}
              <Text style={s.detailDesc} numberOfLines={4}>{selectedPlace.description}</Text>
              {selectedPlace.phone ? <Text style={s.detailPhone}>📞 {selectedPlace.phone}</Text> : null}
              <View style={s.detailBtns}>
                <TouchableOpacity style={[s.detailBtn, { backgroundColor: '#0077B6' }]} onPress={() => speak(`${selectedPlace.name}. ${selectedPlace.description}`)}>
                  <Text style={s.detailBtnTxt}>🔊 Vorlesen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.detailBtn, { backgroundColor: '#27AE60' }]} onPress={() => { if (Platform.OS === 'web') window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`, '_blank'); }}>
                  <Text style={s.detailBtnTxt}>🗺️ Route</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Detail-Panel: Unternehmen */}
          {selectedBiz && (
            <View style={s.detailCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={s.detailName} numberOfLines={2}>{selectedBiz.company_name}</Text>
                <TouchableOpacity onPress={() => setSelectedBiz(null)}><Text style={{ fontSize: 18, color: '#888', marginLeft: 8 }}>✕</Text></TouchableOpacity>
              </View>
              {(() => { const m = BIZ_FILTERS.find(l => l.id === selectedBiz.category); return <Text style={[s.detailType, { color: m?.color ?? '#27AE60' }]}>{m?.icon} {m?.label} · {selectedBiz.city}</Text>; })()}
              {selectedBiz.phone ? <Text style={s.detailPhone}>📞 {selectedBiz.phone}</Text> : null}
              <View style={s.detailBtns}>
                <TouchableOpacity style={[s.detailBtn, { backgroundColor: '#27AE60' }]} onPress={() => { if (Platform.OS === 'web') window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedBiz.company_name + ' ' + selectedBiz.city)}`, '_blank'); }}>
                  <Text style={s.detailBtnTxt}>🗺️ Route</Text>
                </TouchableOpacity>
                {selectedBiz.phone && (
                  <TouchableOpacity style={[s.detailBtn, { backgroundColor: '#0077B6' }]} onPress={() => { if (Platform.OS === 'web') window.open(`tel:${selectedBiz.phone}`); }}>
                    <Text style={s.detailBtnTxt}>📞 Anrufen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Kacheln unter der Karte */}
          {!selectedPlace && !selectedBiz && totalVisible > 0 && (
            <View style={s.listWrap}>
              <Text style={s.listTitle}>📋 {totalVisible} Einträge sichtbar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.listRow}>
                {visiblePlaces.map(p => {
                  const m = PLACE_FILTERS.find(l => l.id === p.type);
                  return (
                    <TouchableOpacity key={p.id} style={[s.card, { borderLeftColor: m?.color ?? '#888' }]} onPress={() => setSelectedPlace(p)}>
                      <Text style={s.cardIcon}>{m?.icon}</Text>
                      <Text style={s.cardName} numberOfLines={2}>{p.name}</Text>
                      <Text style={[s.cardType, { color: m?.color ?? '#888' }]}>{PLACE_TYPE_LABEL[p.type] ?? p.type}</Text>
                    </TouchableOpacity>
                  );
                })}
                {visibleBiz.map(b => {
                  const m = BIZ_FILTERS.find(l => l.id === b.category);
                  return (
                    <TouchableOpacity key={b.id} style={[s.card, { borderLeftColor: m?.color ?? '#27AE60' }]} onPress={() => setSelectedBiz(b)}>
                      <Text style={s.cardIcon}>{m?.icon ?? '🏢'}</Text>
                      <Text style={s.cardName} numberOfLines={2}>{b.company_name}</Text>
                      <Text style={[s.cardType, { color: m?.color ?? '#27AE60' }]}>{m?.label ?? b.category}</Text>
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
  subHeader: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 14, marginTop: -1, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  filterScroll: { flexGrow: 0, marginTop: 8 },
  filterRow: { paddingHorizontal: 12, gap: 6, paddingBottom: 2 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff' },
  chipTxt: { fontSize: 11, fontWeight: '700', color: '#555' },
  chipTxtActive: { color: '#fff' },
  mapWrap: { flex: 1, margin: 10, marginBottom: 6, borderRadius: 18, overflow: 'hidden', borderWidth: 1.5, borderColor: '#D0D8E8', minHeight: 240 },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fallbackTxt: { fontSize: 15, color: '#888' },
  detailCard: { marginHorizontal: 10, marginBottom: 6, backgroundColor: '#fff', borderRadius: 18, padding: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  detailName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', flex: 1 },
  detailType: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 2, marginBottom: 6 },
  detailDesc: { fontSize: 12, color: '#555', lineHeight: 17, marginBottom: 6 },
  detailPhone: { fontSize: 12, color: '#0077B6', marginBottom: 8 },
  detailBtns: { flexDirection: 'row', gap: 8 },
  detailBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  detailBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  listWrap: { marginHorizontal: 10, marginBottom: 8 },
  listTitle: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 6 },
  listRow: { gap: 8, paddingBottom: 2 },
  card: { width: 120, backgroundColor: '#fff', borderRadius: 14, padding: 10, borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardIcon: { fontSize: 20, marginBottom: 4 },
  cardName: { fontSize: 11, fontWeight: '700', color: '#1A1A2E', lineHeight: 14, marginBottom: 4 },
  cardType: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});
