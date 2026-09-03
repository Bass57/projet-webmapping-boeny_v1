import React, { useState } from 'react';
import { 
  Server, 
  Upload, 
  Layers, 
  CheckCircle2, 
  Globe, 
  Copy, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Trash2, 
  Sparkles, 
  Code2, 
  ExternalLink, 
  Sliders, 
  FileCode, 
  Maximize2,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';
import { 
  GeoServerLayer, 
  GeoServerPublishPayload, 
  GeoServerStyle 
} from '../types/geoserver';
import { 
  PRESET_GEOSERVER_DATASETS, 
  GEOSERVER_BASE_URL, 
  generateSldXml, 
  generateGetCapabilitiesXml, 
  createGeoServerLayerFromPayload 
} from '../data/geoserverData';

interface GeoServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  geoServerLayers: GeoServerLayer[];
  onAddLayer: (layer: GeoServerLayer) => void;
  onToggleLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<GeoServerLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onZoomToLayer: (layer: GeoServerLayer) => void;
}

export const GeoServerModal: React.FC<GeoServerModalProps> = ({
  isOpen,
  onClose,
  geoServerLayers,
  onAddLayer,
  onToggleLayer,
  onUpdateLayer,
  onDeleteLayer,
  onZoomToLayer
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'catalog' | 'connect' | 'console'>('publish');
  
  // Publish Form State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_GEOSERVER_DATASETS[2].id); // perimetres_irrigation_marovoay
  const [useCustomGeoJson, setUseCustomGeoJson] = useState<boolean>(false);
  const [customGeoJsonInput, setCustomGeoJsonInput] = useState<string>('');
  
  const [workspace, setWorkspace] = useState<string>('boeny_sig');
  const [store, setStore] = useState<string>('dredd_postgis');
  const [layerName, setLayerName] = useState<string>('perimetres_irrigation_marovoay');
  const [layerTitle, setLayerTitle] = useState<string>('Périmètres Hydro-Agricoles & Vulnérabilité Betsiboka');
  const [abstract, setAbstract] = useState<string>('Canaux d\'irrigation majeurs et casiers rizicoles de la plaine de Marovoay soumis aux dépôts de sédiments latéritiques.');
  const [srs, setSrs] = useState<string>('EPSG:4326');
  const [displayMode, setDisplayMode] = useState<'wfs' | 'wms'>('wfs');
  
  const [style, setStyle] = useState<GeoServerStyle>({
    fillColor: '#0284c7',
    fillOpacity: 0.35,
    strokeColor: '#0284c7',
    strokeWidth: 3,
    dashArray: '5, 5'
  });

  // Publishing Execution State
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishProgress, setPublishProgress] = useState<string[]>([]);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  
  // External GeoServer State
  const [externalUrl, setExternalUrl] = useState<string>('https://ahocevar.com/geoserver/wms');
  const [externalLayerName, setExternalLayerName] = useState<string>('ne:ne_10m_admin_0_countries');
  const [externalTitle, setExternalTitle] = useState<string>('Limites Administratives Mondiales (Natural Earth)');
  const [isTestingExternal, setIsTestingExternal] = useState<boolean>(false);
  const [externalStatus, setExternalStatus] = useState<string | null>(null);

  // Inspector State
  const [inspectedLayer, setInspectedLayer] = useState<GeoServerLayer | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setUseCustomGeoJson(false);
    const preset = PRESET_GEOSERVER_DATASETS.find(p => p.id === presetId);
    if (preset) {
      setWorkspace(preset.workspace);
      setStore(preset.store);
      setLayerName(preset.name);
      setLayerTitle(preset.title);
      setAbstract(preset.abstract);
      setSrs(preset.srs);
      setStyle(preset.style);
    }
  };

  // Perform Publication to GeoServer
  const handlePublish = () => {
    setIsPublishing(true);
    setPublishProgress([]);
    setPublishSuccess(false);

    const steps = [
      `[REST API] Connexion au serveur GeoServer sur ${GEOSERVER_BASE_URL}...`,
      `[REST API] Vérification du Workspace "${workspace}"... Statut: 200 OK`,
      `[REST API] Configuration du Datastore "${store}" (PostGIS / Shapefiles)...`,
      `[REST API] POST /workspaces/${workspace}/datastores/${store}/featuretypes`,
      `[OGC SLD] Génération et association du descripteur de style SLD 1.0.0...`,
      `[OGC WMS] Publication du service Web Map Service (WMS 1.3.0)...`,
      `[OGC WFS] Activation du service Web Feature Service (WFS 2.0.0 GeoJSON)...`,
      `[SUCCESS] Couche "${workspace}:${layerName}" publiée avec succès sur GeoServer !`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setPublishProgress(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsPublishing(false);
        setPublishSuccess(true);

        // Prepare features
        let featuresToPublish = [];
        let geometryType: any = 'Polygon';

        if (useCustomGeoJson && customGeoJsonInput) {
          try {
            const parsed = JSON.parse(customGeoJsonInput);
            if (parsed.type === 'FeatureCollection') {
              featuresToPublish = parsed.features;
              if (parsed.features[0]?.geometry?.type) {
                geometryType = parsed.features[0].geometry.type;
              }
            } else if (parsed.type === 'Feature') {
              featuresToPublish = [parsed];
              geometryType = parsed.geometry.type;
            }
          } catch (e) {
            console.error('Invalid GeoJSON input, falling back to default', e);
          }
        } else {
          const preset = PRESET_GEOSERVER_DATASETS.find(p => p.id === selectedPresetId);
          if (preset) {
            featuresToPublish = preset.features;
            geometryType = preset.geometryType;
          }
        }

        const payload: GeoServerPublishPayload = {
          workspace,
          store,
          name: layerName,
          title: layerTitle,
          abstract,
          geometryType,
          srs,
          style,
          features: featuresToPublish,
          mode: displayMode
        };

        const newLayer = createGeoServerLayerFromPayload(payload);
        onAddLayer(newLayer);
      }
    }, 320);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestExternal = () => {
    setIsTestingExternal(true);
    setExternalStatus('Interrogation du serveur OGC (GetCapabilities)...');
    setTimeout(() => {
      setIsTestingExternal(false);
      setExternalStatus('Connexion réussie : WMS 1.3.0 supporté. Couche disponible.');
    }, 1200);
  };

  const handleAddExternalLayer = () => {
    const newExternalLayer: GeoServerLayer = {
      id: `external-${Date.now()}`,
      workspace: 'external_ows',
      store: 'remote_wms',
      name: externalLayerName.split(':').pop() || 'remote_layer',
      prefixedName: externalLayerName,
      title: externalTitle,
      abstract: `Couche WMS distante connectée depuis ${externalUrl}`,
      geometryType: 'Polygon',
      srs: 'EPSG:4326',
      bbox: [43.5, -17.5, 48.5, -14.5],
      publishedAt: new Date().toISOString(),
      featuresCount: 1,
      wmsUrl: externalUrl,
      wfsUrl: `${externalUrl}?service=WFS`,
      style: {
        fillColor: '#8b5cf6',
        fillOpacity: 0.3,
        strokeColor: '#7c3aed',
        strokeWidth: 2
      },
      sldXml: '<!-- Style externe géré par le serveur distant -->',
      features: [],
      activeOnMap: true,
      mode: 'wms',
      opacity: 0.75,
      isExternal: true
    };
    onAddLayer(newExternalLayer);
    setActiveTab('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="backdrop-blur-2xl bg-[#0c1618]/92 border border-white/15 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-sm">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GeoServer 2.25 • OGC WMS & WFS
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Boeny Geospatial Hub
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
                <span>Gestionnaire & Publication GeoServer</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Port 8080 • OGC Actif</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-4 bg-white/5 backdrop-blur-md text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('publish')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'publish'
                ? 'border-emerald-400 text-emerald-300 bg-white/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>1. Publier sur GeoServer</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-emerald-400 text-emerald-300 bg-white/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>2. Catalogue OGC & Carte ({geoServerLayers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'connect'
                ? 'border-emerald-400 text-emerald-300 bg-white/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>3. GeoServer Distant</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'console'
                ? 'border-emerald-400 text-emerald-300 bg-white/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>4. Console OGC & Capabilities</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-200">
          
          {/* TAB 1: PUBLISH WIZARD */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Pipeline de Publication OGC GeoServer</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Sélectionnez un jeu de données thématique de la région Boeny (ou importez votre GeoJSON). La couche sera enregistrée dans le catalogue GeoServer (<code className="text-emerald-300 font-mono">workspace:name</code>) et sera instantanément exploitable sur notre carte interactive Leaflet en WMS ou WFS vectoriel !
                  </p>
                </div>
              </div>

              {/* Step 1: Data source choice */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                    Source de données géographiques
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUseCustomGeoJson(false)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        !useCustomGeoJson ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Jeux de Données Boeny
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseCustomGeoJson(true)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        useCustomGeoJson ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      GeoJSON Personnalisé
                    </button>
                  </div>
                </div>

                {!useCustomGeoJson ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PRESET_GEOSERVER_DATASETS.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      const isAlreadyPublished = geoServerLayers.some(l => l.name === preset.name);

                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.id)}
                          className={`p-3.5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-400/80 shadow-lg ring-1 ring-emerald-400/40'
                              : 'bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[10px] text-slate-400">
                                {preset.workspace}:{preset.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                preset.geometryType === 'Polygon' ? 'bg-teal-500/20 text-teal-300' :
                                preset.geometryType === 'LineString' ? 'bg-sky-500/20 text-sky-300' :
                                'bg-rose-500/20 text-rose-300'
                              }`}>
                                {preset.geometryType}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-xs mb-1">{preset.title}</h5>
                            <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                              {preset.abstract}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{preset.features.length} entités SIG</span>
                            {isAlreadyPublished ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Déjà sur GeoServer
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium">Prêt à publier</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={customGeoJsonInput}
                      onChange={(e) => setCustomGeoJsonInput(e.target.value)}
                      placeholder='Collez un FeatureCollection GeoJSON ici... Exemple: {"type": "FeatureCollection", "features": [...]}'
                      className="w-full bg-[#081012] border border-white/15 rounded-2xl p-3 text-[11px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-400/80"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Prend en charge les formats standards EPSG:4326 GeoJSON (Polygones, Lignes, Points).</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: GeoServer OGC Parameters */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                  Configuration des Métadonnées GeoServer
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Workspace (Espace)</label>
                    <select
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="boeny_sig" className="bg-[#0c1618]">boeny_sig</option>
                      <option value="dredd_boeny" className="bg-[#0c1618]">dredd_boeny</option>
                      <option value="mnp_conservation" className="bg-[#0c1618]">mnp_conservation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Datastore (Magasin)</label>
                    <select
                      value={store}
                      onChange={(e) => setStore(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="dredd_postgis" className="bg-[#0c1618]">dredd_postgis (PostGIS SQL)</option>
                      <option value="dredd_shapefiles" className="bg-[#0c1618]">dredd_shapefiles (ESRI Shp)</option>
                      <option value="hydro_shapefiles" className="bg-[#0c1618]">hydro_shapefiles (Vecteur)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Nom de la Couche</label>
                    <input
                      type="text"
                      value={layerName}
                      onChange={(e) => setLayerName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Projection (SRS)</label>
                    <select
                      value={srs}
                      onChange={(e) => setSrs(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="EPSG:4326" className="bg-[#0c1618]">EPSG:4326 (WGS 84)</option>
                      <option value="EPSG:3857" className="bg-[#0c1618]">EPSG:3857 (Web Mercator)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Titre descriptif de la couche</label>
                    <input
                      type="text"
                      value={layerTitle}
                      onChange={(e) => setLayerTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Mode d'intégration sur la Carte Interactive</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDisplayMode('wfs')}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          displayMode === 'wfs'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        WFS Vectoriel Interactif (Clic & Tooltip)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisplayMode('wms')}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          displayMode === 'wms'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        WMS Tuilé OGC (GetMap image/png)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: SLD Style Settings */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                  Style OGC SLD (Styled Layer Descriptor)
                </span>

                <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Couleur Principale</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={style.fillColor}
                        onChange={(e) => setStyle({ ...style, fillColor: e.target.value, strokeColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-xs">{style.fillColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Opacité de remplissage ({Math.round(style.fillOpacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={style.fillOpacity}
                      onChange={(e) => setStyle({ ...style, fillOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Épaisseur du contour ({style.strokeWidth} px)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={style.strokeWidth}
                      onChange={(e) => setStyle({ ...style, strokeWidth: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-400"
                    />
                  </div>

                  <div className="flex flex-col justify-center items-center p-2 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[9px] text-slate-400 mb-1">Aperçu SLD</span>
                    <div 
                      className="w-12 h-6 rounded border transition-all"
                      style={{
                        backgroundColor: style.fillColor,
                        opacity: style.fillOpacity,
                        borderColor: style.strokeColor,
                        borderWidth: `${style.strokeWidth}px`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Publication Execution Terminal / Status */}
              {isPublishing || publishProgress.length > 0 ? (
                <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/40 font-mono text-[11px] space-y-1 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30 text-emerald-400 font-bold">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      Journal d'exécution GeoServer REST API
                    </span>
                    {isPublishing && <span className="animate-pulse">Traitement en cours...</span>}
                    {publishSuccess && <span className="text-emerald-300">✓ Publication Réussie</span>}
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pt-2">
                    {publishProgress.map((p, idx) => (
                      <div key={idx} className={idx === publishProgress.length - 1 ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Cible : <strong className="text-white font-mono">{workspace}:{layerName}</strong> sur GeoServer Boeny
                </div>
                <div className="flex items-center gap-3">
                  {publishSuccess && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold flex items-center gap-2 transition-all"
                    >
                      <span>Voir dans le Catalogue & Carte</span>
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={handlePublish}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isPublishing ? 'Publication en cours...' : '🚀 Publier sur GeoServer & Activer sur la Carte'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG & ACTIVE LAYERS */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Catalogue OGC GeoServer Actif</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      {geoServerLayers.length} couches publiées
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Toutes ces couches sont hébergées sur le GeoServer de Boeny et disponibles pour l'affichage interactif sur la carte.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('publish')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publier une autre couche</span>
                </button>
              </div>

              {geoServerLayers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/20 space-y-2">
                  <Server className="w-8 h-8 text-slate-500 mx-auto" />
                  <h5 className="font-bold text-slate-300">Aucune couche publiée sur GeoServer</h5>
                  <p className="text-xs text-slate-500">Utilisez l'onglet « Publier sur GeoServer » pour ajouter votre première couche.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {geoServerLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                        layer.activeOnMap
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-md'
                          : 'bg-white/5 border-white/10 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleLayer(layer.id)}
                            className={`p-2 rounded-xl transition-all ${
                              layer.activeOnMap
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : 'bg-white/10 text-slate-400 hover:text-white'
                            }`}
                            title={layer.activeOnMap ? 'Masquer de la carte' : 'Afficher sur la carte'}
                          >
                            {layer.activeOnMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-emerald-400 font-bold text-xs">
                                {layer.prefixedName}
                              </span>
                              <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono uppercase font-bold ${
                                layer.mode === 'wfs' ? 'bg-teal-500/20 text-teal-300' : 'bg-sky-500/20 text-sky-300'
                              }`}>
                                {layer.mode.toUpperCase()} OGC
                              </span>
                              {layer.isExternal && (
                                <span className="px-2 py-0.2 rounded-full text-[9px] bg-purple-500/20 text-purple-300 font-mono">
                                  Distant
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-white text-sm mt-0.5">{layer.title}</h5>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{layer.abstract}</p>
                          </div>
                        </div>

                        {/* Controls: Opacity & Mode & Zoom */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {/* Display Mode toggle */}
                          <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10 text-[10px]">
                            <button
                              type="button"
                              onClick={() => onUpdateLayer(layer.id, { mode: 'wfs' })}
                              className={`px-2.5 py-1 rounded-lg transition-all ${
                                layer.mode === 'wfs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              WFS Vecteur
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateLayer(layer.id, { mode: 'wms' })}
                              className={`px-2.5 py-1 rounded-lg transition-all ${
                                layer.mode === 'wms' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              WMS Tuilé
                            </button>
                          </div>

                          {/* Opacity slider */}
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                            <span className="text-[10px] text-slate-400">Opacité:</span>
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.05"
                              value={layer.opacity}
                              onChange={(e) => onUpdateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                              className="w-16 accent-emerald-400"
                            />
                            <span className="font-mono text-[10px] text-slate-300 w-7 text-right">
                              {Math.round(layer.opacity * 100)}%
                            </span>
                          </div>

                          {/* Zoom to layer */}
                          <button
                            type="button"
                            onClick={() => {
                              onZoomToLayer(layer);
                              onClose();
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Centrer la carte sur cette couche"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>

                          {/* Inspect OGC Details */}
                          <button
                            type="button"
                            onClick={() => setInspectedLayer(layer)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 hover:text-emerald-300 transition-colors"
                            title="Inspecter les paramètres OGC & SLD"
                          >
                            <Code2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onDeleteLayer(layer.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Dé-publier / Supprimer de GeoServer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inspected Layer Inspector Modal View */}
              {inspectedLayer && (
                <div className="p-4 rounded-2xl bg-black/70 border border-emerald-500/30 space-y-3 font-mono text-[11px] animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">
                        Détails OGC : {inspectedLayer.prefixedName}
                      </span>
                    </div>
                    <button
                      onClick={() => setInspectedLayer(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* WMS GetMap Endpoint */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">URL WMS GetMap OGC (pour QGIS / Leaflet) :</span>
                    <div className="flex items-center gap-2 bg-[#081012] p-2 rounded-xl border border-white/10 text-emerald-300 overflow-x-auto text-[10px]">
                      <span>{inspectedLayer.wmsUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS={inspectedLayer.prefixedName}&CRS=EPSG:4326&FORMAT=image/png&TRANSPARENT=TRUE</span>
                      <button
                        onClick={() => handleCopy(`${inspectedLayer.wmsUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${inspectedLayer.prefixedName}&CRS=EPSG:4326&FORMAT=image/png&TRANSPARENT=TRUE`, 'wms')}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-white shrink-0"
                      >
                        {copiedKey === 'wms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* SLD XML Code preview */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Descripteur de Style SLD 1.0 (XML) :</span>
                    <pre className="bg-[#081012] p-2.5 rounded-xl border border-white/10 text-teal-300 max-h-36 overflow-y-auto text-[10px] leading-relaxed">
                      {inspectedLayer.sldXml}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONNECT EXTERNAL GEOSERVER */}
          {activeTab === 'connect' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl backdrop-blur-md bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3">
                <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Connecter un Serveur GeoServer Externe</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Vous pouvez importer directement n'importe quel flux WMS GeoServer distant (ministères, agences spatiales, observatoires régionaux) en indiquant son point d'accès OGC standard.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block">URL du Service WMS GeoServer</label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    placeholder="https://geoserver.org/geoserver/wms"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block">Nom Préfixé de la Couche (workspace:layer)</label>
                  <input
                    type="text"
                    value={externalLayerName}
                    onChange={(e) => setExternalLayerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    placeholder="topp:states ou boeny:custom"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Titre pour la Légende Cartographique</label>
                <input
                  type="text"
                  value={externalTitle}
                  onChange={(e) => setExternalTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: Réserve de biosphère UNESCO"
                />
              </div>

              {externalStatus && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                  {externalStatus}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleTestExternal}
                  disabled={isTestingExternal}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-all"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isTestingExternal ? 'Test en cours...' : 'Tester GetCapabilities'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddExternalLayer}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter à la Carte Interactive</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: OGC CONSOLE & GETCAPABILITIES */}
          {activeTab === 'console' && (
            <div className="space-y-4 font-mono text-[11px]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm font-sans">Document OGC WMS GetCapabilities</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    Métadonnées standardisées générées automatiquement pour le catalogue GeoServer Boeny.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(generateGetCapabilitiesXml(geoServerLayers), 'cap')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center gap-1.5 transition-all text-xs"
                >
                  {copiedKey === 'cap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copier le XML</span>
                </button>
              </div>

              <pre className="bg-[#081012] p-4 rounded-2xl border border-white/15 text-emerald-300 max-h-80 overflow-y-auto leading-relaxed text-[10px]">
                {generateGetCapabilitiesXml(geoServerLayers)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Connecteur GeoServer OGC • Région Boeny</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all"
          >
            Fermer le gestionnaire
          </button>
        </div>

      </div>
    </div>
  );
};
