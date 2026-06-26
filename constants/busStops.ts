export const BUS_STOPS: string[] = [
  'Nicosia / Lefkosia',
  'Limassol / Lemesos',
  'Larnaca',
  'Paphos',
  'Ayia Napa',
  'Protaras',
  'Paralimni',
  'Famagusta / Ammochostos',
  'Polis Chrysochous',
  'Latchi',
  'Coral Bay',
  'Larnaca Airport',
  'Paphos Airport',
  'Nissi Beach',
  'Troodos',
  'Pafos Airport',
  'Larnaka Airport',
  'Pafos',
  'Larnaka',
  'Chalkanoros',
  'Elem. School B\' Nisou',
  'Ave. Lemesou - Kimonos',
  'Ave. Lemesou - Larnakos',
  'Ave. Lemesou - Arch. Makariou C',
  'Chrysosotiros Church - Eirinis Avenue',
  'Pera Chorio Nisou High School',
  'Archiep. Makariou C - Elpidos',
  'Archiep. Makariou C - Diogenous',
  'Theodorou Mavrosavva - Athinas',
  'Apodimon Square',
  'Dali Health Centre',
  'Ancient Idalion Museum',
  'Ag. Epifanios Church',
  'Lympia Comm. Board',
  'Lefkosias Ave. - Ammochostou',
  'Chalkanoros - Post Office',
  'Psevdas Comm. Stadium',
  'Lefkosias Ave. - Grigori Afxentiou',
  'Lefkosias Ave. - Artemidos',
  'Panagias Eleousas Ave.',
  'Ag. Anna Comm. Board',
  'Larnakos Ave. - Ap. Varnava',
  'Pyrga - Kornos Road',
  'Pyrga Larnaka Elem. School',
  'Ag. Marina Church',
  '1 Maiou - 8th Kornos',
  'Larnakos - 1st Pyrga Larnakas',
  'Anexartisias - 2nd Kornos',
  'Grigori Afxentiou - 3rd Kornos',
  'Anexartisias - 1st Kornos',
  '1 Maiou - 7th Kornos',
  'Grigori Afxentiou - 4th Kornos',
  'Grigori Afxentiou - 5th Kornos',
  'Timios Prodromos Church',
  'Delikipos',
  'Archiep. Makariou C\' - Omirou',
  'Platini Museum',
  'Mosfiloti Elem. School',
  'Psevdas Square',
  '1 Apriliou - Georgiou Griva Digeni',
  '1 Apriliou - Papamiichail Konstantinou',
  'Mosfiloti Cemetery',
  'Ag. Ioannis Church',
  'Makariou C\' Ave. - Larnakos Ave.',
  'Anexartisias - Stadiou',
  'Kofinou - Highway Exit',
  'Ag. Louka Ave. - Dipotamou',
  'Distrato Lefkara - Kato Drys',
  'Eleftheriou Venizelou - Ifaistou',
  'Archiep. Makariou C\' Ave. - Grigori Afxentiou',
  'Kornos - Delikipos Road',
  '2nd Stop Psematismenos',
  '1st Stop Maroni',
  'Egkomis - Palaikythrou',
  'Kalo Chorio Cemetery',
  'Choirokoitia Neolithic Settlement',
  'Ag. Fanouriou - 4th Stop',
  'Ag. Fanouriou - 8th Stop',
  '1st Stop Tochni',
  'Archiep. Makariou C\' Ave. - 5th Stop',
  '10th Stop Tochni',
  'Maroni Elem. School',
  'Kofinou Police Station',
  'Ag. Fanouriou - 3rd Stop',
  '3rd Stop Tochni',
  '8th Stop Tochni',
  'Grigori Afxentiou Ave. - Stadiou',
  '5th Stop Tochni',
  'Ag. Kon/nou kai Elenis',
  'Grigori Afxentiou Ave. - Apost. Andreou',
  '6th Stop Tochni',
  '7th Stop Tochni',
  'Archiep. Makariou C\' Ave. - 6th Stop',
  'Archiep. Makariou C\' Ave. - 3rd Stop',
  'Ag. Paraskevis - 1st Stop',
  '4th Stop Tochni',
  '9th Stop Tochni',
  'Archiep. Makariou C\' Ave. - 4th Stop',
  '2nd Stop Tochni',
  '11th Stop Tochni',
  'Grigori Afxentiou Ave. - Apost. Louka',
  'Archiep. Makariou C\' Ave. - 1st Stop',
  'Ag. Fanouriou - 7th Stop',
  'Archiep. Makariou C\' Ave. - 2nd Stop',
  'Ag. Dimitrios Church',
  '1st Stop Psematismenos',
  '2nd Stop Maroni',
  '1st Stop Melini',
  'Ag. Vavatsinias - Ora Road - 2nd Stop',
  'Ag. Vavatsinias - Ora Road - 1st Stop',
  'Choirokoitia - Vavla Road - 2nd Stop',
  'Choirokoitia - Vavla Road - 3rd Stop',
  'Kofinou Station',
  'Lefkosia - Lemesos Old Road - 2nd Stop',
  'Lefkosia - Lemesos Old Road - 1st Stop',
  'Choirokoitia - Vavla Road - 1st Stop',
  'Choirokoitia Comm. Stadium',
  'Ag. Paraskevis - 2nd Stop',
  'Griva Digeni - 10th Stop',
  'Choirokoitia Village Centre',
  'Choirokoitia Elem. School',
  'Kato Dris Rural Museum',
  '2nd Stop Vavla',
  '2nd Stop Vavatsinia',
  '3rd Stop Vavatsinia',
  '4th Stop Vavatsinia',
  'Lefkara - Vavatsinia Road - 2nd Stop',
  'Lefkara - Vavatsinia Road - 1st Stop',
  'Isaak kai Solomou - Petraki Giallourou',
  'Antonaki Manoli - 10th Stop',
  'Saint Raphael Hospital',
  'Old Hospital',
  'Larnaka Municipal Theatre',
  'Artemidos Ave. - Faneromenis Ave.',
  'Artemidos Ave. - Okkoular',
  'Artemidos Ave. - Patticheion',
  'Larnaka Courthouse',
  'Artemidos Ave. - Salt Lake',
  'Artemidos Ave. - Touzchane',
  'Artemidos Ave. - Tasou Mitsopoulou Ave.',
];

