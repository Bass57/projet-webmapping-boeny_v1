import { District, ProtectedArea, MangroveZone, FireAlert, HydrologyFeature, EcoProject, EnvironmentalMetric } from '../types';

// Centroid of Region Boeny
export const BOENY_CENTER: [number, number] = [-16.05, 46.35];
export const BOENY_BOUNDS: [[number, number], [number, number]] = [
  [-17.0, 44.9], // Southwest bound
  [-15.3, 47.4]  // Northeast bound
];

// 6 Districts of Region Boeny
export const DISTRICTS_DATA: District[] = [
  {
    id: 'mahajanga-1',
    name: 'Mahajanga I',
    chefLieu: 'Mahajanga Ville',
    surfaceKm2: 53,
    population: 258000,
    forestCoverPct: 4.2,
    mangroveAreaHa: 1450,
    fireHotspots2024: 18,
    pressureIndex: 'Critique',
    description: 'Chef-lieu urbain de la région Boeny et grand port historique du canal de Mozambique. Forte concentration démographique, forte demande énergétique en charbon de bois et pression périurbaine sur la mangrove de la Corniche et du canal de Betsako.',
    center: [-15.7167, 46.3167],
    polygon: [
      [-15.685, 46.310],
      [-15.695, 46.350],
      [-15.740, 46.355],
      [-15.750, 46.320],
      [-15.725, 46.295],
      [-15.685, 46.310]
    ],
    mainThreats: ['Pression urbaine sur le littoral', 'Déchets plastiques marins', 'Surexploitation du bois d\'énergie (charbon)', 'Artificialisation des sols'],
    economicActivities: ['Commerce maritime', 'Tourisme littoral', 'Pêche artisanale', 'Services régionaux']
  },
  {
    id: 'mahajanga-2',
    name: 'Mahajanga II',
    chefLieu: 'Belobaka',
    surfaceKm2: 4687,
    population: 112000,
    forestCoverPct: 18.5,
    mangroveAreaHa: 19800,
    fireHotspots2024: 142,
    pressureIndex: 'Élevée',
    description: 'District ceinturant la ville de Mahajanga et bordant la rive nord de la Baie de Bombetoka. Abrite de vastes étendues de mangroves estuariennes, des forêts sèches de plateau calcaire (Belobaka) et des plantations d\'anacarde.',
    center: [-15.75, 46.48],
    polygon: [
      [-15.55, 46.35],
      [-15.50, 46.60],
      [-15.65, 46.75],
      [-15.85, 46.60],
      [-15.82, 46.40],
      [-15.75, 46.36],
      [-15.70, 46.35],
      [-15.55, 46.35]
    ],
    mainThreats: ['Coupe de bois de palétuvier pour le charbonnage', 'Feux de savane', 'Érosion des plateaux sablo-calcaires', 'Exploitation informelle des carrières'],
    economicActivities: ['Agroforesterie (anacarde, mangue)', 'Pêche côtière & crabe scylla', 'Élevage bovin', 'Extraction calcaire']
  },
  {
    id: 'marovoay',
    name: 'Marovoay',
    chefLieu: 'Marovoay',
    surfaceKm2: 5611,
    population: 215000,
    forestCoverPct: 14.8,
    mangroveAreaHa: 15400,
    fireHotspots2024: 285,
    pressureIndex: 'Élevée',
    description: 'Deuxième plaine rizicole de Madagascar après le lac Alaotra. Bassin alluvial exceptionnel irrigué par la basse Betsiboka. Très vulnérable à l\'ensablement colossal provenant des lavaka en amont et aux inondations cycloniques récurrentes.',
    center: [-16.11, 46.64],
    polygon: [
      [-15.85, 46.60],
      [-15.95, 46.85],
      [-16.30, 46.88],
      [-16.38, 46.65],
      [-16.25, 46.45],
      [-16.00, 46.40],
      [-15.85, 46.60]
    ],
    mainThreats: ['Ensablement des rizières (sédimentation rouge des lavaka)', 'Inondations cycloniques dévastatrices', 'Utilisation intensive d\'intrants chimiques', 'Perte des forêts ripisylves'],
    economicActivities: ['Riziculture irriguée intensive', 'Pêche fluviale & crevetticulture', 'Culture maraîchère de décrue', 'Artisanat du raphia']
  },
  {
    id: 'ambato-boeny',
    name: 'Ambato-Boeny',
    chefLieu: 'Ambato-Boeny',
    surfaceKm2: 8005,
    population: 235000,
    forestCoverPct: 29.4,
    mangroveAreaHa: 0,
    fireHotspots2024: 680,
    pressureIndex: 'Critique',
    description: 'Cœur intérieur de la région Boeny, traversé par la RN4 et la confluence Betsiboka-Kamoro. Abrite une grande partie du Parc National d\'Ankarafantsika. Zone de transition majeure entre savanes d\'élevage et forêts denses sèches décidues, soumise à de violents feux de brousse pastoraux.',
    center: [-16.46, 46.72],
    polygon: [
      [-16.05, 46.85],
      [-16.00, 47.20],
      [-16.50, 47.35],
      [-16.90, 47.05],
      [-16.95, 46.60],
      [-16.65, 46.50],
      [-16.38, 46.65],
      [-16.05, 46.85]
    ],
    mainThreats: ['Feux de brousse pastoraux (renouvellement de pâturages)', 'Charbonnage illégal le long de la RN4', 'Érosion sévère en "Lavaka"', 'Pression sur la lisière sud d\'Ankarafantsika'],
    economicActivities: ['Élevage bovin extensif (Zébus)', 'Cultures vivrières (manioc, maïs)', 'Orpaillage artisanal', 'Commerce de transit RN4']
  },
  {
    id: 'mitsinjo',
    name: 'Mitsinjo',
    chefLieu: 'Mitsinjo',
    surfaceKm2: 4610,
    population: 86000,
    forestCoverPct: 22.1,
    mangroveAreaHa: 18200,
    fireHotspots2024: 310,
    pressureIndex: 'Élevée',
    description: 'District côtier et lagunaire d\'une richesse écologique mondiale, abritant le Lac Kinkony (2ème lac de Madagascar) et le complexe RAMSAR Mahavavy-Kinkony. Écosystème unique de deltas, roselières, forêts sèches et mangroves.',
    center: [-16.00, 45.86],
    polygon: [
      [-15.70, 45.80],
      [-15.65, 46.20],
      [-15.95, 46.25],
      [-16.15, 46.10],
      [-16.30, 45.90],
      [-16.20, 45.70],
      [-15.90, 45.65],
      [-15.70, 45.80]
    ],
    mainThreats: ['Pêche illicite aux filets non réglementaires', 'Assèchement et conversion des zones humides en rizières', 'Feux de roseaux', 'Chasse et prélèvement d\'oiseaux aquatiques rares'],
    economicActivities: ['Pêche d\'eau douce (tilapia, fibata)', 'Riziculture de marais', 'Élevage traditionnel', 'Écotourisme ornithologique']
  },
  {
    id: 'soalala',
    name: 'Soalala',
    chefLieu: 'Soalala',
    surfaceKm2: 7725,
    population: 52000,
    forestCoverPct: 35.6,
    mangroveAreaHa: 26500,
    fireHotspots2024: 420,
    pressureIndex: 'Élevée',
    description: 'District le plus occidental et le plus isolé de Boeny. Sanctuaire de renommée mondiale pour la tortue Angonoka (la plus menacée au monde), les Tsingy de Namoroka et la Baie de Baly. Fortement convoité pour son gisement géant de minerai de fer.',
    center: [-16.10, 45.32],
    polygon: [
      [-15.80, 45.20],
      [-15.75, 45.55],
      [-15.95, 45.65],
      [-16.30, 45.60],
      [-16.65, 45.45],
      [-16.70, 45.10],
      [-16.35, 45.05],
      [-16.00, 45.15],
      [-15.80, 45.20]
    ],
    mainThreats: ['Braconnage international de la Tortue à soc (Angonoka)', 'Projet minier d\'extraction de fer (impact paysager/biodiversité)', 'Feux criminels récurrents', 'Enclavement sévère gênant la surveillance'],
    economicActivities: ['Pêche traditionnelle marine et langoustes', 'Élevage extensif', 'Cultures vivrières', 'Conservation & recherche scientifique']
  }
];

