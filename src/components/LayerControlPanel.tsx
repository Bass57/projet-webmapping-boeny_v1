import React, { useState } from 'react';
import { 
  Layers, 
  Map, 
  Flame, 
  Trees, 
  Droplets, 
  ShieldCheck, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Sliders, 
  Globe,
  Server,
  Plus
} from 'lucide-react';
import { BasemapId, LayerVisibility, ChoroplethMetric } from '../types';
import { GeoServerLayer } from '../types/geoserver';
import { BASEMAP_CONFIGS } from '../data/boenyData';

interface LayerControlPanelProps {
  activeBasemap: BasemapId;
  onSelectBasemap: (id: BasemapId) => void;
  layers: LayerVisibility;
  onToggleLayer: (layerKey: keyof LayerVisibility) => void;
  choroplethMetric: ChoroplethMetric;
  onChangeChoropleth: (metric: ChoroplethMetric) => void;
  selectedFireYear: number | 'all';
  onChangeFireYear: (year: number | 'all') => void;
  districtCount: number;
  paCount: number;
  mangroveCount: number;
  fireCount: number;
  hydrologyCount: number;
  projectCount: number;
  geoServerLayers: GeoServerLayer[];
  onToggleGeoServerLayer: (id: string) => void;
  onOpenGeoServerModal: () => void;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  activeBasemap,
  onSelectBasemap,
  layers,
  onToggleLayer,
  choroplethMetric,
  onChangeChoropleth,
  selectedFireYear,
  onChangeFireYear,
  districtCount,
  paCount,
  mangroveCount,
  fireCount,
  hydrologyCount,
  projectCount,
  geoServerLayers,
  onToggleGeoServerLayer,
  onOpenGeoServerModal
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'layers' | 'geoserver' | 'thematic' | 'basemap'>('layers');

