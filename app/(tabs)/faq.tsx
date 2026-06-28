import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

const CATEGORIES = ['Alle', 'Reisen', 'Nordzypern', 'Alltag', 'Auswandern', 'Steuern', 'Unternehmen', 'Haustiere'];

const FAQ_DATA: FaqItem[] = [
  // ── REISEN ──────────────────────────────────────────────────────────
  {
    category: 'Reisen',
    question: 'Wann ist die beste Reisezeit für Zypern?',
    answer: 'Die beste Reisezeit ist April bis Juni sowie September bis Oktober. Das Wetter ist dann angenehm warm (25–30 °C), ohne die extreme Sommerhitze. Juli und August sind mit bis zu 40 °C sehr heiß. Für Strandurlaub eignet sich Mai bis Oktober ideal, für Kultur und Wandern auch der Winter.',
  },
  {
    category: 'Reisen',
    question: 'Wie warm wird es im Sommer in Zypern?',
    answer: 'Zypern ist eines der heißesten Länder Europas. Im Juli und August liegen die Temperaturen regelmäßig zwischen 35 und 42 °C, besonders im Landesinneren. An der Küste kühlen Meeresbriesen etwas ab. Das Mittelmeer hat im Sommer angenehme 27–28 °C Wassertemperatur.',
  },
  {
    category: 'Reisen',
    question: 'Welche Strände sind die schönsten in Zypern?',
    answer: 'Zu den bekanntesten und schönsten Stränden zählen: Nissi Beach (Ayia Napa) – feiner weißer Sand, türkisfarbenes Wasser; Fig Tree Bay (Protaras) – sehr ruhig und familienfreundlich; Coral Bay (Paphos) – breiter Sandstrand mit guter Infrastruktur; Governor\'s Beach (Limassol) – dunkle Felsen und klares Wasser; Lara Beach (Paphos) – wild und unberührt, Nistplatz für Meeresschildkröten.',
  },
  {
    category: 'Reisen',
    question: 'Wo kann man in Zypern schnorcheln?',
    answer: 'Besonders gute Schnorchelspots: Cape Greco (Naturpark nahe Ayia Napa) – spektakuläre Felsbuchten und Höhlen; Blue Lagoon bei Akamas – kristallklares Wasser; Governor\'s Beach – interessante Felsformationen; Coral Bay – ruhiges Wasser ideal für Anfänger. Das Mittelmeer ist bis zu 50 m sichtig.',
  },
  {
    category: 'Reisen',
    question: 'Welche Sehenswürdigkeiten sollte man besuchen?',
    answer: 'Must-Sees auf Zypern: Kourion (antikes Theater mit Meerblick), Aphrodite-Felsen (Geburtsort der Göttin), Kloster Kykkos (prachtreichstes Kloster der Insel), Troodos-Gebirge mit UNESCO-Kirchen, Altstadt von Nikosia (geteilte Hauptstadt), Tombs of the Kings (Paphos), Bellapais-Kloster (Nordzypern), Mittelalterliche Burgen Kyrenia und Kolossi.',
  },
  {
    category: 'Reisen',
    question: 'Welche Flughäfen gibt es in Zypern?',
    answer: 'Die Republik Zypern hat zwei internationale Flughäfen: Larnaka International Airport (LCA) – größter Flughafen, Hauptdrehkreuz; Paphos International Airport (PFO) – besonders für Urlauber aus Europa. Nordzypern hat den Flughafen Ercan (ECN), der jedoch nur über die Türkei angeflogen werden kann, da er international nicht anerkannt wird.',
  },
  {
    category: 'Reisen',
    question: 'Brauche ich einen Reisepass für Zypern?',
    answer: 'EU-Bürger (Deutsche, Österreicher, Schweizer) benötigen für die Republik Zypern nur einen gültigen Personalausweis. Für Nordzypern empfiehlt sich der Reisepass, da der Einreisestempel separat gegeben werden kann, was Probleme bei späteren Reisen in andere Länder vermeiden kann. Drittstaatler benötigen grundsätzlich einen gültigen Reisepass.',
  },
  {
    category: 'Reisen',
    question: 'Wie teuer ist ein Urlaub in Zypern?',
    answer: 'Zypern ist im EU-Vergleich mittelpreisig. Grobe Richtwerte pro Person/Tag: Budget (Hostel, einfach essen): 50–70 €; Mittelklasse (Hotel 3–4 Sterne, Restaurant): 100–150 €; Komfort (4–5 Sterne): 200–350 €. Mietwagen ab ca. 25–40 €/Tag. Essen im Restaurant: Hauptgericht 10–18 €, Gyros/Souvlaki ab 3–5 €. Bier in Bar: 2,50–4 €.',
  },
  {
    category: 'Reisen',
    question: 'Welche Orte eignen sich für Familien?',
    answer: 'Familienfreundliche Regionen: Paphos – ruhig, viel Kultur, schöne Strände; Protaras / Fig Tree Bay – flaches Wasser, ideal für Kinder; Limassol – guter Mix aus Strand und Stadtleben, großer Wasserpark. Empfohlene Aktivitäten: Aphrodite Waterpark (Paphos), WaterWorld (Ayia Napa), Camel Park (Mazotos), Troodos-Ausflüge und Wandern.',
  },
  {
    category: 'Reisen',
    question: 'Was sollte man auf Zypern unbedingt erleben?',
    answer: 'Absolut empfehlenswert: Sonnenuntergang am Aphrodite-Felsen, Halloumi und Meze in einer Taverne probieren, Kloster Kykkos besuchen, Jeep-Tour durch das Troodos-Gebirge, Bootsfahrt zur Blauen Lagune bei Akamas, Tagesausflug nach Nordzypern (Kyrenia / Buffavento), Fischerhafen von Latchi erkunden und frischen Fisch essen.',
  },

  // ── NORDZYPERN ──────────────────────────────────────────────────────
  {
    category: 'Nordzypern',
    question: 'Wie funktioniert die Einreise nach Nordzypern?',
    answer: 'Es gibt mehrere offizielle Grenzübergänge (Checkpoints) zwischen der Republik Zypern und dem von der Türkei kontrollierten Norden. Die bekanntesten sind: Ledra Palace / Ledra Street (Nikosia), Agios Dometios, Strovilia. EU-Bürger können mit Personalausweis einreisen. Der Stempel wird auf einem separaten Blatt gegeben, um keinen regulären Passstempel zu erhalten.',
  },
  {
    category: 'Nordzypern',
    question: 'Kann ich die Grenze nach Nordzypern überqueren?',
    answer: 'Ja, seit 2003 können EU-Bürger und Touristen die Grenze frei überqueren. Es gibt offizielle Checkpoints in Nikosia (Ledra Street), Strovilia und anderen Orten. Personalausweis oder Reisepass genügen. Man kann problemlos für einen Tagesausflug nach Nordzypern und wieder zurück.',
  },
  {
    category: 'Nordzypern',
    question: 'Ist Nordzypern sicher?',
    answer: 'Nordzypern gilt als sehr sicher – die Kriminalitätsrate ist niedrig, und Touristen werden herzlich willkommen geheißen. Es gibt keine aktuellen Sicherheitsbedenken. Kyrenia (Girne) und Famagusta (Gazimağusa) sind beliebte Reiseziele. Wie überall sollte man auf Taschendiebe in Touristenbereichen achten.',
  },
  {
    category: 'Nordzypern',
    question: 'Welche Währung wird in Nordzypern genutzt?',
    answer: 'In Nordzypern ist die offizielle Währung die türkische Lira (TRY). Euro werden in vielen touristischen Betrieben akzeptiert, manchmal auch britische Pfund. Es empfiehlt sich, Lira am Flughafen oder in Wechselstuben zu tauschen. EC-Karten funktionieren an den meisten Geldautomaten, Kreditkarten werden in Hotels und größeren Restaurants akzeptiert.',
  },
  {
    category: 'Nordzypern',
    question: 'Darf ich mit dem Mietwagen nach Nordzypern fahren?',
    answer: 'Das ist komplizierter als gedacht: Viele Mietwagenunternehmen in der Republik Zypern verbieten es vertraglich, das Fahrzeug nach Nordzypern zu fahren. Bei Verstoß erlischt die Versicherung. Besser: An einem Checkpoint zu Fuß überqueren und dort ein lokales Auto mieten, oder ein Unternehmen wählen, das Fahrten nach Nordzypern ausdrücklich erlaubt.',
  },
  {
    category: 'Nordzypern',
    question: 'Brauche ich eine Versicherung für Nordzypern?',
    answer: 'Ja! Die normale zypriotische KFZ-Versicherung gilt nicht in Nordzypern. An den Grenzübergängen kann man eine lokale Tagesversicherung abschließen (ca. 10–15 €). Für Krankenversicherung: Die EHIC (EU-Krankenversicherungskarte) gilt in Nordzypern nicht, da es kein EU-Gebiet ist. Private Reiseversicherung dringend empfehlenswert.',
  },
  {
    category: 'Nordzypern',
    question: 'Kann ich in Nordzypern Immobilien kaufen?',
    answer: 'Vorsicht ist geboten: Viele Grundstücke in Nordzypern wurden nach 1974 von griechisch-zypriotischen Vorbesitzern enteignet. Der Kauf solcher Immobilien ist rechtlich sehr riskant – die EU erkennt Eigentumsrechte nicht an. Manche Experten raten davon ab. Es gibt jedoch auch neu gebaute Immobilien ohne Altlasten. Unbedingt einen unabhängigen Anwalt einschalten.',
  },
  {
    category: 'Nordzypern',
    question: 'Kann ich in Nordzypern wohnen?',
    answer: 'EU-Bürger können in Nordzypern wohnen, müssen sich aber bei lokalen Behörden registrieren. Da Nordzypern kein EU-Mitglied ist, genießt man dort keine EU-Bürgerrechte. Aufenthaltserlaubnisse werden nach lokalen türkisch-zypriotischen Regelungen vergeben. Für Langzeitaufenthalte empfiehlt sich eine rechtliche Beratung.',
  },
  {
    category: 'Nordzypern',
    question: 'Ist Nordzypern günstiger als der Süden?',
    answer: 'Ja, Nordzypern ist in der Regel 30–50 % günstiger als die Republik Zypern. Restaurants, Unterkünfte und Alltagsprodukte kosten deutlich weniger. Das liegt am niedrigeren Lebensstandard und an der türkischen Lira. Immobilien sind ebenfalls günstiger, aber der Kauf birgt rechtliche Risiken (s. Frage zu Immobilien).',
  },

  // ── ALLTAG ──────────────────────────────────────────────────────────
  {
    category: 'Alltag',
    question: 'Wie gut ist das Mobilfunknetz in Zypern?',
    answer: 'Das Mobilfunknetz ist gut ausgebaut. Die drei Hauptanbieter sind Cyta (staatlich, größte Netzabdeckung), MTN Cyprus und Epic. 4G/LTE ist flächendeckend verfügbar, 5G wird ausgebaut. In Städten und Touristengebieten ist das Netz sehr zuverlässig. Im Troodos-Gebirge und ländlichen Gebieten kann der Empfang schwächer sein.',
  },
  {
    category: 'Alltag',
    question: 'Welche Banken sind in Zypern empfehlenswert?',
    answer: 'Große Banken in Zypern: Bank of Cyprus (größte Bank, weit verbreitet), Hellenic Bank (zweite große Bank, gutes Filialnetz), AstroBank, RCB Bank. Für EU-Ausländer und Auswanderer empfiehlt sich die Bank of Cyprus oder Hellenic Bank. Für internationale Transaktionen sind auch Revolut und Wise sehr beliebt als Ergänzung.',
  },
  {
    category: 'Alltag',
    question: 'Wie eröffne ich ein Bankkonto in Zypern?',
    answer: 'Benötigte Dokumente: Reisepass oder Personalausweis, Meldeadresse in Zypern (Mietvertrag oder Versorgerrechnung), Steuernummer (TIN) aus dem Heimatland, Einkommensnachweis oder Beschäftigungsnachweis. Einige Banken verlangen persönliches Erscheinen. Die Eröffnung dauert meist 1–2 Wochen. Für Nichtansässige ist es schwieriger – ein lokaler Anwalt kann helfen.',
  },
  {
    category: 'Alltag',
    question: 'Kann ich Revolut in Zypern nutzen?',
    answer: 'Ja, Revolut funktioniert in Zypern problemlos und ist sehr beliebt, besonders bei Expats und jüngeren Zyprioten. Zahlungen per Karte und Kontaktlos-Zahlung sind weit verbreitet. Revolut eignet sich gut für den Alltag und Auslandsüberweisungen. Für offizielle Behördengänge oder Wohnungsmiete braucht man aber meist ein lokales Bankkonto.',
  },
  {
    category: 'Alltag',
    question: 'Wie sicher ist Zypern?',
    answer: 'Zypern gehört zu den sichersten Ländern Europas. Die Gewaltkriminalität ist sehr niedrig. Touristen und Expats fühlen sich in der Regel sehr sicher, auch nachts. Frauen können allein reisen ohne besondere Vorsichtsmaßnahmen. Wie überall sollte man auf Taschendiebe in belebten Touristengebieten achten und Wertsachen am Strand nicht unbeaufsichtigt lassen.',
  },
  {
    category: 'Alltag',
    question: 'Wie ist die Kriminalität in Zypern?',
    answer: 'Die Kriminalitätsrate in Zypern ist eine der niedrigsten in der EU. Gewaltverbrechen sind selten. Häufigere Vorfälle: Taschendiebstahl in Touristenbereichen, Einbrüche in Ferienwohnungen (besonders bei offen gelassenen Fenstern/Türen), Verkehrsdelikte. Insgesamt ist Zypern für Familien, Alleinreisende und Expats sehr sicher.',
  },
  {
    category: 'Alltag',
    question: 'Wie ist das Wetter im Winter in Zypern?',
    answer: 'Der zypriotische Winter (Dezember–Februar) ist mild und angenehm: Temperaturen tagsüber 15–20 °C, nachts 8–12 °C. Es regnet mehr als im Sommer, aber es gibt viele sonnige Tage. Schnee fällt nur im Troodos-Gebirge (über 1500 m). Für Spaziergänge, Kultur und ruhige Erholung ist der Winter ideal – ohne Touristenmassen und zu erschwinglichen Preisen.',
  },
  {
    category: 'Alltag',
    question: 'Welche Sprachen werden in Zypern gesprochen?',
    answer: 'Amtssprachen in der Republik Zypern sind Griechisch und Türkisch. Englisch ist praktisch überall verständlich – Zypern war bis 1960 britische Kolonie. In touristischen Bereichen sprechen fast alle Dienstleister Englisch. Deutsch wird in einigen Hotels und bei deutschen Expat-Communities gesprochen, ist aber keine verbreitete Fremdsprache.',
  },
  {
    category: 'Alltag',
    question: 'Wie funktioniert das Gesundheitssystem in Zypern?',
    answer: 'Seit 2019 gibt es das staatliche GESY-System (Allgemeine Gesundheitsversorgung). EU-Bürger mit Wohnsitz in Zypern haben Zugang zu GESY. Notfall: Ruf 112 (europaweiter Notruf) oder 1426 (Gesundheitsministerium). Staatliche Krankenhäuser in Nikosia, Limassol, Larnaka, Paphos und Paralimni. Private Krankenhäuser (z. B. Apollonion Nikosia, Mediterranean Hospital Limassol) bieten oft schnellere Versorgung.',
  },

  // ── AUSWANDERN ──────────────────────────────────────────────────────
  {
    category: 'Auswandern',
    question: 'Was muss ich bei der Auswanderung nach Zypern beachten?',
    answer: 'Wichtigste Schritte: 1. Wohnsitz anmelden bei der lokalen Gemeindeverwaltung, 2. Aufenthaltsgenehmigung (Registration Certificate for EU Citizens) beantragen beim Migrationsamt, 3. Steuernummer beantragen (TIN), 4. Krankenversicherung organisieren (GESY oder privat), 5. Bankkonto eröffnen, 6. Abmeldung in Deutschland (optional, aber steuerlich relevant). Ein lokaler Anwalt oder Steuerberater ist empfehlenswert.',
  },
  {
    category: 'Auswandern',
    question: 'Was ist die 60-Tage-Regel?',
    answer: 'Die 60-Tage-Regel (bis 2025) ermöglichte es, in Zypern steuerlich ansässig zu werden, wenn man mindestens 60 Tage pro Jahr dort verbrachte, keinen steuerlichen Wohnsitz in einem anderen Land hatte und geschäftlich tätig war. Diese Regelung wurde als Teil der Steuerreform 2026 abgeschafft.',
  },
  {
    category: 'Auswandern',
    question: 'Was ändert sich durch die Steuerreform 2026?',
    answer: 'Ab 2026 basiert die steuerliche Ansässigkeit nicht mehr auf der Mindestaufenthaltsdauer, sondern auf dem „Center of Life": dauerhafter Wohnsitz in Zypern, familiäre Bindungen, wirtschaftliche Aktivitäten im Land sowie korrekte Registrierung bei zypriotischen Behörden. Man muss nicht mehr zählen, wie viele Tage man in Zypern verbracht hat. Das gibt mehr Flexibilität bei Reisen.',
  },
  {
    category: 'Auswandern',
    question: 'Wie finde ich eine Wohnung in Zypern?',
    answer: 'Beste Quellen für Wohnungssuche: Bazaraki.com (größte Kleinanzeigenplattform Zyperns, ähnlich wie eBay-Kleinanzeigen), lokale Facebook-Gruppen (z. B. „Expats in Cyprus"), lokale Immobilienmakler vor Ort. Empfohlene deutschsprachige Makler: Branka Djonkovich (Ayia Napa, +357 99 408295), Cyprus Resales Group (Paphos, Tel. 26 102242), DemPro Real Estate (Paphos, Tel. 99 494090).',
  },
  {
    category: 'Auswandern',
    question: 'Welche Dokumente brauche ich für die Anmeldung in Zypern?',
    answer: 'Für EU-Bürger benötigt: gültiger Personalausweis oder Reisepass, Nachweis der Unterkunft (Mietvertrag oder Eigentumsnachweis), Einkommensnachweis oder Nachweis ausreichender Mittel, Krankenversicherungsnachweis. Für das EU-Registration Certificate zusätzlich: Antragsformular beim Migrationsamt, Lichtbilder. Die Bearbeitungszeit beträgt ca. 2–4 Wochen.',
  },
  {
    category: 'Auswandern',
    question: 'Wo finde ich deutschsprachige Ärzte in Zypern?',
    answer: 'Deutschsprachige Ärzte gibt es in allen größeren Städten. Beispiele: Limassol: Dr. med. Alexander Calatzis (Psychiatrie, +357 95 599401), Dr. Andreas Colios (Zahnarzt, +357 25 361121); Nikosia: Dr. Michaela Kaiser (Allgemeinmedizin, +357 22 777330), Dr. Nicos Danos (Innere Medizin, +357 22 755610); Paphos: Dr. Andreas Petrides (Allgemein/Pädiatrie, +357 26 934165). Notruf: 112.',
  },
  {
    category: 'Auswandern',
    question: 'Wo finde ich Jobs in Zypern?',
    answer: 'Job-Portale für Zypern: CyprusJobs.com (nach Städten sortiert), JobInCyprus.com (alle Branchen), Carierista.com (für Arbeitgeber & Bewerber), Ergodotisi.com (über 15.000 Firmen), Kariera.com.cy (breite Auswahl). Für deutschsprachige Positionen auch direkt bei deutschen Unternehmen auf Zypern anfragen oder LinkedIn nutzen.',
  },

  // ── STEUERN ─────────────────────────────────────────────────────────
  {
    category: 'Steuern',
    question: 'Wie hoch ist die Einkommensteuer in Zypern?',
    answer: 'Zypern hat eine progressive Einkommensteuer: Bis 19.500 € jährlich: 0 % (steuerfrei); 19.501–28.000 €: 20 %; 28.001–36.300 €: 25 %; 36.301–60.000 €: 30 %; über 60.000 €: 35 %. Mit dem Non-Dom-Status können Dividenden und passive Einkünfte 17 Jahre lang steuerfrei oder stark begünstigt sein.',
  },
  {
    category: 'Steuern',
    question: 'Was ist der Non-Dom-Status?',
    answer: 'Der Non-Domicile-Status (Non-Dom) ist ein besonderer Steuerstatus für Personen, die in Zypern steuerlich ansässig sind, aber ihren ursprünglichen Lebensmittelpunkt nicht in Zypern hatten. Vorteile: Keine Steuer auf Dividenden, keine Steuer auf Zinserträge (SDC-Befreiung), günstige Besteuerung von Kapitalgewinnen. Der Non-Dom-Status gilt 17 Jahre lang. Ein Steuerberater ist für die korrekte Beantragung unerlässlich.',
  },
  {
    category: 'Steuern',
    question: 'Wie hoch ist die Körperschaftsteuer für Unternehmen?',
    answer: 'Zypern hat eine der niedrigsten Körperschaftsteuern in der EU: 12,5 % auf Unternehmensgewinne. Hinzu kommen: keine Quellensteuer auf Dividenden an ausländische Gesellschafter, MwSt. 19 % (Standardsatz), Jahresgebühr ans Handelsregister: 350 €. Prüfungspflicht ab 70.000 € Jahresumsatz. Zypern hat Doppelbesteuerungsabkommen mit über 60 Ländern.',
  },
  {
    category: 'Steuern',
    question: 'Gibt es ein Doppelbesteuerungsabkommen zwischen Deutschland und Zypern?',
    answer: 'Ja, Deutschland und Zypern haben ein Doppelbesteuerungsabkommen (DBA). Es verhindert, dass Einkünfte in beiden Ländern vollständig besteuert werden. Wichtig: Wer Deutschland verlässt, muss die Voraussetzungen der steuerlichen Abmeldung erfüllen. Das Finanzamt prüft genau, ob der Lebensmittelpunkt tatsächlich nach Zypern verlegt wurde. Steuerberatung ist dringend empfohlen.',
  },
  {
    category: 'Steuern',
    question: 'Muss ich mich in Deutschland abmelden, wenn ich nach Zypern ziehe?',
    answer: 'Ja, für eine vollständige Abmeldung aus Deutschland beim Einwohnermeldeamt ist die Abmeldung Pflicht. Steuerlich entscheidend ist, wann der Lebensmittelpunkt nach Zypern verlagert wird. Wer mehr als 183 Tage in Deutschland verbringt, bleibt dort unbeschränkt steuerpflichtig. Ein Steuerberater für beide Länder ist bei Auswanderung sehr wichtig, um Doppelbesteuerung zu vermeiden.',
  },

  // ── UNTERNEHMEN ─────────────────────────────────────────────────────
  {
    category: 'Unternehmen',
    question: 'Wie gründe ich eine Limited (Ltd.) in Zypern?',
    answer: 'Ablauf der Gründung: 1. Firmennamen prüfen und reservieren beim Handelsregister, 2. Gründungsdokumente erstellen (Memorandum & Articles of Association), 3. Gesellschafter, Direktor und Company Secretary benennen, 4. Registrierung beim Handelsregister (7–14 Tage), 5. Steuernummer (TIN) beantragen, 6. Bankkonto eröffnen, 7. MwSt.-Registrierung falls nötig. Kosten: ab ca. 1.500–3.000 € mit Anwalt und Steuerberater.',
  },
  {
    category: 'Unternehmen',
    question: 'Was kostet die Gründung einer Zypern Ltd.?',
    answer: 'Kosten im Überblick: Registrierungsgebühren beim Handelsregister: ca. 200–500 €; Anwalts- und Beratungskosten: 500–7.000 € je nach Dienstleister; Jährliche Handelsregistergebühr: 350 €; Steuerberater/Buchhaltung jährlich: 800–2.500 €. Günstigere Anbieter gibt es ab ca. 1.500 € Gesamtkosten. Premium-Anbieter wie Privacy Management Group liegen bei über 7.000 € für die Komplettregistrierung.',
  },
  {
    category: 'Unternehmen',
    question: 'Was sind Nominee-Dienste bei einer Zypern Ltd.?',
    answer: 'Nominee-Dienste ermöglichen eine diskrete Unternehmensstruktur: Nominee Director (tritt offiziell als Geschäftsführer auf, hat aber keine finanzielle Kontrolle), Nominee Shareholder (hält Anteile treuhänderisch für den echten Eigentümer), Nominee Secretary (erledigt administrative Aufgaben). Seit 2021 müssen wirtschaftliche Eigentümer (UBOs) in einem nicht-öffentlichen Register erfasst werden – nur Behörden und Banken haben Zugriff.',
  },
  {
    category: 'Unternehmen',
    question: 'Welche Steuervorteile hat eine Zypern Ltd.?',
    answer: 'Vorteile einer Zypern Ltd.: 12,5 % Körperschaftsteuer (eine der niedrigsten in der EU), keine Quellensteuer auf Dividenden an ausländische Gesellschafter, steuerfreie Gewinne aus dem Verkauf von Wertpapieren, Doppelbesteuerungsabkommen mit über 60 Ländern, Non-Dom-Status für Gesellschafter möglich, internationale Holding-Strukturen erlaubt. Voraussetzung: tatsächliche wirtschaftliche Substanz in Zypern.',
  },
  {
    category: 'Unternehmen',
    question: 'Welche Anwälte und Steuerberater gibt es in Zypern?',
    answer: 'Empfohlene Kanzleien: Nikitas Charalambous & Co Ltd (Paralimni & Larnaka, +357 23811700, nikitas.com.cy), Florian Wilk / CMC Certus (Larnaka, +357 24400246, steuerberater-zypern.info – deutschsprachig), Bundschuh & Schmidt Holding (bs-holding.limited), PolycarposPhilippou (Paphos, philippoulaw.com – seit 1980). Für Übersetzungen: Nicholas Zouvanis (vereidigter Übersetzer, nzouvanistranslations.eu).',
  },

  // ── HAUSTIERE ───────────────────────────────────────────────────────
  {
    category: 'Haustiere',
    question: 'Kann ich meinen Hund nach Zypern mitbringen?',
    answer: 'Ja, Hunde dürfen nach Zypern einreisen. Voraussetzungen: EU-Heimtierausweis, gültiger Tollwutimpfschutz (mindestens 21 Tage vor Einreise), Mikrochip-Kennzeichnung, bei Einreise aus Nicht-EU-Ländern ggf. Bluttest auf Tollwutantikörper. Zypern ist kein Teil des EU-Pet-Travel-Schemas wie Großbritannien, hat aber eigene klare Regelungen. Empfehlung: Vor der Reise beim zypriotischen Veterinäramt informieren.',
  },
  {
    category: 'Haustiere',
    question: 'Welche Impfungen braucht mein Hund für Zypern?',
    answer: 'Pflichtimpfungen: Tollwut (Rabies) – muss mindestens 21 Tage vor Einreise verabreicht worden sein, aber nicht älter als 1 Jahr (oder laut Impfstoffvorgabe). Empfohlene weitere Impfungen: Staupe, Parvovirus, Hepatitis, Leptospirose. Zypern hat keine Tollwut, daher sind die Einreisebedingungen streng. Alle Impfungen müssen im EU-Heimtierausweis dokumentiert sein.',
  },
  {
    category: 'Haustiere',
    question: 'Gibt es hundefreundliche Strände in Zypern?',
    answer: 'Die meisten offiziellen Strände in Zypern sind zwischen Mai und Oktober für Hunde gesperrt. Es gibt jedoch spezielle Hundestrände: Paphos und Limassol haben ausgewiesene Bereiche. Abseits der Saison (November bis April) dürfen Hunde an vielen Stränden laufen. Privat zugängliche Buchten und weniger bekannte Strände sind oft hundefreundlicher. Beschilderung beachten.',
  },
  {
    category: 'Haustiere',
    question: 'Wie ist das Klima für Hunde in Zypern?',
    answer: 'Das heiße Sommerwetter (Juli/August bis zu 40 °C) kann für Hunde anstrengend sein. Wichtige Tipps: Ausführen nur in den frühen Morgen- und Abendstunden, immer frisches Wasser dabei, nie im Auto lassen, kühle Rückzugsorte schaffen. Kurznasige Rassen (Bulldoggen, Möpse) haben im Sommer besonders Probleme. Viele Expats sind mit Hunden in Zypern – es gibt gute Tierärzte und Tierbedarfsläden.',
  },
];