// Protected Areas of Boeny Region
export const PROTECTED_AREAS_DATA: ProtectedArea[] = [
  {
    id: 'pa-ankarafantsika',
    name: 'Parc National d\'Ankarafantsika',
    type: 'Parc National',
    iucnCategory: 'II',
    surfaceHa: 136513,
    creationYear: 2002,
    managingEntity: 'Madagascar National Parks (MNP)',
    district: 'Ambato-Boeny & Marovoay',
    center: [-16.18, 46.90],
    polygon: [
      [-16.05, 46.80],
      [-16.02, 47.05],
      [-16.12, 47.18],
      [-16.30, 47.12],
      [-16.36, 46.92],
      [-16.28, 46.78],
      [-16.15, 46.76],
      [-16.05, 46.80]
    ],
    description: 'Dernier grand refuge de la forêt dense sèche décidue du nord-ouest de Madagascar. Traversé par la RN4, ce parc abrite le majestueux lac Ravelobe et le canyon d\'Ankarokaroka. Haut lieu de l\'endémisme malgache avec 8 espèces de lémuriens et 129 espèces d\'oiseaux.',
    keySpecies: [
      { name: 'Sifaka de Coquerel', scientificName: 'Propithecus coquereli', status: 'CR' },
      { name: 'Pygargue de Madagascar', scientificName: 'Haliaeetus vociferoides', status: 'CR' },
      { name: 'Microcèbe doré', scientificName: 'Microcebus ravelobensis', status: 'VU' },
      { name: 'Caméléon rhinocéros', scientificName: 'Furcifer rhinoceratus', status: 'VU' }
    ],
    threats: ['Feux de brousse franchissant les pare-feux', 'Coupe sélective pour le charbon de bois', 'Pâturage illégal des zébus en forêt', 'Invasions végétales'],
    highlights: ['Lac Ravelobe & Crocodiles du Nil', 'Canyon spectaculaire d\'Ankarokaroka', 'Station de recherche d\'Ampijoroa', 'Circuit nocturne des microcèbes'],
    color: '#10b981'
  },
  {
    id: 'pa-baie-de-baly',
    name: 'Parc National de la Baie de Baly',
    type: 'Parc National',
    iucnCategory: 'II',
    surfaceHa: 57142,
    creationYear: 1997,
    managingEntity: 'Madagascar National Parks (MNP) & Durrell',
    district: 'Soalala',
    center: [-16.03, 45.35],
    polygon: [
      [-15.92, 45.28],
      [-15.90, 45.45],
      [-16.08, 45.48],
      [-16.16, 45.38],
      [-16.12, 45.22],
      [-15.98, 45.24],
      [-15.92, 45.28]
    ],
    description: 'L\'unique habitat naturel au monde de la rarissime Tortue à soc (Angonoka), reptile terrestre le plus menacé d\'extinction sur Terre. Il combine un massif forestier dense sec, des mangroves côtières et un sanctuaire marin pour les dugongs et tortues vertes.',
    keySpecies: [
      { name: 'Tortue à soc (Angonoka)', scientificName: 'Astrochelys yniphora', status: 'CR' },
      { name: 'Dugong de l\'Océan Indien', scientificName: 'Dugong dugon', status: 'VU' },
      { name: 'Aigle pêcheur de Madagascar', scientificName: 'Haliaeetus vociferoides', status: 'CR' },
      { name: 'Tortue verte marine', scientificName: 'Chelonia mydas', status: 'EN' }
    ],
    threats: ['Braconnage ciblé pour le trafic d\'animaux exotiques', 'Feux volontaires détruisant la litière forestière', 'Exploitation minière limitrophe', 'Érosion côtière'],
    highlights: ['Sanctuaire de l\'Angonoka', 'Paysages littoraux sauvages de la Baie de Baly', 'Observation des dauphins et dugongs', 'Mangroves vierges de Soalala'],
    color: '#059669'
  },
  {
    id: 'pa-namoroka',
    name: 'Parc National du Tsingy de Namoroka',
    type: 'Parc National',
    iucnCategory: 'II',
    surfaceHa: 22227,
    creationYear: 2002,
    managingEntity: 'Madagascar National Parks (MNP)',
    district: 'Soalala',
    center: [-16.42, 45.33],
    polygon: [
      [-16.32, 45.26],
      [-16.30, 45.42],
      [-16.48, 45.44],
      [-16.54, 45.31],
      [-16.42, 45.23],
      [-16.32, 45.26]
    ],
    description: 'Massif karstique spectaculaire de Tsingy acérés aux parois vertigineuses, entaillé de canyons profonds, grottes sacrées et forêts sèches refuges. Isolement géographique exceptionnel favorisant un endémisme très élevé de chiroptères et de reptiles.',
    keySpecies: [
      { name: 'Propithèque de Von der Decken', scientificName: 'Propithecus deckenii', status: 'CR' },
      { name: 'Roussette de Madagascar', scientificName: 'Eidolon dupreanum', status: 'VU' },
      { name: 'Baobab de Namoroka', scientificName: 'Adansonia madagascariensis', status: 'NT' },
      { name: 'Gecko nocturne de Namoroka', scientificName: 'Paroedura vazimba', status: 'VU' }
    ],
    threats: ['Feux de savane menaçant les entrées de canyons', 'Accès difficile pour le contrôle', 'Dégradation des bassins versants', 'Changement microclimatique'],
    highlights: ['Labyrinthes karstiques de Tsingy gris et ocres', 'Grottes rupestres et chauves-souris endémiques', 'Sources d\'eau pure résurgentes', 'Flore rupicole adaptée à la sécheresse'],
    color: '#047857'
  },
  {
    id: 'pa-mahavavy-kinkony',
    name: 'Complexe RAMSAR Mahavavy-Kinkony',
    type: 'Site RAMSAR',
    iucnCategory: 'V / RAMSAR',
    surfaceHa: 300000,
    creationYear: 2006,
    managingEntity: 'Asity Madagascar / BirdLife International',
    district: 'Mitsinjo',
    center: [-15.98, 45.85],
    polygon: [
      [-15.75, 45.75],
      [-15.72, 46.02],
      [-16.12, 46.08],
      [-16.24, 45.85],
      [-16.15, 45.68],
      [-15.85, 45.65],
      [-15.75, 45.75]
    ],
    description: 'Le deuxième plus grand complexe de zones humides de Madagascar. Englobe le lac Kinkony (14 000 ha en crue), le delta du fleuve Mahavavy, des marais à raphia et des baies marines. Accueille plus de 30 000 oiseaux d\'eau migrateurs et sédentaires chaque année.',
    keySpecies: [
      { name: 'Ibis sacré malgache', scientificName: 'Threskiornis bernieri', status: 'EN' },
      { name: 'Héron crabier blanc', scientificName: 'Ardeola idae', status: 'EN' },
      { name: 'Tortue d\'eau douce Réré', scientificName: 'Erymnochelys madagascariensis', status: 'CR' },
      { name: 'Lémur couronné', scientificName: 'Eulemur coronatus', status: 'EN' }
    ],
    threats: ['Surexploitation des stocks halieutiques', 'Drainage et riziculture sauvage dans les roselières', 'Destruction des sites de nidification', 'Pression pastorale sur les berges'],
    highlights: ['Nidification de l\'Ibis malgache et du Réré', 'Immersion ornithologique sur le lac Kinkony', 'Gestion communautaire COBA pionnière', 'Pêche durable au filet large'],
    color: '#0284c7'
  },
  {
    id: 'pa-bombetoka',
    name: 'Nouvelle Aire Protégée Baie de Bombetoka',
    type: 'Nouvelle Aire Protégée (NAP)',
    iucnCategory: 'V',
    surfaceHa: 46200,
    creationYear: 2015,
    managingEntity: 'DREDD Boeny & Communautés Locales (FKM)',
    district: 'Mahajanga II & Marovoay',
    center: [-15.82, 46.30],
    polygon: [
      [-15.74, 46.22],
      [-15.73, 46.34],
      [-15.88, 46.42],
      [-15.96, 46.35],
      [-15.92, 46.22],
      [-15.82, 46.18],
      [-15.74, 46.22]
    ],
    description: 'Estuaire monumental du fleuve Betsiboka. Véritable cathédrale végétale de palétuviers (Rhizophora mucronata, Avicennia marina). Zone de reproduction primordiale pour la crevette rose (Penaeus indicus) et le crabe de mangrove (Scylla serrata). Rempart naturel protégeant Mahajanga contre les tempêtes océaniques.',
    keySpecies: [
      { name: 'Crabe de mangrove', scientificName: 'Scylla serrata', status: 'NT' },
      { name: 'Crevette blanche de Madagascar', scientificName: 'Penaeus indicus', status: 'NT' },
      { name: 'Martin-pêcheur malachite', scientificName: 'Corythornis cristatus', status: 'NT' },
      { name: 'Palétuvier noir', scientificName: 'Avicennia marina', status: 'NT' }
    ],
    threats: ['Coupe de bois pour le fumage de poisson et le bois d\'énergie', 'Sédimentation massive d\'alluvions rouges', 'Pêche non sélective aux alevins', 'Extensions agricoles informelles'],
    highlights: ['Îlots de mangrove labyrinthiques', 'Estuaire rouge spectaculaire vu de l\'espace', 'Nurserie de poissons marins', 'Pépinières de reboisement en palétuviers'],
    color: '#0d9488'
  },
  {
    id: 'pa-antrema',
    name: 'Site Bio-Culturel d\'Antrema (Katsepy)',
    type: 'Nouvelle Aire Protégée (NAP)',
    iucnCategory: 'RAMSAR / V',
    surfaceHa: 20620,
    creationYear: 2000,
    managingEntity: 'Muséum National d\'Histoire Naturelle (MNHN) & Prince Sakalava',
    district: 'Mitsinjo / Katsepy',
    center: [-15.75, 46.22],
    polygon: [
      [-15.70, 46.18],
      [-15.70, 46.26],
      [-15.80, 46.28],
      [-15.82, 46.19],
      [-15.70, 46.18]
    ],
    description: 'Premier site RAMSAR marin de Madagascar (2000). Modèle de conservation fondé sur le respect des traditions sacrées (fady) de la royauté Sakalava du Boina. Les lémuriens couronnés et les lacs sacrés y sont rigoureusement protégés par les interdits ancestraux.',
    keySpecies: [
      { name: 'Sifaka couronné', scientificName: 'Propithecus coronatus', status: 'CR' },
      { name: 'Lémur brun du nord-ouest', scientificName: 'Eulemur mongoz', status: 'CR' },
      { name: 'Palétuvier rouge', scientificName: 'Rhizophora mucronata', status: 'NT' },
      { name: 'Héron de Humblot', scientificName: 'Ardea humbloti', status: 'EN' }
    ],
    threats: ['Érosion côtière marine', 'Pression touristique non maîtrisée', 'Dégradation des dunes côtières', 'Feux accidentels'],
    highlights: ['Lémuriens sacrés côtoyant les villages', 'Lacs sacrés aux poissons géants tabous', 'Phare historique de Katsepy', 'Traditions royales Sakalava'],
    color: '#0891b2'
  }
];

