export type Category = {
  slug: string;
  name: string;
  icon: string;
  count: number;
  description: string;
};

export const categories: Category[] = [
  { slug: "schilderwerk", name: "Schilderwerk", icon: "🎨", count: 1284, description: "Binnen- en buitenschilders" },
  { slug: "elektricien", name: "Elektricien", icon: "⚡", count: 1842, description: "Installatie, storingen, groepenkast" },
  { slug: "loodgieter", name: "Loodgieter", icon: "🚿", count: 2103, description: "Lekkages, sanitair, CV" },
  { slug: "timmerman", name: "Timmerman", icon: "🪚", count: 967, description: "Maatwerk, kozijnen, vloeren" },
  { slug: "dakwerker", name: "Dakwerker", icon: "🏠", count: 612, description: "Dakbedekking en reparatie" },
  { slug: "tuinman", name: "Tuinman", icon: "🌿", count: 1456, description: "Aanleg en onderhoud" },
  { slug: "verhuizing", name: "Verhuizing", icon: "📦", count: 743, description: "Verhuisbedrijven en transport" },
  { slug: "schoonmaak", name: "Schoonmaak", icon: "✨", count: 1129, description: "Particulier en bedrijven" },
];

export type Job = {
  slug: string;
  title: string;
  category: string;
  city: string;
  budget: string;
  postedAt: string;
  description: string;
  offers: number;
  clientName: string;
  clientRating: number;
  urgent?: boolean;
};

export const jobs: Job[] = [
  { slug: "schilderen-woonkamer-amsterdam", title: "Woonkamer schilderen (35m²)", category: "Schilderwerk", city: "Amsterdam", budget: "€600 – €900", postedAt: "2 uur geleden", description: "Woonkamer van 35m² inclusief plafond. Witte muren, één accentmuur. Plinten en kozijnen ook lakken.", offers: 4, clientName: "Sanne K.", clientRating: 4.8, urgent: true },
  { slug: "groepenkast-vervangen-utrecht", title: "Groepenkast vervangen incl. aardlekschakelaars", category: "Elektricien", city: "Utrecht", budget: "€800 – €1.200", postedAt: "5 uur geleden", description: "Bestaande groepenkast uit 1998. Vervangen door moderne kast met 3 aardlekschakelaars conform NEN1010.", offers: 7, clientName: "Mark V.", clientRating: 4.9 },
  { slug: "lekkage-badkamer-rotterdam", title: "Lekkage opsporen badkamer", category: "Loodgieter", city: "Rotterdam", budget: "€150 – €350", postedAt: "1 dag geleden", description: "Plafond onder badkamer vertoont vochtplek. Lekkage opsporen en herstellen.", offers: 3, clientName: "Aisha R.", clientRating: 4.7, urgent: true },
  { slug: "houten-vloer-leggen-den-haag", title: "Eikenhouten vloer leggen 60m²", category: "Timmerman", city: "Den Haag", budget: "€2.500 – €3.500", postedAt: "1 dag geleden", description: "Massief eiken vloer leggen op betonnen ondervloer. Inclusief plinten.", offers: 9, clientName: "Pieter B.", clientRating: 5.0 },
  { slug: "tuinaanleg-eindhoven", title: "Compleet tuinontwerp en aanleg 120m²", category: "Tuinman", city: "Eindhoven", budget: "€4.000 – €7.000", postedAt: "3 dagen geleden", description: "Achtertuin van 120m². Bestrating, vlonder, beplanting en verlichting.", offers: 12, clientName: "Lisa H.", clientRating: 4.6 },
  { slug: "dakgoot-reparatie-groningen", title: "Dakgoot reparatie en reiniging", category: "Dakwerker", city: "Groningen", budget: "€200 – €450", postedAt: "4 dagen geleden", description: "Dakgoot lekt op één hoek. Reparatie en volledige reiniging.", offers: 2, clientName: "Jeroen D.", clientRating: 4.8 },
];

export type Pro = {
  slug: string;
  name: string;
  company: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
  years: number;
  verified: boolean;
  responseTime: string;
  about: string;
  initials: string;
};

