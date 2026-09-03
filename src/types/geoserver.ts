export type GeoServerGeometryType = 'Polygon' | 'MultiPolygon' | 'LineString' | 'Point';

export interface GeoServerStyle {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
  dashArray?: string;
  markerIcon?: string;
  markerSize?: number;
}

export interface GeoServerFeatureProperty {
  key: string;
  label: string;
  value: any;
  type?: 'string' | 'number' | 'boolean' | 'date';
}

export interface GeoServerFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: GeoServerGeometryType;
    coordinates: any;
  };
  properties: Record<string, any>;
}

export interface GeoServerLayer {
  id: string;
  workspace: string;          // e.g. 'boeny_sig'
  store: string;              // e.g. 'boeny_postgis' or 'boeny_shapefiles'
  name: string;               // e.g. 'zones_reboisement_prioritaires'
  prefixedName: string;       // e.g. 'boeny_sig:zones_reboisement_prioritaires'
  title: string;
  abstract: string;
  geometryType: GeoServerGeometryType;
  srs: string;                // e.g. 'EPSG:4326'
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  publishedAt: string;
  featuresCount: number;
  wmsUrl: string;
  wfsUrl: string;
  style: GeoServerStyle;
  sldXml: string;
  features: GeoServerFeature[];
  activeOnMap: boolean;
  mode: 'wms' | 'wfs';        // WMS tile/render mode or interactive WFS vector mode
  opacity: number;            // 0 to 1
  isExternal?: boolean;
}

export interface GeoServerPublishPayload {
  workspace: string;
  store: string;
  name: string;
  title: string;
  abstract: string;
  geometryType: GeoServerGeometryType;
  srs: string;
  style: GeoServerStyle;
  features: GeoServerFeature[];
  mode?: 'wms' | 'wfs';
}

export interface GeoServerLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'WMS' | 'WFS';
  endpoint: string;
  status: number;
  message: string;
}
