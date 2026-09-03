import React, { useState } from 'react';
import { 
  Compass, 
  BarChart3, 
  FileText, 
  Ruler, 
  RotateCcw, 
  Info, 
  Search, 
  ShieldAlert, 
  Trees, 
  Droplets,
  X,
  ChevronRight,
  Server
} from 'lucide-react';
import { 
  DISTRICTS_DATA, 
  PROTECTED_AREAS_DATA, 
  MANGROVE_ZONES_DATA, 
  HYDROLOGY_DATA 
} from '../data/boenyData';

interface NavbarProps {
  onOpenStats: () => void;
  onOpenReport: () => void;
  onOpenGeoServer: () => void;
  onResetView: () => void;
  isMeasuring: boolean;
  onToggleMeasure: () => void;
  onSelectFeature: (feature: any) => void;
  onFlyTo: (coords: [number, number], zoom: number) => void;
  geoServerLayerCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStats,
  onOpenReport,
  onOpenGeoServer,
  onResetView,
  isMeasuring,
  onToggleMeasure,
  onSelectFeature,
  onFlyTo,
  geoServerLayerCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Search items across datasets
  const allSearchItems = [
    ...DISTRICTS_DATA.map(d => ({ 
      type: 'District', 
      name: d.name, 
      sub: `${d.surfaceKm2} km² • Chef-lieu: ${d.chefLieu}`, 
      coords: d.center, 
      zoom: 10,
      data: d 
    })),
    ...PROTECTED_AREAS_DATA.map(pa => ({ 
      type: pa.type, 
      name: pa.name, 
      sub: `${pa.surfaceHa.toLocaleString('fr-FR')} ha • ${pa.managingEntity}`, 
      coords: pa.center, 
      zoom: 11,
      data: pa 
    })),
    ...MANGROVE_ZONES_DATA.map(m => ({ 
      type: 'Mangrove', 
      name: m.name, 
      sub: `${m.areaHa.toLocaleString('fr-FR')} ha • État: ${m.healthStatus}`, 
      coords: m.center, 
      zoom: 11,
      data: m 
    })),
    ...HYDROLOGY_DATA.map(h => ({ 
      type: h.type, 
      name: h.name, 
      sub: h.lengthKmOrAreaHa, 
      coords: Array.isArray(h.coordinates[0]) && typeof h.coordinates[0][0] === 'number' 
        ? h.coordinates[Math.floor(h.coordinates.length / 2)] as [number, number]
        : [-16.11, 46.64] as [number, number], 
      zoom: 10,
      data: h 
    }))
  ];

  const filteredSearch = searchQuery.trim() === '' 
    ? [] 
    : allSearchItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  const handleSelectItem = (item: typeof allSearchItems[0]) => {
    onFlyTo(item.coords, item.zoom);
    onSelectFeature(item.data);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl bg-white/5 border-b border-white/10 z-50 relative shadow-2xl">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-base shadow-lg shadow-emerald-500/20">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold tracking-tight uppercase text-white">
                Observatoire <span className="text-emerald-400">Boeny</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-emerald-300 border border-white/10 backdrop-blur-md">
                Madagascar
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Système d'Information Géographique & Suivi des Écosystèmes
            </p>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="relative max-w-xs md:max-w-md w-full mx-3 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un district, parc, mangrove, fleuve..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-white/5 backdrop-blur-md text-xs text-slate-100 placeholder-slate-400 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && filteredSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 backdrop-blur-2xl bg-[#0c1618]/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
              {filteredSearch.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-white/10 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Live Indicator Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium">Monitoring Satellitaire</span>
          </div>

          {/* Measurement Button */}
          <button
            onClick={onToggleMeasure}
            title={isMeasuring ? "Désactiver la règle" : "Mesurer une distance ou un périmètre"}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 backdrop-blur-md border transition-all ${
              isMeasuring 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isMeasuring ? 'Mesure active' : 'Mesurer'}</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={onResetView}
            title="Recentrer la carte sur la Région Boeny"
            className="p-2 text-slate-300 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/15 hover:text-white rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* GeoServer OGC Button */}
          <button
            onClick={onOpenGeoServer}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 backdrop-blur-md bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50 hover:text-white transition-all shadow-sm group"
          >
            <Server className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline">GeoServer OGC</span>
            {geoServerLayerCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                {geoServerLayerCount}
              </span>
            )}
          </button>

          {/* Environmental Report Button */}
          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 backdrop-blur-md bg-white/5 text-slate-200 border border-white/10 hover:bg-white/15 hover:text-white transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Bilan Régional</span>
          </button>

          {/* Stats Drawer Trigger */}
          <button
            onClick={onOpenStats}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-400/50 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tableau de Bord</span>
          </button>

          {/* Info Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            title="À propos de l'Observatoire"
            className="p-2 text-slate-400 hover:text-white rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/15 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-[#0c1618]/95 border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Observatoire Environnemental Régional de Boeny
                </h2>
                <p className="text-xs text-slate-400">Direction Régionale de l'Environnement (DREDD Boeny) & Partenaires</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed text-slate-300">
              <p>
                Ce portail de webmapping interactif constitue l'outil d'aide à la décision territoriale pour la surveillance des écosystèmes dans la <strong className="text-white">région Boeny</strong> (Nord-Ouest de Madagascar).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                <div className="backdrop-blur-md bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Trees className="w-4 h-4" />
                    <span>Forêts Sèches & Faune</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Suivi d'Ankarafantsika, de la Baie de Baly et de Namoroka (Tortue Angonoka et Sifaka de Coquerel).
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                    <Droplets className="w-4 h-4" />
                    <span>Mangroves & Eau</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Cartographie des 60 000+ ha de mangroves (Bombetoka, Katsepy, Delta Mahavavy) et sédimentation Betsiboka.
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Feux & Alertes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Détection satellitaire quasi temps réel (VIIRS/MODIS) pour la prévention des feux de brousse et du charbonnage.
                  </p>
                </div>
              </div>

              <div className="backdrop-blur-md bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <h4 className="font-semibold text-slate-200 mb-1.5">Sources des données géospatiales :</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>Madagascar National Parks (MNP) & Asity Madagascar (Limites AP)</li>
                  <li>NASA FIRMS / VIIRS 375m & MODIS Terra/Aqua (Points chauds feux)</li>
                  <li>Global Mangrove Watch & DREDD Boeny (Surfaces mangroves & reboisement)</li>
                  <li>BNGRC / Direction Générale de la Météorologie (Risques climatiques & cyclones)</li>
                  <li>OpenStreetMap & Esri World Imagery (Fonds cartographiques)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