// Mangrove Ecosystems
export const MANGROVE_ZONES_DATA: MangroveZone[] = [
  {
    id: 'mangrove-bombetoka',
    name: 'Grand Delta de Bombetoka',
    areaHa: 46200,
    healthStatus: 'Bonne',
    pressureLevel: 'Élevée',
    mainSpecies: ['Rhizophora mucronata', 'Avicennia marina', 'Ceriops tagal', 'Bruguiera gymnorhiza'],
    restorationProjects: 'Projet Carbone Bleu & Reboisement DREDD / WWF (250 ha reboisés en 2023-2024)',
    center: [-15.83, 46.31],
    polygon: [
      [-15.78, 46.24],
      [-15.76, 46.33],
      [-15.84, 46.38],
      [-15.93, 46.33],
      [-15.88, 46.23],
      [-15.78, 46.24]
    ],
    description: 'L\'un des plus puissants puits de carbone bleu d\'Afrique australe. Filtre naturel gigantesque retenant des millions de tonnes de latérite rouge charriée par la Betsiboka.'
  },
  {
    id: 'mangrove-baly',
    name: 'Mangroves de la Baie de Baly (Soalala)',
    areaHa: 24300,
    healthStatus: 'Excellente',
    pressureLevel: 'Faible',
    mainSpecies: ['Avicennia marina', 'Rhizophora mucronata', 'Sonneratia alba'],
    restorationProjects: 'Patrouilles marines de surveillance MNP & suivi satellite Sentinelle',
    center: [-16.02, 45.32],
    polygon: [
      [-15.95, 45.28],
      [-15.93, 45.38],
      [-16.06, 45.39],
      [-16.10, 45.30],
      [-15.95, 45.28]
    ],
    description: 'Forêt de mangrove exceptionnellement préservée grâce à son isolement routier, servant de nourricerie critique aux dugongs et tortues marines.'
  },
  {
    id: 'mangrove-katsepy',
    name: 'Mangroves d\'Antrema - Katsepy',
    areaHa: 8900,
    healthStatus: 'En restauration',
    pressureLevel: 'Moyenne',
    mainSpecies: ['Rhizophora mucronata', 'Ceriops tagal', 'Lumnitzera racemosa'],
    restorationProjects: 'Pépinières communautaires gérées par l\'association locale FKM et le MNHN',
    center: [-15.77, 46.20],
    polygon: [
      [-15.72, 46.19],
      [-15.73, 46.25],
      [-15.81, 46.25],
      [-15.80, 46.18],
      [-15.72, 46.19]
    ],
    description: 'Zone humide d\'interface sous statut coutumier sacré, faisant l\'objet d\'une replantation annuelle participative par les scolaires et les femmes locales.'
  },
  {
    id: 'mangrove-mahavavy',
    name: 'Mangroves du Delta de la Mahavavy',
    areaHa: 14800,
    healthStatus: 'Bonne',
    pressureLevel: 'Moyenne',
    mainSpecies: ['Avicennia marina', 'Sonneratia alba', 'Rhizophora mucronata'],
    restorationProjects: 'Asity Madagascar / Gestion concertée des pêcheries de crabes',
    center: [-15.78, 45.88],
    polygon: [
      [-15.73, 45.83],
      [-15.72, 45.96],
      [-15.84, 45.95],
      [-15.85, 45.84],
      [-15.73, 45.83]
    ],
    description: 'Écosystème estuarien saumâtre connecté au lac Kinkony, abritant les plus grandes colonies de crabes Scylla serrata exportés vers Mahajanga.'
  }
];

