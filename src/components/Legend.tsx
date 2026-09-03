import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Server } from 'lucide-react';
import { LayerVisibility, ChoroplethMetric } from '../types';
import { GeoServerLayer } from '../types/geoserver';

interface LegendProps {
  layers: LayerVisibility;
  choroplethMetric: ChoroplethMetric;
  geoServerLayers?: GeoServerLayer[];
}

export const Legend: React.FC<LegendProps> = ({ layers, choroplethMetric, geoServerLayers = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const activeGeoServerLayers = geoServerLayers.filter((l) => l.activeOnMap);

  return (
    <div className="absolute bottom-6 left-4 z-20 backdrop-blur-xl bg-[#0c1618]/85 border border-white/15 rounded-2xl shadow-2xl text-slate-200 text-xs overflow-hidden w-64">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between cursor-pointer select-none backdrop-blur-md"
      >
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Légende Cartographique
        </span>
        <button 
          type="button"
          aria-label={isOpen ? "Réduire la légende" : "Développer la légende"}
          className="text-slate-400 hover:text-white"
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-3 space-y-2.5 text-[11px] max-h-56 overflow-y-auto">
          {/* Districts Legend */}
          {layers.districts && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Limites Administratives</span>
              {choroplethMetric === 'none' && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2.5 rounded-sm border border-amber-400 bg-amber-400/20" />
                  <span>Limite de District Boeny</span>
                </div>
              )}
              {choroplethMetric === 'pressure' && (
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Faible
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Modérée
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-600" /> Élevée
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" /> Critique
                  </div>
                </div>
              )}
              {choroplethMetric === 'forest' && (
                <div className="space-y-1 text-[10px]">
                  <span>Couvert forestier (%) :</span>
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-900" />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>4% (Urbain)</span>
                    <span>36% (Dense)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Protected Areas Legend */}
          {layers.protectedAreas && (
            <div className="flex items-center gap-2 pt-1.5 border-t border-white/10">
              <div className="w-4 h-2.5 rounded-sm border border-emerald-400 bg-emerald-500/40" />
              <span>Aire Protégée (MNP / RAMSAR)</span>
            </div>
          )}

          {/* Mangroves Legend */}
          {layers.mangroves && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-2.5 rounded-sm border border-teal-400 bg-teal-500/40" />
              <span>Forêt de Mangrove (Carbone Bleu)</span>
            </div>
          )}

          {/* Fire Alerts Legend */}
          {layers.fireAlerts && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 shadow-sm shadow-rose-500/50" />
              <span>Alerte Feu Satellite (VIIRS / MODIS)</span>
            </div>
          )}

          {/* Hydrology Legend */}
          {layers.hydrology && (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded-full bg-rose-600" />
                <span>Fleuve Betsiboka (Alluvions rouges)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded-full bg-sky-500" />
                <span>Cours d'eau & Lacs (ex: Kinkony)</span>
              </div>
            </div>
          )}

          {/* Projects Legend */}
          {layers.ecoProjects && (
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white" />
              <span>Station / Projet DREDD</span>
            </div>
          )}

          {/* GeoServer Published Layers Legend */}
          {activeGeoServerLayers.length > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t border-white/10">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Server className="w-3 h-3" /> GeoServer OGC ({activeGeoServerLayers.length})
              </span>
              {activeGeoServerLayers.map((gl) => (
                <div key={gl.id} className="flex items-center gap-2">
                  <div 
                    className="w-3.5 h-2 rounded-sm border shrink-0"
                    style={{
                      backgroundColor: gl.style.fillColor,
                      borderColor: gl.style.strokeColor,
                      borderWidth: '1.5px',
                      opacity: gl.opacity
                    }}
                  />
                  <span className="truncate" title={gl.title}>
                    {gl.title} <span className="text-[9px] text-slate-400">({gl.mode.toUpperCase()})</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
