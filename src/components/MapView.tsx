import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  BasemapId, 
  LayerVisibility, 
  ChoroplethMetric 
} from '../types';
import { GeoServerLayer } from '../types/geoserver';
import { 
  BOENY_CENTER, 
  BOENY_BOUNDS, 
  BASEMAP_CONFIGS,
  DISTRICTS_DATA,
  PROTECTED_AREAS_DATA,
  MANGROVE_ZONES_DATA,
  FIRE_ALERTS_DATA,
  HYDROLOGY_DATA,
  ECO_PROJECTS_DATA
} from '../data/boenyData';
import { Trash2, Check } from 'lucide-react';

interface MapViewProps {
  activeBasemap: BasemapId;
  layers: LayerVisibility;
  choroplethMetric: ChoroplethMetric;
  selectedFireYear: number | 'all';
  onSelectFeature: (feature: any) => void;
  isMeasuring: boolean;
  onToggleMeasure: () => void;
  flyToTarget: { coords: [number, number]; zoom: number; timestamp: number } | null;
  geoServerLayers: GeoServerLayer[];
}

export const MapView: React.FC<MapViewProps> = ({
  activeBasemap,
  layers,
  choroplethMetric,
  selectedFireYear,
  onSelectFeature,
  isMeasuring,
  onToggleMeasure,
  flyToTarget,
  geoServerLayers
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups refs to easily add/remove layers without recreating map
  const districtLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const paLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const mangroveLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const fireLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const hydrologyLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const projectLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const geoServerGroupsRef = useRef<Map<string, L.LayerGroup | L.TileLayer.WMS>>(new Map());
  
  // Measurement state
  const measureLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);
  const [cursorCoords, setCursorCoords] = useState<string>('16°03\'S, 46°21\'E');

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BOENY_CENTER,
      zoom: 9,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: [
        [-17.8, 43.8],
        [-14.5, 48.5]
      ],
      zoomControl: false
    });

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add scale control bottom right
    L.control.scale({ position: 'bottomright', imperial: false, metric: true }).addTo(map);

    // Initial tile layer
    const initialConfig = BASEMAP_CONFIGS[activeBasemap];
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Attach layer groups
    districtLayersRef.current.addTo(map);
    paLayersRef.current.addTo(map);
    mangroveLayersRef.current.addTo(map);
    fireLayersRef.current.addTo(map);
    hydrologyLayersRef.current.addTo(map);
    projectLayersRef.current.addTo(map);
    measureLayerRef.current.addTo(map);

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = Math.abs(e.latlng.lat).toFixed(2);
      const lng = e.latlng.lng.toFixed(2);
      setCursorCoords(`${lat}°S, ${lng}°E`);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Basemap Swapping
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const config = BASEMAP_CONFIGS[activeBasemap];
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
    newTileLayer.bringToBack();
  }, [activeBasemap]);

  // 3. Handle FlyTo requests
  useEffect(() => {
    if (!mapInstanceRef.current || !flyToTarget) return;
    mapInstanceRef.current.flyTo(flyToTarget.coords, flyToTarget.zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [flyToTarget]);

  // 4. Render Districts with Choropleth
  useEffect(() => {
    const group = districtLayersRef.current;
    group.clearLayers();

    if (!layers.districts) return;

    DISTRICTS_DATA.forEach((district) => {
      let fillColor = 'rgba(245, 158, 11, 0.1)';
      let fillOpacity = 0.2;
      let strokeColor = '#f59e0b';
      let weight = 2;

      if (choroplethMetric === 'pressure') {
        fillOpacity = 0.45;
        if (district.pressureIndex === 'Critique') {
          fillColor = '#e11d48';
          strokeColor = '#f43f5e';
        } else if (district.pressureIndex === 'Élevée') {
          fillColor = '#ea580c';
          strokeColor = '#f97316';
        } else if (district.pressureIndex === 'Modérée') {
          fillColor = '#f59e0b';
          strokeColor = '#fbbf24';
        } else {
          fillColor = '#10b981';
          strokeColor = '#34d399';
        }
      } else if (choroplethMetric === 'forest') {
        fillOpacity = 0.5;
        if (district.forestCoverPct > 30) {
          fillColor = '#065f46';
          strokeColor = '#059669';
        } else if (district.forestCoverPct > 20) {
          fillColor = '#047857';
          strokeColor = '#10b981';
        } else if (district.forestCoverPct > 10) {
          fillColor = '#10b981';
          strokeColor = '#34d399';
        } else {
          fillColor = '#a7f3d0';
          strokeColor = '#6ee7b7';
        }
      } else if (choroplethMetric === 'fires') {
        fillOpacity = 0.55;
        if (district.fireHotspots2024 > 500) {
          fillColor = '#881337';
          strokeColor = '#be123c';
        } else if (district.fireHotspots2024 > 250) {
          fillColor = '#be123c';
          strokeColor = '#e11d48';
        } else if (district.fireHotspots2024 > 100) {
          fillColor = '#f97316';
          strokeColor = '#fb923c';
        } else {
          fillColor = '#fed7aa';
          strokeColor = '#fdba74';
        }
      }

      const polygon = L.polygon(district.polygon, {
        color: strokeColor,
        weight,
        fillColor,
        fillOpacity,
        dashArray: choroplethMetric === 'none' ? '4, 4' : undefined
      });

      polygon.bindTooltip(`
        <div class="px-2 py-1 text-slate-100 font-sans">
          <div class="font-bold text-xs text-amber-400">${district.name}</div>
          <div class="text-[10px] text-slate-300">${district.surfaceKm2.toLocaleString('fr-FR')} km² • Pop: ${district.population.toLocaleString('fr-FR')}</div>
          <div class="text-[10px] text-slate-400">Pression: <strong class="text-white">${district.pressureIndex}</strong> | Feux '24: <strong class="text-rose-400">${district.fireHotspots2024}</strong></div>
        </div>
      `, { sticky: true, className: 'leaflet-custom-tooltip' });

      polygon.on('mouseover', () => {
        polygon.setStyle({ weight: 3.5, fillOpacity: fillOpacity + 0.2 });
      });
      polygon.on('mouseout', () => {
        polygon.setStyle({ weight, fillOpacity });
      });
      polygon.on('click', () => {
        onSelectFeature(district);
      });

      group.addLayer(polygon);

      // District Center Label
      const labelIcon = L.divIcon({
        className: 'district-label-marker',
        html: `
          <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(245, 158, 11, 0.4); padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #fef08a; white-space: nowrap; pointer-events: auto; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
            ${district.name}
          </div>
        `,
        iconAnchor: [35, 10]
      });
      const labelMarker = L.marker(district.center, { icon: labelIcon });
      labelMarker.on('click', () => onSelectFeature(district));
      group.addLayer(labelMarker);
    });
  }, [layers.districts, choroplethMetric, onSelectFeature]);

  // 5. Render Protected Areas (MNP / RAMSAR)
  useEffect(() => {
    const group = paLayersRef.current;
    group.clearLayers();

    if (!layers.protectedAreas) return;

    PROTECTED_AREAS_DATA.forEach((pa) => {
      if (pa.polygon) {
        const polygon = L.polygon(pa.polygon, {
          color: pa.color,
          weight: 2.5,
          fillColor: pa.color,
          fillOpacity: 0.35
        });

        polygon.bindTooltip(`
          <div class="px-2 py-1 text-slate-100 font-sans">
            <div class="font-bold text-xs text-emerald-400">${pa.name}</div>
            <div class="text-[10px] text-slate-300">${pa.surfaceHa.toLocaleString('fr-FR')} ha • ${pa.type}</div>
            <div class="text-[10px] text-slate-400">Gestion: ${pa.managingEntity}</div>
          </div>
        `, { sticky: true });

        polygon.on('mouseover', () => {
          polygon.setStyle({ weight: 4, fillOpacity: 0.55 });
        });
        polygon.on('mouseout', () => {
          polygon.setStyle({ weight: 2.5, fillOpacity: 0.35 });
        });
        polygon.on('click', () => {
          onSelectFeature(pa);
        });

        group.addLayer(polygon);
      }

      // Marker pin with custom icon
      const pinIcon = L.divIcon({
        className: 'pa-pin-marker',
        html: `
          <div style="background: #047857; border: 2px solid #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6); cursor: pointer; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(pa.center, { icon: pinIcon });
      marker.bindTooltip(`<strong>${pa.name}</strong><br/>${pa.surfaceHa.toLocaleString('fr-FR')} ha`, { direction: 'top', offset: [0, -10] });
      marker.on('click', () => onSelectFeature(pa));
      group.addLayer(marker);
    });
  }, [layers.protectedAreas, onSelectFeature]);

  // 6. Render Mangroves
  useEffect(() => {
    const group = mangroveLayersRef.current;
    group.clearLayers();

    if (!layers.mangroves) return;

    MANGROVE_ZONES_DATA.forEach((mangrove) => {
      const polygon = L.polygon(mangrove.polygon, {
        color: '#14b8a6',
        weight: 2,
        fillColor: '#0d9488',
        fillOpacity: 0.45
      });

      polygon.bindTooltip(`
        <div class="px-2 py-1 text-slate-100 font-sans">
          <div class="font-bold text-xs text-teal-300">🌿 ${mangrove.name}</div>
          <div class="text-[10px] text-slate-300">${mangrove.areaHa.toLocaleString('fr-FR')} ha • Santé: <span class="text-emerald-300 font-bold">${mangrove.healthStatus}</span></div>
          <div class="text-[10px] text-slate-400">Pression: ${mangrove.pressureLevel}</div>
        </div>
      `, { sticky: true });

      polygon.on('mouseover', () => polygon.setStyle({ weight: 3.5, fillOpacity: 0.65 }));
      polygon.on('mouseout', () => polygon.setStyle({ weight: 2, fillOpacity: 0.45 }));
      polygon.on('click', () => onSelectFeature(mangrove));

      group.addLayer(polygon);
    });
  }, [layers.mangroves, onSelectFeature]);

  // 7. Render Fire Alerts (VIIRS / MODIS)
  useEffect(() => {
    const group = fireLayersRef.current;
    group.clearLayers();

    if (!layers.fireAlerts) return;

    const filteredFires = FIRE_ALERTS_DATA.filter((fire) => {
      if (selectedFireYear === 'all') return true;
      return fire.year === selectedFireYear;
    });

    filteredFires.forEach((fire) => {
      const isHighIntensity = fire.brightnessKelvin > 345;
      const size = isHighIntensity ? 22 : 18;

      const fireIcon = L.divIcon({
        className: 'fire-pin-marker',
        html: `
          <div class="fire-marker-pulse" style="background: ${isHighIntensity ? '#e11d48' : '#f97316'}; border: 2px solid #ffffff; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; box-shadow: 0 0 10px ${isHighIntensity ? '#f43f5e' : '#fb923c'};">
            <svg width="${size - 8}" height="${size - 8}" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker(fire.coordinates, { icon: fireIcon });
      marker.bindTooltip(`
        <div class="px-2 py-1 text-slate-100 font-sans">
          <div class="font-bold text-xs text-rose-400">🔥 ${fire.type}</div>
          <div class="text-[10px] text-slate-300">Date: ${fire.date} • ${fire.commune} (${fire.district})</div>
          <div class="text-[10px] text-slate-400">T°: <span class="text-amber-300">${fire.brightnessKelvin} K</span> | Capteur: ${fire.sensor}</div>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.on('click', () => onSelectFeature(fire));
      group.addLayer(marker);
    });
  }, [layers.fireAlerts, selectedFireYear, onSelectFeature]);

  // 8. Render Hydrology (Rivers & Lakes)
  useEffect(() => {
    const group = hydrologyLayersRef.current;
    group.clearLayers();

    if (!layers.hydrology) return;

    HYDROLOGY_DATA.forEach((hydro) => {
      if (hydro.type === 'Lac') {
        const polygon = L.polygon(hydro.coordinates as [number, number][], {
          color: hydro.color,
          weight: 2,
          fillColor: hydro.color,
          fillOpacity: 0.6
        });

        polygon.bindTooltip(`
          <div class="px-2 py-1 text-slate-100 font-sans">
            <div class="font-bold text-xs text-sky-300">💧 ${hydro.name}</div>
            <div class="text-[10px] text-slate-300">${hydro.lengthKmOrAreaHa} • ${hydro.type}</div>
          </div>
        `, { sticky: true });

        polygon.on('click', () => onSelectFeature(hydro));
        group.addLayer(polygon);
      } else {
        // River polyline
        const polyline = L.polyline(hydro.coordinates as [number, number][], {
          color: hydro.color,
          weight: hydro.id === 'river-betsiboka' ? 4.5 : 3,
          opacity: 0.85
        });

        polyline.bindTooltip(`
          <div class="px-2 py-1 text-slate-100 font-sans">
            <div class="font-bold text-xs text-rose-300">🌊 ${hydro.name}</div>
            <div class="text-[10px] text-slate-300">${hydro.lengthKmOrAreaHa}</div>
            <div class="text-[10px] text-slate-400">${hydro.sedimentationRisk}</div>
          </div>
        `, { sticky: true });

        polyline.on('click', () => onSelectFeature(hydro));
        group.addLayer(polyline);
      }
    });
  }, [layers.hydrology, onSelectFeature]);

  // 9. Render Eco Projects
  useEffect(() => {
    const group = projectLayersRef.current;
    group.clearLayers();

    if (!layers.ecoProjects) return;

    ECO_PROJECTS_DATA.forEach((proj) => {
      const projIcon = L.divIcon({
        className: 'proj-pin-marker',
        html: `
          <div style="background: #4f46e5; border: 2px solid #ffffff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(proj.coordinates, { icon: projIcon });
      marker.bindTooltip(`
        <div class="px-2 py-1 text-slate-100 font-sans">
          <div class="font-bold text-xs text-indigo-300">💼 ${proj.title}</div>
          <div class="text-[10px] text-slate-300">${proj.organization} • ${proj.budget}</div>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.on('click', () => onSelectFeature(proj));
      group.addLayer(marker);
    });
  }, [layers.ecoProjects, onSelectFeature]);

  // 9b. GeoServer OGC Layers Handler (WMS / WFS)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove deleted layers
    const currentLayerIds = new Set(geoServerLayers.map((l) => l.id));
    geoServerGroupsRef.current.forEach((leafletLayer, id) => {
      if (!currentLayerIds.has(id)) {
        map.removeLayer(leafletLayer);
        geoServerGroupsRef.current.delete(id);
      }
    });

    // Process each layer
    geoServerLayers.forEach((layer) => {
      const existing = geoServerGroupsRef.current.get(layer.id);

      // If inactive, remove from map if it was present
      if (!layer.activeOnMap) {
        if (existing) {
          map.removeLayer(existing);
          geoServerGroupsRef.current.delete(layer.id);
        }
        return;
      }

      // If already active, remove previous instance to re-apply new mode/opacity/style
      if (existing) {
        map.removeLayer(existing);
        geoServerGroupsRef.current.delete(layer.id);
      }

      // External WMS service
      if (layer.mode === 'wms' && layer.isExternal) {
        const wmsTileLayer = L.tileLayer.wms(layer.wmsUrl, {
          layers: layer.prefixedName,
          format: 'image/png',
          transparent: true,
          opacity: layer.opacity,
          attribution: 'GeoServer WMS'
        });
        wmsTileLayer.addTo(map);
        geoServerGroupsRef.current.set(layer.id, wmsTileLayer);
        return;
      }

      // Render WFS Vector / Styled WMS representation
      const group = L.layerGroup();

      if (layer.features && layer.features.length > 0) {
        const geojsonLayer = L.geoJSON({ type: 'FeatureCollection', features: layer.features } as any, {
          style: () => ({
            fillColor: layer.style.fillColor,
            fillOpacity: (layer.style.fillOpacity ?? 0.35) * layer.opacity,
            color: layer.style.strokeColor,
            weight: layer.style.strokeWidth || 2,
            dashArray: layer.style.dashArray || undefined
          }),
          pointToLayer: (_feature, latlng) => {
            const markerIcon = L.divIcon({
              className: 'geoserver-marker',
              html: `
                <div style="background: ${layer.style.fillColor}; border: 2px solid #ffffff; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 0 10px ${layer.style.fillColor}; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
                </div>
              `,
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            });
            return L.marker(latlng, { icon: markerIcon });
          },
          onEachFeature: (feature, leafletElem) => {
            const featureTitle = 
              feature.properties?.nom || 
              feature.properties?.code_parcelle || 
              feature.properties?.poste || 
              feature.properties?.concession || 
              feature.properties?.identifiant || 
              layer.title;

            leafletElem.bindTooltip(`
              <div class="px-2 py-1 text-slate-100 font-sans" style="min-width: 140px;">
                <div class="font-bold text-xs text-emerald-400">🌐 ${featureTitle}</div>
                <div class="text-[10px] text-slate-300">GeoServer ${layer.mode.toUpperCase()} : ${layer.prefixedName}</div>
                <div class="text-[9px] text-slate-400 mt-0.5">${layer.title}</div>
              </div>
            `, { 
              sticky: true,
              className: 'backdrop-blur-md bg-[#0c1618]/90 border border-emerald-500/40 rounded-xl shadow-xl'
            });

            leafletElem.on('click', () => {
              onSelectFeature({
                ...feature,
                isGeoServer: true,
                geoserverLayer: layer,
                name: featureTitle,
                properties: feature.properties
              });
            });
          }
        });

        group.addLayer(geojsonLayer);
      }

      group.addTo(map);
      geoServerGroupsRef.current.set(layer.id, group);
    });
  }, [geoServerLayers, onSelectFeature]);

  // 10. Measurement Tool Handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const measureGroup = measureLayerRef.current;
    measureGroup.clearLayers();

    if (!isMeasuring) {
      setMeasurePoints([]);
      setTotalDistanceKm(0);
      return;
    }

    // Change map cursor
    map.getContainer().style.cursor = 'crosshair';

    // Click handler for measuring
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMeasurePoints((prev) => {
        const next = [...prev, newPoint];
        // Calculate cumulative distance
        let dist = 0;
        for (let i = 0; i < next.length - 1; i++) {
          const p1 = L.latLng(next[i]);
          const p2 = L.latLng(next[i + 1]);
          dist += p1.distanceTo(p2);
        }
        setTotalDistanceKm(dist / 1000);
        return next;
      });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.getContainer().style.cursor = '';
    };
  }, [isMeasuring]);

  // Update measurement graphics on map
  useEffect(() => {
    const measureGroup = measureLayerRef.current;
    measureGroup.clearLayers();

    if (measurePoints.length === 0) return;

    // Draw line
    if (measurePoints.length > 1) {
      const line = L.polyline(measurePoints, {
        color: '#f59e0b',
        weight: 3,
        dashArray: '6, 6'
      });
      measureGroup.addLayer(line);
    }

    // Draw point markers
    measurePoints.forEach((pt, idx) => {
      const dotIcon = L.divIcon({
        className: 'measure-dot',
        html: `
          <div style="background: #f59e0b; border: 2px solid #ffffff; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      const marker = L.marker(pt, { icon: dotIcon });
      measureGroup.addLayer(marker);
    });
  }, [measurePoints]);

  const handleClearMeasurement = useCallback(() => {
    setMeasurePoints([]);
    setTotalDistanceKm(0);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Measurement HUD banner */}
      {isMeasuring && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 px-4 py-2 rounded-xl shadow-xl flex items-center gap-3 text-xs text-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Mode Mesure : Cliquez sur la carte pour tracer</span>
          </div>

          <div className="font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-400 font-bold">
            {totalDistanceKm.toFixed(2)} km <span className="text-[10px] text-slate-400">({measurePoints.length} pts)</span>
          </div>

          {measurePoints.length > 0 && (
            <button
              onClick={handleClearMeasurement}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Réinitialiser le tracé"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleMeasure}
            className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors"
          >
            Terminer
          </button>
        </div>
      )}

      {/* Coordinate & Status Footer Bar */}
      <div className="absolute bottom-2 right-24 z-20 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-400 shadow-md pointer-events-none hidden sm:flex items-center gap-3">
        <span>Coordonnées: <strong className="text-slate-200">{cursorCoords}</strong></span>
        <span>Système: <strong className="text-slate-200">WGS 84 / UTM 38S</strong></span>
        <span className="text-emerald-400">● Observatoire Actif</span>
      </div>
    </div>
  );
};