// Active Fire Hotspots (2024-2025 satellite monitoring data - VIIRS/MODIS)
export const FIRE_ALERTS_DATA: FireAlert[] = [
  {
    id: 'fire-2024-001',
    date: '2024-09-18',
    year: 2024,
    month: 'Septembre',
    district: 'Ambato-Boeny',
    commune: 'Andranofasika',
    coordinates: [-16.22, 46.74],
    brightnessKelvin: 342.5,
    confidence: 94,
    type: 'Feu de brousse',
    sensor: 'VIIRS 375m',
    nearProtectedArea: 'Lisière Ankarafantsika (4.2 km)'
  },
  {
    id: 'fire-2024-002',
    date: '2024-09-22',
    year: 2024,
    month: 'Septembre',
    district: 'Ambato-Boeny',
    commune: 'Anjiajia',
    coordinates: [-16.58, 46.88],
    brightnessKelvin: 338.1,
    confidence: 89,
    type: 'Feu de savane',
    sensor: 'VIIRS 375m'
  },
  {
    id: 'fire-2024-003',
    date: '2024-10-04',
    year: 2024,
    month: 'Octobre',
    district: 'Soalala',
    commune: 'Andranomavo',
    coordinates: [-16.32, 45.48],
    brightnessKelvin: 351.0,
    confidence: 98,
    type: 'Feu de brousse',
    sensor: 'MODIS Terra/Aqua',
    nearProtectedArea: 'Namoroka (3.1 km)'
  },
  {
    id: 'fire-2024-004',
    date: '2024-10-12',
    year: 2024,
    month: 'Octobre',
    district: 'Marovoay',
    commune: 'Marovoay Banlieue',
    coordinates: [-16.18, 46.58],
    brightnessKelvin: 326.8,
    confidence: 82,
    type: 'Brûlis agricole / Tavy',
    sensor: 'VIIRS 375m'
  },
  {
    id: 'fire-2024-005',
    date: '2024-10-19',
    year: 2024,
    month: 'Octobre',
    district: 'Mahajanga II',
    commune: 'Belobaka',
    coordinates: [-15.78, 46.52],
    brightnessKelvin: 340.2,
    confidence: 91,
    type: 'Charbonnage',
    sensor: 'VIIRS 375m'
  },
  {
    id: 'fire-2024-006',
    date: '2024-10-25',
    year: 2024,
    month: 'Octobre',
    district: 'Mitsinjo',
    commune: 'Katsepy',
    coordinates: [-15.86, 46.12],
    brightnessKelvin: 329.4,
    confidence: 84,
    type: 'Feu de savane',
    sensor: 'VIIRS 375m'
  },
  {
    id: 'fire-2024-007',
    date: '2024-11-02',
    year: 2024,
    month: 'Novembre',
    district: 'Ambato-Boeny',
    commune: 'Madirovalo',
    coordinates: [-16.39, 46.58],
    brightnessKelvin: 345.9,
    confidence: 93,
    type: 'Feu de brousse',
    sensor: 'MODIS Terra/Aqua'
  },
  {
    id: 'fire-2024-008',
    date: '2024-11-09',
    year: 2024,
    month: 'Novembre',
    district: 'Soalala',
    commune: 'Ambohipaky',
    coordinates: [-16.08, 45.42],
    brightnessKelvin: 348.6,
    confidence: 96,
    type: 'Feu de brousse',
    sensor: 'VIIRS 375m',
    nearProtectedArea: 'Baie de Baly (6.5 km)'
  },
  {
    id: 'fire-2024-009',
    date: '2024-11-15',
    year: 2024,
    month: 'Novembre',
    district: 'Mitsinjo',
    commune: 'Matsakabanja',
    coordinates: [-16.08, 45.92],
    brightnessKelvin: 334.2,
    confidence: 88,
    type: 'Brûlis agricole / Tavy',
    sensor: 'VIIRS 375m',
    nearProtectedArea: 'Périphérie Lac Kinkony'
  },
  {
    id: 'fire-2024-010',
    date: '2024-11-20',
    year: 2024,
    month: 'Novembre',
    district: 'Ambato-Boeny',
    commune: 'Manerinerina',
    coordinates: [-16.78, 47.12],
    brightnessKelvin: 355.1,
    confidence: 99,
    type: 'Feu de brousse',
    sensor: 'VIIRS 375m'
  },
  {
    id: 'fire-2023-011',
    date: '2023-09-14',
    year: 2023,
    month: 'Septembre',
    district: 'Ambato-Boeny',
    commune: 'Andranofasika',
    coordinates: [-16.29, 46.82],
    brightnessKelvin: 344.0,
    confidence: 95,
    type: 'Feu de brousse',
    sensor: 'VIIRS 375m',
    nearProtectedArea: 'Ankarafantsika'
  },
  {
    id: 'fire-2023-012',
    date: '2023-10-18',
    year: 2023,
    month: 'Octobre',
    district: 'Soalala',
    commune: 'Soalala',
    coordinates: [-16.14, 45.31],
    brightnessKelvin: 339.5,
    confidence: 90,
    type: 'Feu de brousse',
    sensor: 'VIIRS 375m'
  }
];

