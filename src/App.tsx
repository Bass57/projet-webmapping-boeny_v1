import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { LayerControlPanel } from './components/LayerControlPanel';
import { StatsDrawer } from './components/StatsDrawer';
import { FeatureDetailModal } from './components/FeatureDetailModal';
import { EnvironmentalReportModal } from './components/EnvironmentalReportModal';
import { GeoServerModal } from './components/GeoServerModal';
import { Legend } from './components/Legend';
import { 
  BasemapId, 
  LayerVisibility, 
  ChoroplethMetric 
} from './types';
import { GeoServerLayer } from './types/geoserver';
import { INITIAL_GEOSERVER_LAYERS } from './data/geoserverData';
import { 
  BOENY_CENTER, 
  DISTRICTS_DATA, 
  PROTECTED_AREAS_DATA, 
  MANGROVE_ZONES_DATA, 
  FIRE_ALERTS_DATA, 
  HYDROLOGY_DATA, 
  ECO_PROJECTS_DATA 
} from './data/boenyData';

export default function App() {
  // Basemap State
  const [activeBasemap, setActiveBasemap] = useState<BasemapId>('satellite');

  // Layer Visibility State
  const [layers, setLayers] = useState<LayerVisibility>({
    districts: true,
    protectedAreas: true,
    mangroves: true,
    fireAlerts: true,
    hydrology: true,
    ecoProjects: true,
    fireHeatmap: false
  });

  // GeoServer Published Layers State
  const [geoServerLayers, setGeoServerLayers] = useState<GeoServerLayer[]>(INITIAL_GEOSERVER_LAYERS);
  const [isGeoServerModalOpen, setIsGeoServerModalOpen] = useState<boolean>(false);

  // Thematic Choropleth State
  const [choroplethMetric, setChoroplethMetric] = useState<ChoroplethMetric>('pressure');

  // Fire Filter State
  const [selectedFireYear, setSelectedFireYear] = useState<number | 'all'>('all');

  // UI Modals & Drawers State
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Map Navigation State
  const [flyToTarget, setFlyToTarget] = useState<{ coords: [number, number]; zoom: number; timestamp: number } | null>(null);

  const handleToggleLayer = useCallback((layerKey: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  const handleResetView = useCallback(() => {
    setFlyToTarget({ coords: BOENY_CENTER, zoom: 9, timestamp: Date.now() });
  }, []);

  const handleFlyTo = useCallback((coords: [number, number], zoom: number) => {
    setFlyToTarget({ coords, zoom, timestamp: Date.now() });
  }, []);

  // GeoServer Layer Handlers
  const handleAddGeoServerLayer = useCallback((newLayer: GeoServerLayer) => {
    setGeoServerLayers((prev) => {
      // replace if exists with same name, otherwise prepend
      const filtered = prev.filter((l) => l.name !== newLayer.name);
      return [newLayer, ...filtered];
    });
  }, []);

  const handleToggleGeoServerLayer = useCallback((id: string) => {
    setGeoServerLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, activeOnMap: !layer.activeOnMap } : layer
      )
    );
  }, []);

  const handleUpdateGeoServerLayer = useCallback((id: string, updates: Partial<GeoServerLayer>) => {
    setGeoServerLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  const handleDeleteGeoServerLayer = useCallback((id: string) => {
    setGeoServerLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleZoomToGeoServerLayer = useCallback((layer: GeoServerLayer) => {
    if (layer.bbox && layer.bbox.length === 4) {
      const centerLat = (layer.bbox[1] + layer.bbox[3]) / 2;
      const centerLng = (layer.bbox[0] + layer.bbox[2]) / 2;
      handleFlyTo([centerLat, centerLng], 11);
    } else {
      handleFlyTo(BOENY_CENTER, 10);
    }
  }, [handleFlyTo]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c1618] text-slate-100 font-sans select-none relative">
      {/* Frosted Glass Ambient Lighting Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-900/25 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] right-[-50px] w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[200px] right-[100px] w-[300px] h-[300px] bg-teal-800/15 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Subtle Dot Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 0.6px, transparent 0.6px)', backgroundSize: '24px 24px' }} 
      />

      {/* Top Navigation Bar */}
      <Navbar
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenGeoServer={() => setIsGeoServerModalOpen(true)}
        onResetView={handleResetView}
        isMeasuring={isMeasuring}
        onToggleMeasure={() => setIsMeasuring(!isMeasuring)}
        onSelectFeature={(feat) => setSelectedFeature(feat)}
        onFlyTo={handleFlyTo}
        geoServerLayerCount={geoServerLayers.filter((l) => l.activeOnMap).length}
      />

      {/* Main Interactive Map Canvas */}
      <main className="relative flex-1 w-full h-full overflow-hidden z-10">
        <MapView
          activeBasemap={activeBasemap}
          layers={layers}
          choroplethMetric={choroplethMetric}
          selectedFireYear={selectedFireYear}
          onSelectFeature={(feat) => setSelectedFeature(feat)}
          isMeasuring={isMeasuring}
          onToggleMeasure={() => setIsMeasuring(!isMeasuring)}
          flyToTarget={flyToTarget}
          geoServerLayers={geoServerLayers}
        />

        {/* Floating GIS Layer Manager */}
        <LayerControlPanel
          activeBasemap={activeBasemap}
          onSelectBasemap={setActiveBasemap}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          choroplethMetric={choroplethMetric}
          onChangeChoropleth={setChoroplethMetric}
          selectedFireYear={selectedFireYear}
          onChangeFireYear={setSelectedFireYear}
          districtCount={DISTRICTS_DATA.length}
          paCount={PROTECTED_AREAS_DATA.length}
          mangroveCount={MANGROVE_ZONES_DATA.length}
          fireCount={FIRE_ALERTS_DATA.length}
          hydrologyCount={HYDROLOGY_DATA.length}
          projectCount={ECO_PROJECTS_DATA.length}
          geoServerLayers={geoServerLayers}
          onToggleGeoServerLayer={handleToggleGeoServerLayer}
          onOpenGeoServerModal={() => setIsGeoServerModalOpen(true)}
        />

        {/* Dynamic Map Legend */}
        <Legend 
          layers={layers} 
          choroplethMetric={choroplethMetric} 
          geoServerLayers={geoServerLayers}
        />

        {/* Selected Feature Card */}
        {selectedFeature && (
          <FeatureDetailModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            onZoomTo={handleFlyTo}
          />
        )}
      </main>

      {/* Frosted Glass Footer Status Bar */}
      <footer className="h-9 px-6 flex items-center justify-between backdrop-blur-xl bg-white/5 border-t border-white/10 text-[10px] text-slate-400 z-30 select-none">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 font-medium">© Observatoire Environnemental de Boeny • Madagascar</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Services OGC: GeoServer 2.25 (WMS 1.3.0 & WFS 2.0.0)</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={() => setIsGeoServerModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] hover:bg-emerald-500/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GeoServer Boeny ({geoServerLayers.filter((l) => l.activeOnMap).length} couches)</span>
          </button>
        </div>
      </footer>

      {/* Environmental Statistics Drawer */}
      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onSelectDistrict={(district) => {
          setSelectedFeature(district);
          handleFlyTo(district.center, 10);
        }}
      />

      {/* Territorial Environmental Report Modal */}
      <EnvironmentalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* GeoServer OGC Publishing & Layer Management Modal */}
      <GeoServerModal
        isOpen={isGeoServerModalOpen}
        onClose={() => setIsGeoServerModalOpen(false)}
        geoServerLayers={geoServerLayers}
        onAddLayer={handleAddGeoServerLayer}
        onToggleLayer={handleToggleGeoServerLayer}
        onUpdateLayer={handleUpdateGeoServerLayer}
        onDeleteLayer={handleDeleteGeoServerLayer}
        onZoomToLayer={handleZoomToGeoServerLayer}
      />
    </div>
  );
}
