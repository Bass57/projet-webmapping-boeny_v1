import React from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Trees, 
  Droplets, 
  Briefcase, 
  Compass, 
  ExternalLink,
  Users,
  Activity,
  Server
} from 'lucide-react';

interface FeatureDetailModalProps {
  feature: any;
  onClose: () => void;
  onZoomTo: (coords: [number, number], zoom: number) => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  feature,
  onClose,
  onZoomTo
}) => {
  if (!feature) return null;

  // Identify the feature type
  const isGeoServer = Boolean(feature.isGeoServer || feature.geoserverLayer);
  const isDistrict = !isGeoServer && 'chefLieu' in feature;
  const isProtectedArea = !isGeoServer && 'managingEntity' in feature && 'keySpecies' in feature;
  const isMangrove = !isGeoServer && 'healthStatus' in feature && 'mainSpecies' in feature;
  const isFire = !isGeoServer && 'brightnessKelvin' in feature;
  const isHydrology = !isGeoServer && 'sedimentationRisk' in feature;
  const isProject = !isGeoServer && 'budget' in feature && 'theme' in feature;

  const getCoordinates = (): [number, number] => {
    if (feature.center) return feature.center;
    if (isGeoServer && feature.geometry) {
      const geom = feature.geometry;
      if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
        return [geom.coordinates[1], geom.coordinates[0]];
      }
      if (geom.type === 'Polygon' && Array.isArray(geom.coordinates[0])) {
        const ring = geom.coordinates[0];
        const avgLat = ring.reduce((acc: number, c: number[]) => acc + c[1], 0) / ring.length;
        const avgLng = ring.reduce((acc: number, c: number[]) => acc + c[0], 0) / ring.length;
        return [avgLat, avgLng];
      }
      if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
        const mid = geom.coordinates[Math.floor(geom.coordinates.length / 2)];
        return [mid[1], mid[0]];
      }
    }
    if (feature.coordinates) {
      if (Array.isArray(feature.coordinates[0])) {
        return feature.coordinates[Math.floor(feature.coordinates.length / 2)] as [number, number];
      }
      return feature.coordinates as [number, number];
    }
    return [-16.05, 46.35];
  };

  const coords = getCoordinates();

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="backdrop-blur-2xl bg-[#0c1618]/90 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Header with color indicator */}
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 mt-0.5 text-emerald-400 shadow-sm">
              {isGeoServer && <Server className="w-5 h-5 text-emerald-400" />}
              {isDistrict && <MapPin className="w-5 h-5 text-amber-400" />}
              {isProtectedArea && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              {isMangrove && <Trees className="w-5 h-5 text-teal-400" />}
              {isFire && <Flame className="w-5 h-5 text-rose-500" />}
              {isHydrology && <Droplets className="w-5 h-5 text-sky-400" />}
              {isProject && <Briefcase className="w-5 h-5 text-indigo-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                  {isGeoServer && 'Couche GeoServer OGC'}
                  {isDistrict && 'District Administratif'}
                  {isProtectedArea && feature.type}
                  {isMangrove && 'Écosystème Mangrove'}
                  {isFire && 'Alerte Feu Satellite'}
                  {isHydrology && feature.type}
                  {isProject && 'Projet Environnemental'}
                </span>
                {isGeoServer && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {feature.geoserverLayer?.prefixedName || 'OGC WFS'}
                  </span>
                )}
                {isDistrict && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    feature.pressureIndex === 'Critique' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    Pression {feature.pressureIndex}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                {feature.name || feature.title || feature.properties?.nom || feature.properties?.code_parcelle || feature.properties?.identifiant || feature.properties?.concession || feature.properties?.poste || `Point chaud #${feature.id}`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Main Description */}
          {feature.description && (
            <p className="text-slate-300 leading-relaxed backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
              {feature.description}
            </p>
          )}

          {/* DISTRICT METRICS */}
          {isDistrict && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Chef-lieu</span>
                  <span className="font-semibold text-white">{feature.chefLieu}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Superficie</span>
                  <span className="font-semibold text-white">{feature.surfaceKm2.toLocaleString('fr-FR')} km²</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Population est.</span>
                  <span className="font-semibold text-white">{feature.population.toLocaleString('fr-FR')} hab.</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Couvert Forestier</span>
                  <span className="font-semibold text-emerald-400">{feature.forestCoverPct}%</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Mangroves</span>
                  <span className="font-semibold text-teal-400">{feature.mangroveAreaHa.toLocaleString('fr-FR')} ha</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Feux détectés (2024)</span>
                  <span className="font-semibold text-rose-400">{feature.fireHotspots2024} alertes</span>
                </div>
              </div>

              {/* Main Threats */}
              {feature.mainThreats && (
                <div>
                  <span className="font-semibold text-slate-200 block mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Pressions & Menaces Majeures :
                  </span>
                  <ul className="space-y-1 pl-2">
                    {feature.mainThreats.map((threat: string, i: number) => (
                      <li key={i} className="text-slate-400 flex items-start gap-1.5">
                        <span className="text-amber-400">•</span> {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PROTECTED AREA DETAILS */}
          {isProtectedArea && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Superficie Officielle</span>
                  <span className="font-semibold text-emerald-400">{feature.surfaceHa.toLocaleString('fr-FR')} ha</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Catégorie UICN</span>
                  <span className="font-semibold text-white">Catégorie {feature.iucnCategory}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 col-span-2">
                  <span className="text-[10px] text-slate-400 block">Organisme Gestionnaire</span>
                  <span className="font-semibold text-white">{feature.managingEntity}</span>
                </div>
              </div>

              {/* Key Species */}
              {feature.keySpecies && (
                <div>
                  <span className="font-semibold text-slate-200 block mb-1.5">
                    Espèces Faunistiques & Floristiques Clés :
                  </span>
                  <div className="space-y-1.5">
                    {feature.keySpecies.map((sp: any) => (
                      <div key={sp.scientificName} className="flex items-center justify-between p-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                        <div>
                          <span className="font-medium text-slate-200">{sp.name}</span>
                          <span className="italic text-slate-400 text-[10px] ml-1.5">({sp.scientificName})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          sp.status === 'CR' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          UICN: {sp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threats */}
              {feature.threats && (
                <div>
                  <span className="font-semibold text-rose-300 block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Menaces écologiques identifiées :
                  </span>
                  <ul className="space-y-0.5 text-slate-400 pl-2">
                    {feature.threats.map((t: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-rose-400">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* MANGROVE ZONE DETAILS */}
          {isMangrove && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Superficie</span>
                  <span className="font-semibold text-teal-400">{feature.areaHa.toLocaleString('fr-FR')} ha</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">État de Santé</span>
                  <span className="font-semibold text-emerald-400">{feature.healthStatus}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-200 block mb-1">Espèces dominantes de palétuviers :</span>
                <div className="flex flex-wrap gap-1.5">
                  {feature.mainSpecies.map((sp: string) => (
                    <span key={sp} className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25 italic text-[11px] backdrop-blur-sm">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <span className="font-semibold text-slate-200 block mb-1">Actions de restauration associées :</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">{feature.restorationProjects}</p>
              </div>
            </div>
          )}

          {/* FIRE ALERT DETAILS */}
          {isFire && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Date de détection</span>
                  <span className="font-semibold text-white">{feature.date}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Capteur Satellite</span>
                  <span className="font-semibold text-amber-400">{feature.sensor}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Température Brill.</span>
                  <span className="font-semibold text-rose-400">{feature.brightnessKelvin} K</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Indice de Confiance</span>
                  <span className="font-semibold text-emerald-400">{feature.confidence}%</span>
                </div>
              </div>

              <div className="p-3 bg-rose-500/10 backdrop-blur-md rounded-2xl border border-rose-500/20">
                <span className="font-semibold text-rose-300 block mb-0.5">Typologie suspectée :</span>
                <p className="text-slate-200">{feature.type}</p>
                {feature.nearProtectedArea && (
                  <p className="text-rose-400 text-[10px] mt-1.5 font-medium">
                    ⚠️ Proximité immédiate : {feature.nearProtectedArea}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* HYDROLOGY DETAILS */}
          {isHydrology && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Dimension</span>
                  <span className="font-semibold text-sky-400">{feature.lengthKmOrAreaHa}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Risque Sédimentation</span>
                  <span className="font-semibold text-amber-400">{feature.sedimentationRisk}</span>
                </div>
              </div>
            </div>
          )}

          {/* GEOSERVER OGC ATTRIBUTES */}
          {isGeoServer && (
            <div className="space-y-3">
              <div className="p-3 backdrop-blur-md bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-emerald-300">
                  <span>WFS Feature ID : {feature.id || 'N/A'}</span>
                  <span>EPSG:4326</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {feature.geoserverLayer?.title || 'Entité issue du serveur cartographique GeoServer de la Région Boeny.'}
                </p>
              </div>

              {feature.properties && Object.keys(feature.properties).length > 0 && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-200 block text-[11px] flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    Table Attributaire OGC WFS :
                  </span>
                  <div className="max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
                    {Object.entries(feature.properties).map(([k, v]) => (
                      <div key={k} className="p-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400 capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-white text-right max-w-[60%] truncate">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROJECT DETAILS */}
          {isProject && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Budget / Financement</span>
                  <span className="font-semibold text-indigo-300">{feature.budget}</span>
                </div>
                <div className="p-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Année de lancement</span>
                  <span className="font-semibold text-white">{feature.yearStart} ({feature.status})</span>
                </div>
              </div>

              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <span className="font-semibold text-slate-200 block mb-1">Objectifs opérationnels :</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{feature.objectives}</p>
              </div>

              <div className="p-3 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <span className="font-semibold text-slate-200 block mb-1">Bénéficiaires directs :</span>
                <p className="text-slate-400 text-[11px]">{feature.beneficiaries}</p>
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        <div className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={() => onZoomTo(coords, isDistrict ? 10 : 12)}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400/50 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Centrer sur la carte</span>
          </button>
        </div>

      </div>
    </div>
  );
};