// Hydrological network (Rivers, Lakes, Delta)
export const HYDROLOGY_DATA: HydrologyFeature[] = [
  {
    id: 'river-betsiboka',
    name: 'Fleuve Betsiboka',
    type: 'Fleuve',
    lengthKmOrAreaHa: '525 km (Bassin: 49 000 km²)',
    description: 'Le plus célèbre fleuve de Madagascar, mondialement connu pour sa couleur rouge brique causée par une érosion cataclysmique en amont (lavakas sur les hauts plateaux). Déverse annuellement jusqu\'à 50 millions de tonnes de sédiments dans la baie de Bombetoka.',
    sedimentationRisk: 'Très Fort (Lavaka)',
    color: '#dc2626',
    coordinates: [
      [-16.92, 47.18],
      [-16.75, 46.95],
      [-16.60, 46.82],
      [-16.46, 46.72],
      [-16.32, 46.68],
      [-16.18, 46.64],
      [-16.08, 46.54],
      [-15.96, 46.42],
      [-15.86, 46.36],
      [-15.78, 46.30]
    ]
  },
  {
    id: 'river-kamoro',
    name: 'Rivière Kamoro',
    type: 'Affluent',
    lengthKmOrAreaHa: '150 km',
    description: 'Principal affluent de la Betsiboka en rive droite, franchi par le pont suspendu de la Kamoro sur la RN4. Drainage d\'une vaste zone pastorale à haut risque d\'érosion.',
    sedimentationRisk: 'Très Fort (Lavaka)',
    color: '#ea580c',
    coordinates: [
      [-16.68, 47.32],
      [-16.58, 47.15],
      [-16.50, 46.95],
      [-16.45, 46.73]
    ]
  },
  {
    id: 'river-mahavavy',
    name: 'Fleuve Mahavavy Sud',
    type: 'Fleuve',
    lengthKmOrAreaHa: '160 km',
    description: 'Fleuve nourricier du complexe de Kinkony. Ses crues annuelles fertilisent les zones humides de Mitsinjo et alimentent le lac Kinkony par déversement latéral.',
    sedimentationRisk: 'Moyen',
    color: '#0284c7',
    coordinates: [
      [-16.45, 46.05],
      [-16.30, 45.98],
      [-16.15, 45.92],
      [-16.02, 45.89],
      [-15.88, 45.86],
      [-15.74, 45.88]
    ]
  },
  {
    id: 'lake-kinkony',
    name: 'Lac Kinkony',
    type: 'Lac',
    lengthKmOrAreaHa: '13 800 ha (138 km²)',
    description: 'Deuxième plus vaste plan d\'eau douce de Madagascar après le lac Alaotra. Sanctuaire vital pour la tortue Réré et de nombreuses espèces d\'oiseaux aquatiques rares.',
    sedimentationRisk: 'Moyen',
    color: '#0369a1',
    coordinates: [
      [-16.02, 45.80],
      [-15.97, 45.83],
      [-15.95, 45.88],
      [-15.99, 45.93],
      [-16.06, 45.90],
      [-16.09, 45.83],
      [-16.02, 45.80]
    ]
  },
  {
    id: 'lake-ravelobe',
    name: 'Lac Ravelobe (Ankarafantsika)',
    type: 'Lac',
    lengthKmOrAreaHa: '35 ha',
    description: 'Lac sacré d\'Ankarafantsika ceinturé de raphia, réputé pour sa population de crocodiles du Nil protégés par des fady et son couple sédentaire de Pygargues de Madagascar.',
    sedimentationRisk: 'Faible',
    color: '#0284c7',
    coordinates: [
      [-16.305, 46.812],
      [-16.300, 46.818],
      [-16.306, 46.825],
      [-16.312, 46.820],
      [-16.305, 46.812]
    ]
  }
];