export default function FaqScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'Alle'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeCategory);

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
          <Text style={s.backText}>Zurück</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={s.titleBlock}>
        <Text style={s.title}>Zypern FAQ</Text>
        <Text style={s.subtitle}>Häufige Fragen & Antworten zu Zypern</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={s.catScroll} contentContainerStyle={s.catRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[s.catChip, activeCategory === cat && s.catChipActive]}
            onPress={() => { setActiveCategory(cat); setOpenIndex(null); }}
          >
            <Text style={[s.catText, activeCategory === cat && s.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ List */}
      <ScrollView
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <TouchableOpacity
              key={i}
              style={[s.card, isOpen && s.cardOpen]}
              activeOpacity={0.85}
              onPress={() => setOpenIndex(isOpen ? null : i)}
            >
              <View style={s.cardHeader}>
                <View style={s.cardLeft}>
                  <Text style={s.catLabel}>{item.category.toUpperCase()}</Text>
                  <Text style={s.question}>{item.question}</Text>
                </View>
                <Text style={[s.chevron, isOpen && s.chevronOpen]}>›</Text>
              </View>
              {isOpen && (
                <View style={s.answerWrap}>
                  <View style={s.divider} />
                  <Text style={s.answer}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Reisen: '#0077B6',
  Nordzypern: '#D4891A',
  Alltag: '#27AE60',
  Auswandern: '#8E44AD',
  Steuern: '#C0392B',
  Unternehmen: '#2980B9',
  Haustiere: '#16A085',
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },

  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backArrow: { color: '#fff', fontSize: 18 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  titleBlock: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },

  catScroll: { flexGrow: 0 },
  catRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
  },
  catChipActive: { backgroundColor: '#fff', borderColor: '#fff' },
  catText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  catTextActive: { color: Colors.primary },

  list: { flex: 1, backgroundColor: '#F0F7FF' },
  listContent: { padding: 14, gap: 10 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardOpen: {
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardLeft: { flex: 1 },

  catLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
    color: Colors.primary,
  },
  question: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    lineHeight: 22,
  },
  chevron: {
    fontSize: 22,
    color: '#A0AEC0',
    fontWeight: '300',
    transform: [{ rotate: '90deg' }],
    marginTop: 2,
  },
  chevronOpen: {
    transform: [{ rotate: '-90deg' }],
    color: Colors.primary,
  },

  answerWrap: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#F0F4FA', marginBottom: 12 },
  answer: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
});
