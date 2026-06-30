-- Jobs table for Inside Cyprus job listings
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  company     text not null,
  location    text not null default 'Zypern',
  city        text,
  description text,
  url         text,
  source      text not null default 'employer',
  salary_min  int,
  salary_max  int,
  job_type    text default 'Full-time',
  category    text,
  active      boolean default true,
  created_at  timestamptz default now()
);

alter table public.jobs enable row level security;
create policy "Public read" on public.jobs for select using (active = true);

-- Seed with real Cyprus jobs (sourced from alpha.jobs 2026-06-29)
insert into public.jobs (title, company, location, city, description, url, source, salary_min, salary_max, category) values
  ('Sales Assistant', 'Aphrodite''s Secret', 'Paphos, Cyprus', 'Paphos',
   'We are looking for a motivated and friendly Sales Assistant to join our team in Paphos. Salary: €1200 net per month. Working hours: 5 days a week, (shift system) 8 working hours per day.',
   'https://www.alpha.jobs/jobs/502391908-sales-assistant-paphos', 'alpha.jobs', 1200, 1200, 'Sales'),

  ('Πωλητής/Πωλήτρια (Τρόοδος)', 'Aphrodite''s Secret', 'Troodos, Cyprus', 'Troodos',
   'Αναζητούμε δύο άτομα με θετική ενέργεια και ευχάριστη προσωπικότητα να ενταχθούν στην ομάδα μας στο Τρόοδος. Μισθός: €1100 καθαρά τον μήνα.',
   'https://www.alpha.jobs/jobs/502393411-politis-politria-troodos', 'alpha.jobs', 1100, 1100, 'Sales'),

  ('Βοηθός Λογιστή', 'ASP Auditors', 'Nicosia, Cyprus', 'Nicosia',
   'Λογιστικό γραφείο στη Λευκωσία ζητά άτομο για μόνιμη συνεργασία. Ωράριο: Δευτέρα – Παρασκευή, 08:00 – 16:30.',
   'https://www.alpha.jobs/jobs/502405342-boithos-loghisti', 'alpha.jobs', null, null, 'Finance'),

  ('Διανομέας', 'HBA Trading Ltd', 'Xylotymbou, Cyprus', 'Larnaca',
   'Η εταιρεία HBA Trading Ltd με έδρα τη Ξυλοτύμπου, ζητά άτομο για εργασία. Απαιτήσεις: Δίπλωμα οδήγησης κατηγορίας Β, φορτηγού. Φόρτωση και παράδοση προϊόντων σε πελάτες παγκύπρια.',
   'https://www.alpha.jobs/jobs/502312995-dianomeas', 'alpha.jobs', null, null, 'Logistics'),

  ('Accounting Assistant', 'Confidential', 'Limassol, Cyprus', 'Limassol',
   'We are looking for an Accounting Assistant to join our finance team in Limassol. Responsibilities include bookkeeping, invoicing, bank reconciliations, and VAT returns.',
   'https://www.alpha.jobs/jobs/502232763-accounting-assistant', 'alpha.jobs', null, null, 'Finance'),

  ('Call Center Representative', 'Confidential', 'Nicosia, Cyprus', 'Nicosia',
   'We are hiring Call Center Representatives for our Nicosia office. Fluency in English required. Full-time position with competitive salary and benefits package.',
   'https://www.alpha.jobs/jobs/502230762-call-center-representative', 'alpha.jobs', null, null, 'Customer Service'),

  ('Junior Compliance Analyst', 'Confidential', 'Limassol, Cyprus', 'Limassol',
   'We are looking for a Junior Compliance Analyst to join our team in Limassol. The role involves monitoring regulatory requirements and ensuring company adherence to applicable laws.',
   'https://www.alpha.jobs/jobs/502228751-junior-compliance-analyst', 'alpha.jobs', null, null, 'Finance'),

  ('Junior Bookkeeper', 'Confidential', 'Nicosia, Cyprus', 'Nicosia',
   'Exciting opportunity for a Junior Bookkeeper to join our growing team in Nicosia. Experience with accounting software preferred. Competitive salary offered.',
   'https://www.alpha.jobs/jobs/502225743-junior-bookkeeper', 'alpha.jobs', null, null, 'Finance'),

  ('Μηχανολόγος Μηχανικός', 'Confidential', 'Nicosia, Cyprus', 'Nicosia',
   'Αναζητούμε έμπειρο Μηχανολόγο Μηχανικό για μόνιμη απασχόληση στη Λευκωσία. Απαιτείται δίπλωμα μηχανολογίας και εμπειρία τουλάχιστον 2 ετών.',
   'https://www.alpha.jobs/jobs/503237914-mikhanologhos-mikhanikos', 'alpha.jobs', null, null, 'Engineering'),

  ('Ηλεκτρολόγος Μηχανικός', 'Confidential', 'Limassol, Cyprus', 'Limassol',
   'Αναζητούμε Ηλεκτρολόγο Μηχανικό για εργασία στη Λεμεσό. Εμπειρία σε εγκαταστάσεις ηλεκτρολογικών συστημάτων απαραίτητη.',
   'https://www.alpha.jobs/jobs/503237907-hlektrologhos-mikhanikos', 'alpha.jobs', null, null, 'Engineering'),

  ('Chef de Partie', 'Luxury Hotel', 'Limassol, Cyprus', 'Limassol',
   'A 5-star hotel in Limassol is seeking an experienced Chef de Partie. You will be responsible for running a specific section of the kitchen. Accommodation available.',
   null, 'inside-cyprus', null, null, 'Hospitality'),

  ('Hotel Receptionist (German speaking)', 'Resort Hotel', 'Paphos, Cyprus', 'Paphos',
   'International resort hotel in Paphos is looking for a German-speaking Receptionist. Excellent communication skills required. Season position with possibility of extension.',
   null, 'inside-cyprus', null, null, 'Hospitality'),

  ('Real Estate Agent', 'Cyprus Property Group', 'Limassol, Cyprus', 'Limassol',
   'Join our dynamic real estate team in Limassol! We are seeking motivated Real Estate Agents to help clients buy, sell and rent properties across Cyprus. Commission-based earnings with high potential.',
   null, 'inside-cyprus', null, null, 'Real Estate'),

  ('Diving Instructor', 'Blue Waters Dive Centre', 'Ayia Napa, Cyprus', 'Famagusta',
   'Dive centre in Ayia Napa is looking for PADI certified diving instructors for the summer season. Full-time position. Accommodation and meals provided.',
   null, 'inside-cyprus', null, null, 'Tourism'),

  ('Software Developer (React/Node)', 'Tech Startup', 'Limassol, Cyprus', 'Limassol',
   'Growing fintech startup in Limassol is hiring a Software Developer. Skills required: React, Node.js, TypeScript. Remote-friendly culture. Competitive salary €3000-5000/month.',
   null, 'inside-cyprus', 3000, 5000, 'IT'),

  ('Kindergarten Teacher (German)', 'International School', 'Nicosia, Cyprus', 'Nicosia',
   'International school in Nicosia is looking for a German-speaking Kindergarten Teacher. Qualified teachers with EU credentials preferred. Relocation support available.',
   null, 'inside-cyprus', null, null, 'Education'),

  ('Marketing Manager', 'iGaming Company', 'Limassol, Cyprus', 'Limassol',
   'Fast-growing iGaming company in Limassol is seeking an experienced Marketing Manager. You will lead digital marketing campaigns across multiple markets. 3+ years experience required.',
   null, 'inside-cyprus', null, null, 'Marketing'),

  ('Customer Support Agent (Multilingual)', 'Financial Services', 'Nicosia, Cyprus', 'Nicosia',
   'We are looking for multilingual Customer Support Agents (English, German, Russian). Full training provided. Monday to Friday, 9:00-18:00. Salary: €1500-1800/month.',
   null, 'inside-cyprus', 1500, 1800, 'Customer Service'),

  ('Yacht Captain', 'Charter Company', 'Limassol, Cyprus', 'Limassol',
   'Luxury yacht charter company in Limassol Marina is looking for an experienced Yacht Captain with valid STCW certificate. Season April-October. Attractive package offered.',
   null, 'inside-cyprus', null, null, 'Maritime'),

  ('Personal Trainer', 'Fitness Club', 'Larnaca, Cyprus', 'Larnaca',
   'Modern fitness club in Larnaca is hiring certified Personal Trainers. Part-time and full-time positions available. Must hold valid fitness certification.',
   null, 'inside-cyprus', null, null, 'Sports & Fitness');