// Environmental Projects & Field Stations in Boeny
export const ECO_PROJECTS_DATA: EcoProject[] = [
  {
    id: 'proj-01',
    title: 'Programme Carbone Bleu & Restauration Bombetoka',
    organization: 'DREDD Boeny & WWF Madagascar',
    theme: 'Mangroves & Carbone Bleu',
    status: 'En cours',
    location: 'Baie de Bombetoka (Katsepy / Boanamary)',
    coordinates: [-15.80, 46.32],
    budget: '1.2M USD (Fonds Climat Vert / GEF)',
    yearStart: 2021,
    objectives: 'Reboiser 800 ha de mangroves dégradées, sécuriser les pépinières villageoises et mettre en place des crédits carbone volontaires au profit des communautés de pêcheurs.',
    beneficiaries: '3 500 ménages de pêcheurs de crabes et ramasseuses de coquillages'
  },
  {
    id: 'proj-02',
    title: 'Lutte Participative contre les Feux de Pâturage en Boeny',
    organization: 'GIZ Page / Programme Agroécologie',
    theme: 'Lutte Anti-Feu',
    status: 'En cours',
    location: 'Ambato-Boeny & Marovoay',
    coordinates: [-16.35, 46.70],
    budget: '750 000 EUR',
    yearStart: 2022,
    objectives: 'Formation de 45 brigades villageoises anti-feu (KMM), aménagement de pare-feux verts avec des haies d\'Acacia auriculiformis et sensibilisation aux alternatives de fauche.',
    beneficiaries: '12 communes rurales exposées aux incendies de savane'
  },
  {
    id: 'proj-03',
    title: 'Sauvegarde d\'Urgence de la Tortue Angonoka',
    organization: 'Durrell Wildlife Conservation Trust & MNP',
    theme: 'Biodiversité & Espèces',
    status: 'En cours',
    location: 'Parc National de la Baie de Baly (Soalala)',
    coordinates: [-16.02, 45.34],
    budget: '920 000 GBP',
    yearStart: 2018,
    objectives: 'Surveillance 24h/24 des zones d\'incubation, gravure d\'identification antivol sur les carapaces, centre d\'élevage de sauvegarde à Ampijoroa et réintroduction suivie.',
    beneficiaries: 'Espèce en danger critique d\'extinction et communautés Sakalava gardiennes'
  },
  {
    id: 'proj-04',
    title: 'Protection du Bassin Versant et Lutte Anti-Ensablement',
    organization: 'USAID Hay Tao / Ministère de l\'Agriculture',
    theme: 'Restauration Forestière',
    status: 'En cours',
    location: 'Haute vallée de la Betsiboka / Marovoay',
    coordinates: [-16.20, 46.60],
    budget: '2.1M USD',
    yearStart: 2020,
    objectives: 'Fixation des lavakas critiques par le vétiver et reboisement en amont pour stopper l\'ensablement des rizières de Marovoay.',
    beneficiaries: '18 000 riziculteurs de la plaine de Marovoay'
  },
  {
    id: 'proj-05',
    title: 'Gestion Concertée du Lac Kinkony & Avifaune RAMSAR',
    organization: 'Asity Madagascar / BirdLife',
    theme: 'Biodiversité & Espèces',
    status: 'En cours',
    location: 'Mitsinjo (Lac Kinkony)',
    coordinates: [-16.00, 45.85],
    budget: '540 000 EUR',
    yearStart: 2019,
    objectives: 'Application du repos biologique de pêche, suivi GPS des ibis sacrés et des hérons crabiers, patrouilles de gardes villageois bénévoles.',
    beneficiaries: 'Communautés riveraines et 30 000 oiseaux migrateurs'
  }
];

