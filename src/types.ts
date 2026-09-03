export interface District {
  id: string;
  name: string;
  chefLieu: string;
  surfaceKm2: number;
  population: number;
  forestCoverPct: number;
  mangroveAreaHa: number;
  fireHotspots2024: number;
  pressureIndex: 'Faible' | 'Modérée' | 'Élevée' | 'Critique';
  description: string;
  center: [number, number];
  polygon: [number, number][];
  mainThreats: string[];
  economicActivities: string[];
}

export interface ProtectedArea {
  id: string;
  name: string;
  type: 'Parc National' | 'Site RAMSAR' | 'Nouvelle Aire Protégée (NAP)' | 'Réserve Spéciale';
  iucnCategory: string;
  surfaceHa: number;
  creationYear: number;
  managingEntity: string;
  district: string;
  center: [number, number];
  polygon?: [number, number][];
  description: string;
  keySpecies: {
    name: string;
    scientificName: string;
    status: 'CR' | 'EN' | 'VU' | 'NT';
  }[];
  threats: string[];
  highlights: string[];
  color: string;
}

export interface MangroveZone {
  id: string;
  name: string;
  areaHa: number;
  healthStatus: 'Excellente' | 'Bonne' | 'Dégradée' | 'En restauration';
  pressureLevel: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  mainSpecies: string[];
  restorationProjects: string;
  center: [number, number];
  polygon: [number, number][];
  description: string;
}

export interface FireAlert {
  id: string;
  date: string;
  year: number;
  month: string;
  district: string;
  commune: string;
  coordinates: [number, number];
  brightnessKelvin: number;
  confidence: number;
  type: 'Feu de brousse' | 'Brûlis agricole / Tavy' | 'Charbonnage' | 'Feu de savane';
  sensor: 'VIIRS 375m' | 'MODIS Terra/Aqua';
  nearProtectedArea?: string;
}

export interface HydrologyFeature {
  id: string;
  name: string;
  type: 'Fleuve' | 'Lac' | 'Estuaire / Baie' | 'Affluent';
  lengthKmOrAreaHa: string;
  description: string;
  sedimentationRisk: 'Très Fort (Lavaka)' | 'Moyen' | 'Faible';
  coordinates: [number, number][] | [number, number][][];
  color: string;
}

export interface EcoProject {
  id: string;
  title: string;
  organization: string;
  theme: 'Mangroves & Carbone Bleu' | 'Lutte Anti-Feu' | 'Restauration Forestière' | 'Biodiversité & Espèces' | 'Agroécologie';
  status: 'En cours' | 'Planifié' | 'Terminé';
  location: string;
  coordinates: [number, number];
  budget: string;
  yearStart: number;
  objectives: string;
  beneficiaries: string;
}

export interface EnvironmentalMetric {
  year: number;
  fireCount: number;
  forestLossHa: number;
  reforestedHa: number;
  mangroveHealthIndex: number; // 0 - 100
  rainfallMm: number;
}

export type BasemapId = 'satellite' | 'streets' | 'topo' | 'dark';

export interface LayerVisibility {
  districts: boolean;
  protectedAreas: boolean;
  mangroves: boolean;
  fireAlerts: boolean;
  hydrology: boolean;
  ecoProjects: boolean;
  fireHeatmap: boolean;
}

export type ChoroplethMetric = 'pressure' | 'forest' | 'fires' | 'none';