  return (
    <aside 
      aria-label="Gestionnaire de couches SIG"
      className={`absolute top-20 left-4 z-20 backdrop-blur-xl bg-[#0c1618]/85 border border-white/15 rounded-2xl shadow-2xl transition-all duration-300 w-80 text-slate-100 overflow-hidden ${
        isCollapsed ? 'h-12' : 'max-h-[calc(100vh-6.5rem)] flex flex-col'
      }`}
    >
      {/* Panel Header */}
      <div 
        className="h-12 px-4 flex items-center justify-between bg-white/5 border-b border-white/10 cursor-pointer select-none backdrop-blur-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Couches Environnementales
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-emerald-300 font-mono">
            Boeny
          </span>
          <button 
            type="button"
            aria-label={isCollapsed ? "Développer le panneau" : "Réduire le panneau"}
            className="p-1 text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Sub-tabs */}
          <div className="flex border-b border-white/10 text-[11px] font-semibold bg-white/5">
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                activeTab === 'layers'
                  ? 'border-emerald-400 text-emerald-300 bg-white/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Couches
            </button>
            <button
              onClick={() => setActiveTab('geoserver')}
              className={`flex-1 py-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1 ${
                activeTab === 'geoserver'
                  ? 'border-emerald-400 text-emerald-300 bg-white/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>GeoServer</span>
              {geoServerLayers.filter(l => l.activeOnMap).length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('thematic')}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                activeTab === 'thematic'
                  ? 'border-emerald-400 text-emerald-300 bg-white/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Thèmes
            </button>
            <button
              onClick={() => setActiveTab('basemap')}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                activeTab === 'basemap'
                  ? 'border-emerald-400 text-emerald-300 bg-white/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Fonds
            </button>
          </div>

          <div className="p-3.5 overflow-y-auto space-y-3 flex-1">
            {/* TAB 1: LAYERS */}
            {activeTab === 'layers' && (
              <div className="space-y-2.5">
                {/* Districts Layer */}
                <div 
                  onClick={() => onToggleLayer('districts')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                    layers.districts 
                      ? 'bg-emerald-500/15 border-emerald-500/30 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded border border-amber-400/80 bg-amber-400/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-sm bg-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100">Districts de Boeny</span>
                      <p className="text-[10px] text-slate-400">{districtCount} entités administratives</p>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.districts ? 'bg-emerald-500' : 'bg-slate-700/80'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.districts ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                {/* Protected Areas */}
                <div 
                  onClick={() => onToggleLayer('protectedAreas')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                    layers.protectedAreas 
                      ? 'bg-emerald-500/15 border-emerald-500/30 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded border border-emerald-400 bg-emerald-500/30 flex items-center justify-center">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-300" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100">Aires Protégées (MNP/RAMSAR)</span>
                      <p className="text-[10px] text-slate-400">{paCount} parcs & réserves</p>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.protectedAreas ? 'bg-emerald-500' : 'bg-slate-700/80'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.protectedAreas ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                {/* Mangroves */}
                <div 
                  onClick={() => onToggleLayer('mangroves')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                    layers.mangroves 
                      ? 'bg-emerald-500/15 border-emerald-500/30 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded border border-teal-400 bg-teal-500/30 flex items-center justify-center">
                      <Trees className="w-2.5 h-2.5 text-teal-300" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100">Zones de Mangroves</span>
                      <p className="text-[10px] text-slate-400">{mangroveCount} massifs côtiers majeurs</p>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.mangroves ? 'bg-emerald-500' : 'bg-slate-700/80'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.mangroves ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                {/* Fire Hotspots */}
                <div className={`p-2.5 rounded-xl border backdrop-blur-md transition-all space-y-2 ${
                  layers.fireAlerts 
                    ? 'bg-rose-500/15 border-rose-500/30 shadow-sm' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}>
                  <div 
                    onClick={() => onToggleLayer('fireAlerts')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded border border-rose-500 bg-rose-500/30 flex items-center justify-center">
                        <Flame className="w-2.5 h-2.5 text-rose-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-100">Feux de Brousse (VIIRS)</span>
                        <p className="text-[10px] text-slate-400">{fireCount} alertes détectées</p>
                      </div>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.fireAlerts ? 'bg-rose-500' : 'bg-slate-700/80'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.fireAlerts ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>

                  {layers.fireAlerts && (
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                      <span className="text-[10px] text-slate-400">Année :</span>
                      {(['all', 2024, 2023] as const).map((yr) => (
                        <button
                          key={yr}
                          onClick={() => onChangeFireYear(yr)}
                          className={`px-2 py-0.5 text-[10px] rounded-lg font-medium transition-colors ${
                            selectedFireYear === yr
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {yr === 'all' ? 'Toutes' : yr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hydrology */}
                <div 
                  onClick={() => onToggleLayer('hydrology')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                    layers.hydrology 
                      ? 'bg-sky-500/15 border-sky-500/30 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded border border-sky-400 bg-sky-500/30 flex items-center justify-center">
                      <Droplets className="w-2.5 h-2.5 text-sky-300" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100">Hydrologie & Fleuves</span>
                      <p className="text-[10px] text-slate-400">{hydrologyCount} cours d'eau & lacs</p>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.hydrology ? 'bg-sky-500' : 'bg-slate-700/80'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.hydrology ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                {/* Ecological Projects */}
                <div 
                  onClick={() => onToggleLayer('ecoProjects')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                    layers.ecoProjects 
                      ? 'bg-indigo-500/15 border-indigo-500/30 shadow-sm' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded border border-indigo-400 bg-indigo-500/30 flex items-center justify-center">
                      <Briefcase className="w-2.5 h-2.5 text-indigo-300" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100">Projets & Stations DREDD</span>
                      <p className="text-[10px] text-slate-400">{projectCount} initiatives actives</p>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${layers.ecoProjects ? 'bg-indigo-500' : 'bg-slate-700/80'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layers.ecoProjects ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GEOSERVER OGC */}
            {activeTab === 'geoserver' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Couches GeoServer</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {geoServerLayers.filter((l) => l.activeOnMap).length}/{geoServerLayers.length} actives
                  </span>
                </div>

                {/* Direct action button to publish/manage */}
                <button
                  onClick={onOpenGeoServerModal}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publier / Gérer GeoServer</span>
                </button>

                <div className="space-y-2">
                  {geoServerLayers.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-400 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                      <p>Aucune couche publiée.</p>
                      <button
                        onClick={onOpenGeoServerModal}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Créer une publication GeoServer
                      </button>
                    </div>
                  ) : (
                    geoServerLayers.map((layer) => (
                      <div
                        key={layer.id}
                        onClick={() => onToggleGeoServerLayer(layer.id)}
                        className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                          layer.activeOnMap
                            ? 'bg-emerald-500/15 border-emerald-500/30 shadow-sm'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-4 h-4 rounded border flex-shrink-0"
                              style={{
                                backgroundColor: layer.style.fillColor,
                                borderColor: layer.style.strokeColor,
                                borderWidth: '1.5px'
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-100">{layer.title}</span>
                              </div>
                              <p className="text-[10px] font-mono text-emerald-400">
                                {layer.prefixedName} • {layer.mode.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className={`w-9 h-5 rounded-full relative transition-colors ${layer.activeOnMap ? 'bg-emerald-500' : 'bg-slate-700/80'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${layer.activeOnMap ? 'right-1' : 'left-1'}`} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Interopérabilité OGC :</strong> Les couches sont servies selon les spécifications WMS 1.3.0 et WFS 2.0.0. Cliquez sur une entité de la carte pour inspecter ses attributs.
                </div>
              </div>
            )}

            {/* TAB 2: THEMATIC CHOROPLETH */}
            {activeTab === 'thematic' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-300">
                  Colorer les districts selon un indicateur environnemental :
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'none', label: 'Contours standards', desc: 'Délimitation simple sans remplissage thématique' },
                    { id: 'pressure', label: 'Indice de pression écologique', desc: 'Niveaux de vulnérabilité (Faible à Critique)' },
                    { id: 'forest', label: 'Taux de couvert forestier (%)', desc: 'Dégradé du vert clair au vert forêt dense' },
                    { id: 'fires', label: 'Intensité des feux 2024', desc: 'Dégradé orange à pourpre selon le nombre d\'alertes' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onChangeChoropleth(option.id as ChoroplethMetric)}
                      className={`w-full p-3 rounded-xl border text-left backdrop-blur-md transition-all ${
                        choroplethMetric === option.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/10'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{option.label}</span>
                        {choroplethMetric === option.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{option.desc}</p>
                    </button>
                  ))}
                </div>

                {choroplethMetric === 'pressure' && (
                  <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 text-[10px] space-y-1.5">
                    <span className="font-semibold text-slate-200">Légende de vulnérabilité :</span>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"/> Faible</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500 inline-block"/> Modérée</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-600 inline-block"/> Élevée</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-600 inline-block"/> Critique (Ambato-Boeny, Mahajanga I)</div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BASEMAP */}
            {activeTab === 'basemap' && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-300 mb-1">
                  Choisir le fond cartographique adapté à l'observation :
                </div>

                {(Object.keys(BASEMAP_CONFIGS) as BasemapId[]).map((key) => {
                  const cfg = BASEMAP_CONFIGS[key];
                  const isSelected = activeBasemap === key;
                  return (
                    <button
                      key={key}
                      onClick={() => onSelectBasemap(key)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left backdrop-blur-md transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/10'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Map className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <div>
                          <span className="text-xs font-semibold block">{cfg.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {key === 'satellite' && 'Imagerie haute résolution pour végétation'}
                            {key === 'streets' && 'Toponymie et routes nationales (RN4)'}
                            {key === 'topo' && 'Courbes de niveau et relief des plateaux'}
                            {key === 'dark' && 'Contraste optimal pour les feux de brousse'}
                          </span>
                        </div>
                      </div>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};
