import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

const STEP_LABELS = ['Firma', 'Kontakt', 'Beschreibung', 'Zahlung'];

const CATEGORIES = [
  { id: 'handwerk', icon: '🔨', label: 'Handwerk' },
  { id: 'gastronomie', icon: '🍽️', label: 'Gastronomie' },
  { id: 'medizin', icon: '⚕️', label: 'Medizin & Gesundheit' },
  { id: 'immobilien', icon: '🏠', label: 'Immobilien' },
  { id: 'finanzen', icon: '⚖️', label: 'Finanzen & Recht' },
  { id: 'shopping', icon: '🛍️', label: 'Shopping' },
  { id: 'beauty', icon: '💆', label: 'Schönheit & Wellness' },
  { id: 'dienstleistung', icon: '🛠️', label: 'Dienstleistungen' },
  { id: 'mobilitaet', icon: '🚗', label: 'Auto, Motorrad & Fahrrad' },
  { id: 'tourismus', icon: '🏖️', label: 'Tourismus & Freizeit' },
  { id: 'auswandern', icon: '✈️', label: 'Auswandern' },
];

const REGION_CITIES: Record<string, string[]> = {
  'Süden': ['Limassol', 'Nikosia / Nicosia', 'Larnaka / Larnaca', 'Paphos', 'Ayia Napa', 'Paralimni', 'Protaras', 'Famagusta Süd'],
  'Norden': ['Kyrenia / Girne', 'Nikosia Nord / Lefkoşa', 'Famagusta Nord / Gazimağusa', 'Morphou / Güzelyurt'],
};

const LANGUAGES_AVAILABLE = [
  { code: 'DE', label: 'Deutsch' },
  { code: 'EN', label: 'English' },
  { code: 'EL', label: 'Ελληνικά' },
  { code: 'RU', label: 'Русский' },
  { code: 'TR', label: 'Türkçe' },
  { code: 'RO', label: 'Română' },
  { code: 'PL', label: 'Polski' },
];

type FormData = {
  // Step 1 – Firma
  companyName: string;
  category: string;
  locationType: 'local' | 'online';
  regionGroup: string;
  region: string;
  street: string;
  plz: string;
  city: string;
  mapsLink: string;
  // Step 2 – Kontakt
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  openingHours: string;
  languages: string[];
  // Step 3 – Beschreibung
  description: string;
  shortDesc: string;
  // Step 4 – Zahlung
  plan: 'free' | 'standard' | 'premium';
};

const INIT: FormData = {
  companyName: '', category: '', locationType: 'online', regionGroup: '', region: '',
  street: '', plz: '', city: '', mapsLink: '',
  phone: '', whatsapp: '', email: '', website: '', openingHours: '', languages: ['DE'],
  description: '', shortDesc: '',
  plan: 'free',
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <Text style={s.fieldLabel}>
      {text}{required && <Text style={s.required}> *</Text>}
    </Text>
  );
}