// Historical Environmental Metrics (2018 - 2025)
export const ENVIRONMENTAL_METRICS: EnvironmentalMetric[] = [
  {
    year: 2018,
    fireCount: 1420,
    forestLossHa: 3850,
    reforestedHa: 420,
    mangroveHealthIndex: 72,
    rainfallMm: 1240
  },
  {
    year: 2019,
    fireCount: 1680,
    forestLossHa: 4200,
    reforestedHa: 510,
    mangroveHealthIndex: 70,
    rainfallMm: 1080
  },
  {
    year: 2020,
    fireCount: 1350,
    forestLossHa: 3400,
    reforestedHa: 680,
    mangroveHealthIndex: 69,
    rainfallMm: 1310
  },
  {
    year: 2021,
    fireCount: 1540,
    forestLossHa: 3650,
    reforestedHa: 950,
    mangroveHealthIndex: 71,
    rainfallMm: 1190
  },
  {
    year: 2022,
    fireCount: 1820,
    forestLossHa: 4500,
    reforestedHa: 1240,
    mangroveHealthIndex: 68,
    rainfallMm: 980 // Année sèche
  },
  {
    year: 2023,
    fireCount: 1490,
    forestLossHa: 3350,
    reforestedHa: 1580,
    mangroveHealthIndex: 73,
    rainfallMm: 1420 // Cyclones Cheneso
  },
  {
    year: 2024,
    fireCount: 1575,
    forestLossHa: 3100,
    reforestedHa: 1890,
    mangroveHealthIndex: 76,
    rainfallMm: 1280
  },
  {
    year: 2025,
    fireCount: 1210,
    forestLossHa: 2450,
    reforestedHa: 2150,
    mangroveHealthIndex: 78,
    rainfallMm: 1350
  }
];

// Tile Layer configurations for Leaflet
export const BASEMAP_CONFIGS = {
  satellite: {
    name: 'Satellite HD (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  streets: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  topo: {
    name: 'Relief & Topographie',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
    maxZoom: 17
  },
  dark: {
    name: 'CartoDB Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }
};
