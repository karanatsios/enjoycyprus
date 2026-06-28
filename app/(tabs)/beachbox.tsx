import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Modal, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

type Beach = {
  id: string;
  name: string;
  region: 'Süden' | 'Norden';
  city: string;
  icon: string;
  freeLoungersAvailable: boolean;
  totalBoxes: number;
  bookedBoxes: number[];
};

const BEACHES: Beach[] = [
  { id: 'b1', name: 'Nissi Beach', region: 'Süden', city: 'Ayia Napa', icon: '🏖️', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [1, 3, 7] },
  { id: 'b2', name: 'Fig Tree Bay', region: 'Süden', city: 'Protaras', icon: '🌴', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [2, 5, 9, 11] },
  { id: 'b3', name: 'Lara Beach', region: 'Süden', city: 'Paphos', icon: '🐢', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [] },
  { id: 'b4', name: 'Governor\'s Beach', region: 'Süden', city: 'Limassol', icon: '🪨', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [4, 8] },
  { id: 'b5', name: 'Coral Bay', region: 'Süden', city: 'Paphos', icon: '🐚', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [1, 2, 6] },
  { id: 'b6', name: 'Makronissos Beach', region: 'Süden', city: 'Ayia Napa', icon: '🌊', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [3, 10, 12] },
  { id: 'b7', name: 'Pissouri Bay', region: 'Süden', city: 'Limassol', icon: '⛵', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [] },
  { id: 'b8', name: 'Konnos Bay', region: 'Süden', city: 'Protaras', icon: '🏝️', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [5, 7] },
  { id: 'b9', name: 'Kyrenia Soli Inn Beach', region: 'Norden', city: 'Kyrenia', icon: '⚓', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [2, 4] },
  { id: 'b10', name: 'Alagadi Turtle Beach', region: 'Norden', city: 'Kyrenia', icon: '🐢', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [] },
  { id: 'b11', name: 'Golden Beach (Karpaz)', region: 'Norden', city: 'Karpaz', icon: '✨', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [1] },
  { id: 'b12', name: 'Glapsides Beach', region: 'Norden', city: 'Famagusta', icon: '🌅', freeLoungersAvailable: false, totalBoxes: 12, bookedBoxes: [3, 6, 9] },
];

const TODAY = new Date('2026-06-28');
const PRICE = 10;
const DEPOSIT = 80;