function Input({ label, required, placeholder, value, onChange, multiline, keyboardType }: any) {
  return (
    <View style={s.fieldWrap}>
      {label && <FieldLabel text={label} required={required} />}
      <TextInput
        style={[s.input, multiline && s.inputMulti]}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={s.stepRow}>
      {STEP_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <View style={s.stepItem}>
            <View style={[s.stepCircle, i < current && s.stepDone, i === current && s.stepActive]}>
              {i < current
                ? <Text style={s.stepCircleText}>✓</Text>
                : <Text style={[s.stepCircleText, i === current && s.stepCircleTextActive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[s.stepLabel, i === current && s.stepLabelActive]}>{label}</Text>
          </View>
          {i < STEP_LABELS.length - 1 && (
            <View style={[s.stepLine, i < current && s.stepLineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Step 1: Firma ────────────────────────────────────────────────
function Step1({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  const [catOpen, setCatOpen] = useState(false);
  const [regionGroupOpen, setRegionGroupOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const selectedCat = CATEGORIES.find(c => c.id === data.category);
  const cities = data.regionGroup ? REGION_CITIES[data.regionGroup] : [];

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.sectionTitle}>Ihr Unternehmen</Text>
      <Text style={s.sectionSub}>Pflichtfelder sind mit * markiert.</Text>

      <Input label="Firmenname" required placeholder="z.B. Müller Elektro GmbH"
        value={data.companyName} onChange={(v: string) => set({ companyName: v })} />

      <View style={s.fieldWrap}>
        <FieldLabel text="Kategorie" required />
        <TouchableOpacity style={s.select} onPress={() => { setCatOpen(!catOpen); setRegionGroupOpen(false); setCityOpen(false); }}>
          <Text style={[s.selectText, !data.category && s.selectPlaceholder]}>
            {selectedCat ? `${selectedCat.icon} ${selectedCat.label}` : '— Kategorie wählen —'}
          </Text>
          <Text style={s.selectArrow}>▾</Text>
        </TouchableOpacity>
        {catOpen && (
          <View style={s.dropdown}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={[s.dropItem, data.category === cat.id && s.dropItemActive]}
                onPress={() => { set({ category: cat.id }); setCatOpen(false); }}>
                <Text style={s.dropItemText}>{cat.icon} {cat.label}</Text>
                {data.category === cat.id && <Text style={s.dropCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={s.sectionTitle}>Standort</Text>
      <Text style={s.sectionSub}>Wo befindet sich Ihr Unternehmen?</Text>

      <TouchableOpacity style={[s.typeCard, data.locationType === 'local' && s.typeCardActive]}
        onPress={() => set({ locationType: 'local' })}>
        <View style={[s.typeRadio, data.locationType === 'local' && s.typeRadioActive]}>
          {data.locationType === 'local' && <View style={s.typeRadioDot} />}
        </View>
        <View style={s.typeText}>
          <Text style={s.typeTitle}>📍 Lokales Geschäft / vor Ort</Text>
          <Text style={s.typeSub}>Wird bei 'In meiner Nähe' gefunden. PLZ und Ort sind Pflicht.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[s.typeCard, data.locationType === 'online' && s.typeCardActive]}
        onPress={() => set({ locationType: 'online' })}>
        <View style={[s.typeRadio, data.locationType === 'online' && s.typeRadioActive]}>
          {data.locationType === 'online' && <View style={s.typeRadioDot} />}
        </View>
        <View style={s.typeText}>
          <Text style={s.typeTitle}>🌐 Online / Remote / überregional</Text>
          <Text style={s.typeSub}>Adresse optional. Wenn Sie eine Adresse eintragen, kann der Eintrag bei 'In meiner Nähe' gefunden werden.</Text>
        </View>
      </TouchableOpacity>

      <View style={s.fieldWrap}>
        <FieldLabel text="Region" required />
        <TouchableOpacity style={s.select} onPress={() => { setRegionGroupOpen(!regionGroupOpen); setCatOpen(false); setCityOpen(false); }}>
          <Text style={[s.selectText, !data.regionGroup && s.selectPlaceholder]}>
            {data.regionGroup || '— Süden / Norden —'}
          </Text>
          <Text style={s.selectArrow}>▾</Text>
        </TouchableOpacity>
        {regionGroupOpen && (
          <View style={s.dropdown}>
            {Object.keys(REGION_CITIES).map(g => (
              <TouchableOpacity key={g} style={[s.dropItem, data.regionGroup === g && s.dropItemActive]}
                onPress={() => { set({ regionGroup: g, region: '' }); setRegionGroupOpen(false); }}>
                <Text style={s.dropItemText}>{g}</Text>
                {data.regionGroup === g && <Text style={s.dropCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {data.regionGroup !== '' && (
        <View style={s.fieldWrap}>
          <FieldLabel text="Stadt" required />
          <TouchableOpacity style={s.select} onPress={() => { setCityOpen(!cityOpen); setRegionGroupOpen(false); setCatOpen(false); }}>
            <Text style={[s.selectText, !data.region && s.selectPlaceholder]}>
              {data.region || '— Stadt wählen —'}
            </Text>
            <Text style={s.selectArrow}>▾</Text>
          </TouchableOpacity>
          {cityOpen && (
            <View style={s.dropdown}>
              {cities.map(c => (
                <TouchableOpacity key={c} style={[s.dropItem, data.region === c && s.dropItemActive]}
                  onPress={() => { set({ region: c }); setCityOpen(false); }}>
                  <Text style={s.dropItemText}>{c}</Text>
                  {data.region === c && <Text style={s.dropCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      <Input label="Straße & Hausnummer" placeholder="z.B. Makariou Avenue 45"
        value={data.street} onChange={(v: string) => set({ street: v })} />

      <View style={s.row2}>
        <View style={{ flex: 1 }}>
          <Input label="Postleitzahl" required={data.locationType === 'local'}
            placeholder="z.B. 5309" value={data.plz}
            onChange={(v: string) => set({ plz: v })} keyboardType="numeric" />
        </View>
        <View style={{ flex: 2 }}>
          <Input label="Ort" required={data.locationType === 'local'}
            placeholder="z.B. Pernera, Kapparis..." value={data.city}
            onChange={(v: string) => set({ city: v })} />
        </View>
      </View>

      <Input label="Google Maps Link" placeholder="https://maps.google.com/..."
        value={data.mapsLink} onChange={(v: string) => set({ mapsLink: v })} />
      <Text style={s.hint}>Öffnen Sie Ihren Standort in Google Maps, tippen Sie auf "Teilen" und fügen Sie den Link hier ein.</Text>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ── Step 2: Kontakt ──────────────────────────────────────────────
function Step2({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  const toggleLang = (code: string) => {
    const langs = data.languages.includes(code)
      ? data.languages.filter(l => l !== code)
      : [...data.languages, code];
    set({ languages: langs });
  };

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.sectionTitle}>Kontaktdaten</Text>
      <Text style={s.sectionSub}>Wie können Kunden Sie erreichen?</Text>

      <Input label="Telefon" required placeholder="+357 99 000 000"
        value={data.phone} onChange={(v: string) => set({ phone: v })} keyboardType="phone-pad" />

      <View style={s.fieldWrap}>
        <Text style={s.fieldLabel}>WhatsApp <Text style={{ color: '#aaa', fontWeight: '400' }}>(optional)</Text></Text>
        <TextInput
          style={s.input}
          placeholder="+357 99 000 000"
          placeholderTextColor="#bbb"
          value={data.whatsapp}
          onChangeText={(v: string) => set({ whatsapp: v })}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={s.hint}>Lassen Sie dieses Feld frei, wenn WhatsApp = Telefon.</Text>
      </View>

      <Input label="Geschäfts-E-Mail" placeholder="info@firma.cy"
        value={data.email} onChange={(v: string) => set({ email: v })} keyboardType="email-address" />
      <Input label="Webseite" placeholder="https://www.firma.cy"
        value={data.website} onChange={(v: string) => set({ website: v })} />

      <Text style={s.sectionTitle}>Öffnungszeiten</Text>
      <Text style={s.sectionSub}>Wann ist Ihr Unternehmen geöffnet?</Text>
      <Input placeholder="Mo-Fr 09:00-17:00"
        value={data.openingHours} onChange={(v: string) => set({ openingHours: v })} />

      <Text style={s.sectionTitle}>Sprachen</Text>
      <Text style={s.sectionSub}>In welchen Sprachen bieten Sie Ihre Leistungen an?</Text>
      <View style={s.langGrid}>
        {LANGUAGES_AVAILABLE.map(lang => (
          <TouchableOpacity key={lang.code}
            style={[s.langChip, data.languages.includes(lang.code) && s.langChipActive]}
            onPress={() => toggleLang(lang.code)}>
            <Text style={[s.langChipText, data.languages.includes(lang.code) && s.langChipTextActive]}>
              {lang.code}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ── Step 3: Beschreibung ─────────────────────────────────────────
function Step3({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.sectionTitle}>Kurzbeschreibung</Text>
      <Text style={s.sectionSub}>Ein Satz der in der Listenansicht erscheint (max. 120 Zeichen).</Text>
      <View style={s.fieldWrap}>
        <TextInput
          style={s.input}
          placeholder="z.B. Ihr Elektriker in Paphos – schnell, zuverlässig, mehrsprachig."
          placeholderTextColor="#bbb"
          value={data.shortDesc}
          onChangeText={v => set({ shortDesc: v })}
          maxLength={120}
        />
        <Text style={s.charCount}>{data.shortDesc.length}/120</Text>
      </View>

      <Text style={s.sectionTitle}>Vollständige Beschreibung</Text>
      <Text style={s.sectionSub}>Beschreiben Sie Ihr Unternehmen ausführlich (min. 100 Zeichen empfohlen).</Text>
      <View style={s.fieldWrap}>
        <TextInput
          style={[s.input, s.inputMulti]}
          placeholder="Beschreiben Sie Ihre Leistungen, Ihre Erfahrung, was Sie von der Konkurrenz unterscheidet..."
          placeholderTextColor="#bbb"
          value={data.description}
          onChangeText={v => set({ description: v })}
          multiline
          numberOfLines={6}
        />
        <Text style={s.charCount}>{data.description.length} Zeichen</Text>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ── Step 4: Zahlung ──────────────────────────────────────────────
const PLANS = [
  {
    id: 'free', icon: '🆓', label: 'Kostenlos', price: '0€/Monat',
    features: ['1 Basiseintrag', 'Kategorie & Kontakt', 'Kein Foto', '30 Tage aktiv'],
    color: '#27AE60',
  },
  {
    id: 'standard', icon: '⭐', label: 'Standard', price: '9,90€/Monat',
    features: ['Erweiterter Eintrag', 'Bis zu 5 Fotos', 'Hervorgehoben in Kategorie', 'Unbegrenzt aktiv'],
    color: Colors.primary,
  },
  {
    id: 'premium', icon: '👑', label: 'Premium', price: '24,90€/Monat',
    features: ['Alles aus Standard', 'Top-Platzierung', 'WhatsApp-Button', 'Statistiken & Analytics'],
    color: '#D4891A',
  },
];

function Step4({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.sectionTitle}>Paket wählen</Text>
      <Text style={s.sectionSub}>Wählen Sie das Paket, das zu Ihrem Unternehmen passt.</Text>

      {PLANS.map(plan => (
        <TouchableOpacity key={plan.id}
          style={[s.planCard, data.plan === plan.id && { borderColor: plan.color, borderWidth: 2 }]}
          onPress={() => set({ plan: plan.id as FormData['plan'] })}>
          <View style={s.planHeader}>
            <Text style={s.planIcon}>{plan.icon}</Text>
            <View style={s.planInfo}>
              <Text style={s.planLabel}>{plan.label}</Text>
              <Text style={[s.planPrice, { color: plan.color }]}>{plan.price}</Text>
            </View>
            <View style={[s.planRadio, data.plan === plan.id && { borderColor: plan.color }]}>
              {data.plan === plan.id && <View style={[s.planRadioDot, { backgroundColor: plan.color }]} />}
            </View>
          </View>
          <View style={s.planFeatures}>
            {plan.features.map(f => (
              <View key={f} style={s.planFeatureRow}>
                <Text style={[s.planFeatureCheck, { color: plan.color }]}>✓</Text>
                <Text style={s.planFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      <View style={s.summaryCard}>
        <Text style={s.summaryTitle}>Zusammenfassung</Text>
        <Text style={s.summaryLine}>Mit dem Absenden stimmen Sie unseren AGB zu.</Text>
        <Text style={s.summaryLine}>Sie erhalten eine Bestätigungs-E-Mail nach dem Absenden.</Text>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ── Main Screen ──────────────────────────────────────────────────
export default function SubmitScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INIT);
  const [submitted, setSubmitted] = useState(false);

  const set = (d: Partial<FormData>) => setData(prev => ({ ...prev, ...d }));

  const canNext = () => {
    if (step === 0) return data.companyName.trim() && data.category && data.regionGroup && data.region;
    if (step === 1) return data.phone.trim().length > 0 || data.email.trim().length > 0;
    if (step === 2) return data.shortDesc.trim().length > 10;
    return true;
  };

  const handleBack = () => {
    if (step === 0) router.back();
    else setStep(step - 1);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.successWrap}>
          <Text style={s.successIcon}>🎉</Text>
          <Text style={s.successTitle}>Eintrag eingereicht!</Text>
          <Text style={s.successSub}>
            Vielen Dank, {data.companyName}!{'\n'}
            Ihr Eintrag wird geprüft und innerhalb von 24 Stunden freigeschaltet.
          </Text>
          <TouchableOpacity style={s.successBtn} onPress={() => { setData(INIT); setStep(0); setSubmitted(false); }}>
            <Text style={s.successBtnText}>Weiteren Eintrag erstellen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={handleBack}>
          <Text style={s.backText}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Eintrag erstellen</Text>
        <View style={s.headerSpacer} />
      </View>

      <StepIndicator current={step} />

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {step === 0 && <Step1 data={data} set={set} />}
        {step === 1 && <Step2 data={data} set={set} />}
        {step === 2 && <Step3 data={data} set={set} />}
        {step === 3 && <Step4 data={data} set={set} />}
      </View>

      {/* Footer button */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, !canNext() && s.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canNext()}
        >
          <Text style={s.nextBtnText}>
            {step < 3 ? `Weiter →` : '✓ Eintrag absenden'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },

  header: {
    backgroundColor: Colors.primary, padding: 16, paddingTop: 20,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { paddingRight: 12, minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  headerSpacer: { minWidth: 70 },

  stepRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E0E0E0', marginBottom: 18 },
  stepLineDone: { backgroundColor: Colors.primary },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    borderColor: '#E0E0E0', backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  stepActive: { borderColor: Colors.primary },
  stepDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepCircleText: { fontSize: 12, fontWeight: '700', color: '#ccc' },
  stepCircleTextActive: { color: Colors.primary },
  stepLabel: { fontSize: 10, color: '#aaa', fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },

  scroll: { flex: 1 },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.primary, marginTop: 16, marginBottom: 2 },
  sectionSub: { fontSize: 12, color: '#888', marginBottom: 12 },

  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  required: { color: '#E74C3C' },
  input: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1A1A2E', backgroundColor: '#fff',
  },
  inputMulti: { height: 120, textAlignVertical: 'top', paddingTop: 12 },
  charCount: { fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 4 },
  hint: { fontSize: 11, color: '#aaa', marginBottom: 12, lineHeight: 16 },

  select: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between',
  },
  selectText: { fontSize: 14, color: '#1A1A2E' },
  selectPlaceholder: { color: '#aaa' },
  selectArrow: { color: '#aaa', fontSize: 14 },
  dropdown: {
    borderWidth: 1, borderColor: '#E0E0E8', borderRadius: 12,
    backgroundColor: '#fff', marginTop: 4,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
    zIndex: 99,
  },
  dropItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F8', flexDirection: 'row', justifyContent: 'space-between' },
  dropItemActive: { backgroundColor: Colors.primary + '10' },
  dropItemText: { fontSize: 14, color: '#1A1A2E' },
  dropCheck: { color: Colors.primary, fontWeight: '700' },

  typeCard: {
    borderWidth: 1.5, borderColor: '#E0E0E8', borderRadius: 14,
    padding: 14, marginBottom: 10, flexDirection: 'row', gap: 12,
    backgroundColor: '#fff',
  },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  typeRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  typeRadioActive: { borderColor: Colors.primary },
  typeRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  typeText: { flex: 1 },
  typeTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  typeSub: { fontSize: 11, color: '#888', lineHeight: 16 },

  row2: { flexDirection: 'row', gap: 10 },

  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  langChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E8', backgroundColor: '#fff' },
  langChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  langChipText: { fontSize: 13, fontWeight: '700', color: '#666' },
  langChipTextActive: { color: '#fff' },

  planCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#E0E0E8',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  planIcon: { fontSize: 28 },
  planInfo: { flex: 1 },
  planLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  planPrice: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  planRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  planRadioDot: { width: 12, height: 12, borderRadius: 6 },
  planFeatures: { gap: 6 },
  planFeatureRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  planFeatureCheck: { fontWeight: '700', fontSize: 14 },
  planFeatureText: { fontSize: 13, color: '#555' },

  summaryCard: { backgroundColor: '#EAF5F0', borderRadius: 14, padding: 16, marginTop: 8 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#27AE60', marginBottom: 6 },
  summaryLine: { fontSize: 12, color: '#555', lineHeight: 18 },

  footer: { padding: 16, paddingBottom: 20 },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: '#C0C0C0' },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16 },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  successSub: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
  successBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 10 },
  successBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
