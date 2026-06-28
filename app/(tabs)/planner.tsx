import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

type Message = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Du bist ein persönlicher Reise- und Urlaubsplaner speziell für Zypern.
Du kennst die Insel in- und auswendig: Strände, Sehenswürdigkeiten, Restaurants, historische Stätten, Wanderwege, lokale Tipps, Öffnungszeiten, Preise und praktische Reisehinweise – sowohl für Südzypern als auch Nordzypern.
Antworte auf Deutsch, freundlich, konkret und strukturiert. Wenn der Nutzer seinen Standort nennt, plane von dort aus.
Erstelle Tagespläne mit Uhrzeiten, Anfahrt-Tipps, Restaurantempfehlungen und Insider-Hinweisen.
Halte Antworten übersichtlich – nutze Emojis, Listen und klare Abschnitte.`;

async function askClaude(messages: Message[], signal: AbortSignal): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message ?? `Fehler ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

const SUGGESTIONS = [
  '📍 Ich bin in Nikosia – plane mir einen Tagesausflug',
  '🏖️ Die schönsten Strände im Süden für Familien',
  '🏰 Historische Sehenswürdigkeiten in Famagusta',
  '🥗 Typisch zyprische Gerichte – was muss ich probieren?',
  '🚗 Roadtrip durch Zypern in 7 Tagen',
  '🌄 Wandern im Troodos-Gebirge – beste Routen',
];

export default function PlannerScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng } = pos.coords;
          let loc = 'Zypern';
          if (lat > 35.12) loc = 'Nordzypern';
          else if (lng < 32.8) loc = 'Paphos-Region';
          else if (lng < 33.2) loc = 'Limassol-Region';
          else if (lng < 33.7) loc = 'Nikosia-Region / Larnaka';
          else loc = 'Ayia Napa / Protaras';
          setLocation(loc);
        },
        () => null
      );
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');

    const locationPrefix = location && !messages.length
      ? `[Mein aktueller Standort: ${location}]\n\n` : '';
    const userMsg: Message = { role: 'user', content: locationPrefix + q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    abortRef.current = new AbortController();
    try {
      const reply = await askClaude(newMessages, abortRef.current.signal);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: API_KEY && API_KEY !== 'DEIN_API_KEY_HIER_EINTRAGEN'
            ? `❌ Fehler: ${e.message}`
            : '⚠️ Kein API-Key konfiguriert. Bitte in der `.env`-Datei `EXPO_PUBLIC_ANTHROPIC_API_KEY` setzen.',
        }]);
      }
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Spracheingabe wird von diesem Browser nicht unterstützt.'); return; }
    const rec = new SR();
    rec.lang = 'de-DE';
    rec.continuous = false;
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
  }

  return (
    <SafeAreaView style={s.safe}>
      <AppHeader />

      <View style={s.subHeader}>
        <View style={s.subHeaderRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>🌴 Urlaubsplaner</Text>
          <TouchableOpacity style={s.clearBtn} onPress={clearChat}>
            <Text style={s.clearBtnText}>Neu</Text>
          </TouchableOpacity>
        </View>
        {location && (
          <Text style={s.locationBadge}>📍 {location} erkannt</Text>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={s.chat}
          contentContainerStyle={s.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={s.welcome}>
              <Text style={s.welcomeEmoji}>🌴</Text>
              <Text style={s.welcomeTitle}>Dein KI-Reiseplaner für Zypern</Text>
              <Text style={s.welcomeSub}>
                Frag mich nach Tagesausflügen, Stränden, Sehenswürdigkeiten oder lass mich deinen Urlaub komplett planen.
              </Text>
              <View style={s.suggestions}>
                {SUGGESTIONS.map(sug => (
                  <TouchableOpacity key={sug} style={s.sugChip} onPress={() => send(sug)}>
                    <Text style={s.sugChipText}>{sug}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((m, i) => (
            <View key={i} style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
              {m.role === 'assistant' && (
                <View style={s.botAvatar}><Text style={s.botAvatarText}>🌴</Text></View>
              )}
              <View style={[s.bubbleBody, m.role === 'user' ? s.bubbleBodyUser : s.bubbleBodyBot]}>
                <Text style={[s.bubbleText, m.role === 'user' ? s.bubbleTextUser : s.bubbleTextBot]}>
                  {m.content}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={[s.bubble, s.bubbleBot]}>
              <View style={s.botAvatar}><Text style={s.botAvatarText}>🌴</Text></View>
              <View style={[s.bubbleBody, s.bubbleBodyBot]}>
                <ActivityIndicator color={Colors.primary} size="small" />
                <Text style={s.thinkingText}>Plane deinen Urlaub...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={s.inputRow}>
          <TouchableOpacity
            style={[s.voiceBtn, listening && s.voiceBtnActive]}
            onPress={startVoice}
          >
            <Text style={s.voiceBtnIcon}>{listening ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder={listening ? 'Höre zu...' : 'Wohin soll die Reise gehen?'}
            placeholderTextColor="#aaa"
            multiline
            maxLength={500}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]}
            onPress={() => send()}
            disabled={!input.trim() || loading}
          >
            <Text style={s.sendBtnIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F4FA' },

  subHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingBottom: 12, marginTop: -1,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { minWidth: 60 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  subHeaderTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  clearBtn: { minWidth: 60, alignItems: 'flex-end' },
  clearBtnText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  locationBadge: {
    color: 'rgba(255,255,255,0.8)', fontSize: 11, textAlign: 'center', marginTop: 4,
  },

  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },

  welcome: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  welcomeEmoji: { fontSize: 52, marginBottom: 10 },
  welcomeTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', textAlign: 'center', marginBottom: 6 },
  welcomeSub: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10, marginBottom: 20 },
  suggestions: { width: '100%', gap: 8 },
  sugChip: {
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderWidth: 1.5, borderColor: '#D0D8E8',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sugChipText: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },

  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleUser: { flexDirection: 'row-reverse' },
  bubbleBot: {},
  botAvatar: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
  },
  botAvatarText: { fontSize: 16 },
  bubbleBody: { maxWidth: '80%', borderRadius: 18, padding: 12 },
  bubbleBodyUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleBodyBot: {
    backgroundColor: '#fff', borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextBot: { color: '#1A1A2E' },
  thinkingText: { fontSize: 12, color: '#888', fontStyle: 'italic' },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 12, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#EEF0F5',
  },
  voiceBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: '#F0F4FA', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#D0D8E8',
  },
  voiceBtnActive: { backgroundColor: '#FFE8E8', borderColor: '#e74c3c' },
  voiceBtnIcon: { fontSize: 20 },
  input: {
    flex: 1, backgroundColor: '#F0F4FA', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#1A1A2E',
    maxHeight: 100, borderWidth: 1.5, borderColor: '#D0D8E8',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#C5D0E0' },
  sendBtnIcon: { color: '#fff', fontSize: 18 },
});