// Major route connections between key cities
export type Route = {
  from: string;
  to: string;
  duration: string;
  changes: number;
  departures: string[];
  operator: string;
  price: string;
};

const ROUTES: { [key: string]: Route[] } = {
  'nicosia-larnaca': [
    { from: 'Nicosia / Lefkosia', to: 'Larnaca', duration: '45 min', changes: 0, departures: ['07:00', '08:30', '10:00', '12:00', '14:00', '16:00', '18:00'], operator: 'OSEA', price: '€3.00' },
  ],
  'nicosia-limassol': [
    { from: 'Nicosia / Lefkosia', to: 'Limassol / Lemesos', duration: '1 Std 15 min', changes: 0, departures: ['07:30', '09:00', '11:00', '13:00', '15:30', '17:30'], operator: 'EMEL', price: '€4.00' },
  ],
  'nicosia-paphos': [
    { from: 'Nicosia / Lefkosia', to: 'Paphos', duration: '2 Std', changes: 1, departures: ['08:00', '12:00', '16:00'], operator: 'EMEL / OSEA', price: '€6.00' },
  ],
  'larnaca-ayia-napa': [
    { from: 'Larnaca', to: 'Ayia Napa', duration: '1 Std', changes: 0, departures: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'], operator: 'OSEA', price: '€3.50' },
  ],
  'larnaca-limassol': [
    { from: 'Larnaca', to: 'Limassol / Lemesos', duration: '1 Std 30 min', changes: 0, departures: ['07:00', '09:30', '12:00', '14:30', '17:00'], operator: 'EMEL', price: '€4.00' },
  ],
  'limassol-paphos': [
    { from: 'Limassol / Lemesos', to: 'Paphos', duration: '1 Std 15 min', changes: 0, departures: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00'], operator: 'OSEA', price: '€3.50' },
  ],
  'larnaca-nicosia': [
    { from: 'Larnaca', to: 'Nicosia / Lefkosia', duration: '45 min', changes: 0, departures: ['06:30', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'], operator: 'OSEA', price: '€3.00' },
  ],
  'limassol-nicosia': [
    { from: 'Limassol / Lemesos', to: 'Nicosia / Lefkosia', duration: '1 Std 15 min', changes: 0, departures: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'], operator: 'EMEL', price: '€4.00' },
  ],
  'paphos-limassol': [
    { from: 'Paphos', to: 'Limassol / Lemesos', duration: '1 Std 15 min', changes: 0, departures: ['06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30'], operator: 'OSEA', price: '€3.50' },
  ],
  'ayia-napa-larnaca': [
    { from: 'Ayia Napa', to: 'Larnaca', duration: '1 Std', changes: 0, departures: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'], operator: 'OSEA', price: '€3.50' },
  ],
};

export function findRoute(from: string, to: string): Route | null {
  const normalize = (s: string) => s.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  const key1 = `${normalize(from)}-${normalize(to)}`;
  const key2 = `${normalize(to)}-${normalize(from)}`;

  // Direct match
  for (const key of Object.keys(ROUTES)) {
    if (key.includes(normalize(from).split('-')[0]) && key.includes(normalize(to).split('-')[0])) {
      const routes = ROUTES[key];
      if (routes && routes.length > 0) return routes[0];
    }
  }
  return null;
}