function formatDate(d: Date) {
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function BeachboxScreen() {
  const router = useRouter();
  const [regionFilter, setRegionFilter] = useState<'Alle' | 'Süden' | 'Norden'>('Alle');
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const [bookingDone, setBookingDone] = useState(false);

  const filtered = regionFilter === 'Alle' ? BEACHES : BEACHES.filter(b => b.region === regionFilter);

  const availableCount = (beach: Beach) => beach.totalBoxes - beach.bookedBoxes.length;

  function openBeach(beach: Beach) {
    setSelectedBeach(beach);
    setSelectedBox(null);
    setBookingDone(false);
  }

  function handleBook() {
    if (!selectedBox) return;
    setBookingDone(true);
  }

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>📦 Beachbox</Text>
          <View style={{ minWidth: 70 }} />
        </View>
        <Text style={s.subHeaderSub}>Strandboxen mieten · 10 €/Tag · 12 Boxen pro Strand</Text>
      </View>

      {/* Info-Banner */}
      <View style={s.infoBanner}>
        <Text style={s.infoIcon}>💡</Text>
        <Text style={s.infoText}>
          Beachbox gibt es an allen Stränden ohne kostenlose Liegen & Schirme. Sichere deine Box für den Tag – wetterfest, abschließbar, direkt am Strand.
        </Text>
      </View>

      {/* Filter */}
      <View style={s.filterRow}>
        {(['Alle', 'Süden', 'Norden'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterChip, regionFilter === f && s.filterChipActive]}
            onPress={() => setRegionFilter(f)}
          >
            <Text style={[s.filterChipText, regionFilter === f && s.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map(beach => {
          const avail = availableCount(beach);
          const isFull = avail === 0;
          return (
            <TouchableOpacity
              key={beach.id}
              style={[s.card, isFull && s.cardFull]}
              activeOpacity={0.85}
              onPress={() => !isFull && openBeach(beach)}
            >
              <View style={s.cardIcon}>
                <Text style={s.cardIconText}>{beach.icon}</Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardName}>{beach.name}</Text>
                <Text style={s.cardCity}>📍 {beach.city} · {beach.region}</Text>
                <View style={s.availRow}>
                  {Array.from({ length: beach.totalBoxes }, (_, i) => i + 1).map(n => (
                    <View
                      key={n}
                      style={[s.miniBox, beach.bookedBoxes.includes(n) ? s.miniBoxBooked : s.miniBoxFree]}
                    />
                  ))}
                </View>
                <Text style={[s.availText, isFull && { color: '#e74c3c' }]}>
                  {isFull ? 'Ausgebucht' : `${avail} von ${beach.totalBoxes} frei`}
                </Text>
              </View>
              <View style={s.cardRight}>
                <Text style={s.priceText}>10 €</Text>
                <Text style={s.priceSub}>/Tag</Text>
                {!isFull && (
                  <View style={s.bookBtn}>
                    <Text style={s.bookBtnText}>Buchen</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Buchungs-Modal */}
      <Modal visible={!!selectedBeach} transparent animationType="slide" onRequestClose={() => setSelectedBeach(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            {bookingDone ? (
              <View style={s.successBox}>
                <Text style={s.successIcon}>✅</Text>
                <Text style={s.successTitle}>Buchung bestätigt!</Text>
                <Text style={s.successSub}>
                  Box #{selectedBox} am {selectedBeach?.name}{'\n'}
                  {formatDate(selectedDate)} · 10 €
                </Text>
                <Text style={s.successNote}>Du erhältst deinen Code per E-Mail zur Entsperrung der Box.</Text>
                <View style={s.depositConfirm}>
                  <Text style={s.depositConfirmIcon}>🔒</Text>
                  <Text style={s.depositConfirmText}>
                    <Text style={{ fontWeight: '800' }}>{DEPOSIT} € Pfand reserviert</Text>
                    {'\n'}Wird nach schadensfreier Rückgabe automatisch freigegeben.
                  </Text>
                </View>
                <TouchableOpacity style={s.doneBtn} onPress={() => setSelectedBeach(null)}>
                  <Text style={s.doneBtnText}>Fertig</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={s.modalHeader}>
                  <View>
                    <Text style={s.modalTitle}>{selectedBeach?.icon} {selectedBeach?.name}</Text>
                    <Text style={s.modalSub}>📍 {selectedBeach?.city} · Beachbox buchen</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBeach(null)}>
                    <Text style={s.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Datum */}
                  <Text style={s.sectionLabel}>DATUM</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateScroll}>
                    {Array.from({ length: 14 }, (_, i) => {
                      const d = new Date(TODAY);
                      d.setDate(TODAY.getDate() + i);
                      const isSelected = d.toDateString() === selectedDate.toDateString();
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[s.dateChip, isSelected && s.dateChipActive]}
                          onPress={() => setSelectedDate(new Date(d))}
                        >
                          <Text style={[s.dateChipDay, isSelected && s.dateChipTextActive]}>
                            {d.toLocaleDateString('de-DE', { weekday: 'short' })}
                          </Text>
                          <Text style={[s.dateChipNum, isSelected && s.dateChipTextActive]}>
                            {d.getDate()}.{d.getMonth() + 1}.
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* Box wählen */}
                  <Text style={s.sectionLabel}>BOX WÄHLEN</Text>
                  <View style={s.boxGrid}>
                    {Array.from({ length: selectedBeach?.totalBoxes ?? 12 }, (_, i) => i + 1).map(n => {
                      const isBooked = selectedBeach?.bookedBoxes.includes(n);
                      const isSelected = selectedBox === n;
                      return (
                        <TouchableOpacity
                          key={n}
                          disabled={!!isBooked}
                          style={[s.boxBtn, isBooked && s.boxBtnBooked, isSelected && s.boxBtnSelected]}
                          onPress={() => setSelectedBox(n)}
                        >
                          <Text style={[s.boxBtnIcon, isBooked && { opacity: 0.3 }]}>📦</Text>
                          <Text style={[s.boxBtnNum, isBooked && s.boxBtnNumBooked, isSelected && s.boxBtnNumSelected]}>
                            #{n}
                          </Text>
                          <Text style={[s.boxBtnStatus, { color: isBooked ? '#e74c3c' : '#27AE60' }]}>
                            {isBooked ? 'Belegt' : 'Frei'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Pfand-Hinweis */}
                  <View style={s.depositBanner}>
                    <Text style={s.depositIcon}>🔒</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.depositTitle}>Sicherheitspfand: {DEPOSIT} €</Text>
                      <Text style={s.depositSub}>
                        Wird bei Buchung reserviert (nicht abgebucht). Nach Rückgabe ohne Schäden vollständig freigegeben – in der Regel innerhalb von 3–5 Werktagen.
                      </Text>
                    </View>
                  </View>

                  {/* Zusammenfassung */}
                  {selectedBox && (
                    <View style={s.summary}>
                      <Text style={s.summaryTitle}>Zusammenfassung</Text>
                      <View style={s.summaryRow}><Text style={s.summaryLabel}>Strand</Text><Text style={s.summaryVal}>{selectedBeach?.name}</Text></View>
                      <View style={s.summaryRow}><Text style={s.summaryLabel}>Box</Text><Text style={s.summaryVal}>#{selectedBox}</Text></View>
                      <View style={s.summaryRow}><Text style={s.summaryLabel}>Datum</Text><Text style={s.summaryVal}>{formatDate(selectedDate)}</Text></View>
                      <View style={s.summaryRow}><Text style={s.summaryLabel}>Tagesmiete</Text><Text style={[s.summaryVal, { color: Colors.primary, fontWeight: '800' }]}>{PRICE} €</Text></View>
                      <View style={s.summaryRow}><Text style={s.summaryLabel}>Pfand (reserviert)</Text><Text style={[s.summaryVal, { color: '#888' }]}>{DEPOSIT} €</Text></View>
                      <View style={s.summaryTotal}>
                        <Text style={s.summaryTotalLabel}>Gesamt autorisiert</Text>
                        <Text style={s.summaryTotalVal}>{PRICE + DEPOSIT} €</Text>
                      </View>
                      <Text style={s.summaryPfandNote}>
                        ✅ Nach schadensfreier Rückgabe: {DEPOSIT} € werden freigegeben. Du zahlst effektiv nur {PRICE} €.
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[s.confirmBtn, !selectedBox && s.confirmBtnDisabled]}
                    activeOpacity={0.85}
                    onPress={handleBook}
                    disabled={!selectedBox}
                  >
                    <Text style={s.confirmBtnText}>
                      {selectedBox ? `Box #${selectedBox} buchen · ${PRICE} €` : 'Box auswählen'}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ height: 30 }} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 14, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subHeaderSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 4 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#EBF5FB', borderRadius: 12,
    marginHorizontal: 16, marginTop: 12,
    padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },

  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#555' },
  filterChipTextActive: { color: '#fff' },

  list: { paddingHorizontal: 16, paddingTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardFull: { opacity: 0.6 },
  cardIcon: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  cardIconText: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  cardCity: { fontSize: 11, color: '#888', marginBottom: 6 },
  availRow: { flexDirection: 'row', gap: 3, flexWrap: 'wrap', marginBottom: 4 },
  miniBox: { width: 10, height: 10, borderRadius: 3 },
  miniBoxFree: { backgroundColor: '#27AE60' },
  miniBoxBooked: { backgroundColor: '#e74c3c' },
  availText: { fontSize: 11, fontWeight: '700', color: '#27AE60' },

  cardRight: { alignItems: 'center', gap: 4 },
  priceText: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  priceSub: { fontSize: 10, color: '#888', marginTop: -4 },
  bookBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6, marginTop: 4,
  },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  modalSub: { fontSize: 12, color: '#888', marginTop: 2 },
  modalClose: { fontSize: 20, color: '#aaa', fontWeight: '700', padding: 4 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#999', letterSpacing: 1.2,
    marginBottom: 10, marginTop: 8,
  },

  dateScroll: { marginBottom: 8 },
  dateChip: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#D0D8E8',
    backgroundColor: '#fff', marginRight: 8,
  },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateChipDay: { fontSize: 10, fontWeight: '700', color: '#888' },
  dateChipNum: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginTop: 2 },
  dateChipTextActive: { color: '#fff' },

  boxGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16,
  },
  boxBtn: {
    width: '22%', alignItems: 'center', padding: 10, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#D0D8E8', backgroundColor: '#F8FAFC',
  },
  boxBtnBooked: { backgroundColor: '#FEF0F0', borderColor: '#FADBD8' },
  boxBtnSelected: { backgroundColor: Colors.primary + '15', borderColor: Colors.primary, borderWidth: 2 },
  boxBtnIcon: { fontSize: 22 },
  boxBtnNum: { fontSize: 12, fontWeight: '800', color: '#1A1A2E', marginTop: 2 },
  boxBtnNumBooked: { color: '#aaa' },
  boxBtnNumSelected: { color: Colors.primary },
  boxBtnStatus: { fontSize: 9, fontWeight: '700', marginTop: 2 },

  summary: {
    backgroundColor: '#F8FAFC', borderRadius: 14,
    padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E8EEF5',
  },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A2E', marginBottom: 10 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F5',
  },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },

  depositBanner: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14,
    borderLeftWidth: 3, borderLeftColor: '#F39C12', marginBottom: 14,
  },
  depositIcon: { fontSize: 20 },
  depositTitle: { fontSize: 13, fontWeight: '800', color: '#B7770D', marginBottom: 3 },
  depositSub: { fontSize: 11, color: '#7D6608', lineHeight: 17 },

  summaryTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 10, paddingBottom: 4,
  },
  summaryTotalLabel: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  summaryTotalVal: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  summaryPfandNote: {
    fontSize: 11, color: '#27AE60', lineHeight: 16,
    marginTop: 6, fontWeight: '600',
  },

  confirmBtn: {
    backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  confirmBtnDisabled: { backgroundColor: '#C5D0E0', shadowOpacity: 0 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  successBox: { alignItems: 'center', paddingVertical: 30, gap: 12 },
  successIcon: { fontSize: 56 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  successSub: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22 },
  successNote: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 18, marginTop: 4 },
  depositConfirm: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#FFF8E1', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#F39C12', marginTop: 4,
  },
  depositConfirmIcon: { fontSize: 18 },
  depositConfirmText: { flex: 1, fontSize: 12, color: '#7D6608', lineHeight: 18 },

  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
  },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