export const pros: Pro[] = [
  { slug: "van-dijk-schilders", name: "Thomas van Dijk", company: "Van Dijk Schilders", category: "Schilderwerk", city: "Amsterdam", rating: 4.9, reviews: 187, years: 12, verified: true, responseTime: "binnen 1 uur", about: "Familiebedrijf met focus op kwaliteit en duurzame verfsystemen.", initials: "TD" },
  { slug: "elektra-bv-utrecht", name: "Mehmet Yılmaz", company: "Elektra B.V.", category: "Elektricien", city: "Utrecht", rating: 4.8, reviews: 243, years: 9, verified: true, responseTime: "binnen 2 uur", about: "Gecertificeerd installateur. NEN1010 inspecties en groepenkasten.", initials: "MY" },
  { slug: "loodgieter-rotterdam-24", name: "Daan Jansen", company: "24/7 Loodgieter Rotterdam", category: "Loodgieter", city: "Rotterdam", rating: 4.7, reviews: 412, years: 15, verified: true, responseTime: "binnen 30 min", about: "Spoeddienst beschikbaar. Lekkages en sanitair, geen voorrijkosten in regio Rotterdam.", initials: "DJ" },
  { slug: "tuinwerk-eindhoven", name: "Eva Mulder", company: "Mulder Tuinwerk", category: "Tuinman", city: "Eindhoven", rating: 5.0, reviews: 96, years: 7, verified: true, responseTime: "binnen 3 uur", about: "Tuinarchitect en hovenier. Ontwerp tot oplevering.", initials: "EM" },
  { slug: "timmerwerk-den-haag", name: "Rik Bakker", company: "Bakker Timmerwerken", category: "Timmerman", city: "Den Haag", rating: 4.9, reviews: 154, years: 18, verified: true, responseTime: "binnen 4 uur", about: "Maatwerk meubels, kozijnen en vloeren. Eigen werkplaats.", initials: "RB" },
  { slug: "dakdekkers-noord", name: "Sven de Vries", company: "Dakdekkers Noord", category: "Dakwerker", city: "Groningen", rating: 4.7, reviews: 78, years: 11, verified: false, responseTime: "binnen 1 dag", about: "EPDM, bitumen en pannendaken. 10 jaar garantie.", initials: "SV" },
];

export const testimonials = [
  { name: "Sophie de Jong", role: "Opdrachtgever, Amsterdam", quote: "Binnen 3 uur had ik vier offertes. De schilder die ik koos was de volgende ochtend al langs voor een opname.", rating: 5 },
  { name: "Bram Visser", role: "ZZP Elektricien, Utrecht", quote: "Ik haal hier 60% van mijn nieuwe klanten. Het filtersysteem op postcode werkt heel precies.", rating: 5 },
  { name: "Fatima El Amrani", role: "Opdrachtgever, Rotterdam", quote: "Reviews waren doorslaggevend. Geen verrassingen, eerlijke prijs en netjes opgeleverd.", rating: 5 },
  { name: "Joris Hendriks", role: "Loodgietersbedrijf, Den Haag", quote: "De Professional-abonnement betaalt zichzelf binnen één klus terug. Echt geen marketingbureau meer nodig.", rating: 5 },
];

export const stats = [
  { value: 184320, label: "Opdrachten geplaatst", suffix: "+" },
  { value: 12480, label: "Geverifieerde professionals", suffix: "+" },
  { value: 96200, label: "Reviews geschreven", suffix: "+" },
  { value: 4.8, label: "Gemiddelde score", suffix: "/5" },
];

export const plans = [
  {
    name: "Starter",
    price: 19,
    tagline: "Voor zzp'ers die net beginnen",
    features: ["10 leads per maand", "Basis bedrijfsprofiel", "Reviews verzamelen", "E-mail support"],
    cta: "Start met Starter",
    highlight: false,
  },
  {
    name: "Professional",
    price: 49,
    tagline: "Meest gekozen door groeiende bedrijven",
    features: ["Onbeperkte leads", "Uitgelicht profiel in zoekresultaten", "Inzicht in statistieken", "Prioriteit support", "Verificatie-badge"],
    cta: "Kies Professional",
    highlight: true,
  },
  {
    name: "Business",
    price: 99,
    tagline: "Voor teams en specialisten",
    features: ["Alles uit Professional", "Tot 5 team-accounts", "Top-positie in jouw regio", "Geavanceerde analytics", "Persoonlijke accountmanager"],
    cta: "Praat met sales",
    highlight: false,
  },
];