import { GeoServerLayer, GeoServerStyle, GeoServerFeature, GeoServerPublishPayload } from '../types/geoserver';

export const GEOSERVER_BASE_URL = 'http://localhost:8080/geoserver';
export const GEOSERVER_PUBLIC_ENDPOINT = 'https://sig.dredd-boeny.mg/geoserver';

/**
 * Generate standard OGC SLD 1.0.0 XML for a given style & geometry type
 */
export function generateSldXml(
  layerName: string,
  geomType: string,
  style: GeoServerStyle
): string {
  if (geomType === 'LineString') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <NamedLayer>
    <Name>${layerName}</Name>
    <UserStyle>
      <Title>Style par défaut pour ${layerName}</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Rule 1</Name>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">${style.strokeColor}</CssParameter>
              <CssParameter name="stroke-width">${style.strokeWidth}</CssParameter>
              ${style.dashArray ? `<CssParameter name="stroke-dasharray">${style.dashArray}</CssParameter>` : ''}
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
  }

  if (geomType === 'Point') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <Name>${layerName}</Name>
    <UserStyle>
      <Title>Style de Points pour ${layerName}</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Rule 1</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">${style.fillColor}</CssParameter>
                  <CssParameter name="fill-opacity">${style.fillOpacity}</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">${style.strokeColor}</CssParameter>
                  <CssParameter name="stroke-width">${style.strokeWidth}</CssParameter>
                </Stroke>
              </Mark>
              <Size>${style.markerSize || 12}</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
  }

  // Default: Polygon
  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <NamedLayer>
    <Name>${layerName}</Name>
    <UserStyle>
      <Title>Polygone Style pour ${layerName}</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Rule 1</Name>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">${style.fillColor}</CssParameter>
              <CssParameter name="fill-opacity">${style.fillOpacity}</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">${style.strokeColor}</CssParameter>
              <CssParameter name="stroke-width">${style.strokeWidth}</CssParameter>
              ${style.dashArray ? `<CssParameter name="stroke-dasharray">${style.dashArray}</CssParameter>` : ''}
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

/**
 * Generate OGC WMS GetCapabilities XML preview
 */
export function generateGetCapabilitiesXml(layers: GeoServerLayer[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<WMS_Capabilities version="1.3.0" 
  xmlns="http://www.opengis.net/wms" 
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <Service>
    <Name>WMS</Name>
    <Title>GeoServer OGC Web Map Service - Région Boeny</Title>
    <Abstract>Serveur cartographique officiel DREDD Boeny / Madagascar National Parks</Abstract>
    <OnlineResource xlink:type="simple" xlink:href="${GEOSERVER_PUBLIC_ENDPOINT}/wms"/>
  </Service>
  <Capability>
    <Request>
      <GetCapabilities>
        <Format>text/xml</Format>
      </GetCapabilities>
      <GetMap>
        <Format>image/png</Format>
        <Format>image/jpeg</Format>
      </GetMap>
      <GetFeatureInfo>
        <Format>text/html</Format>
        <Format>application/json</Format>
      </GetFeatureInfo>
    </Request>
    <Layer>
      <Title>Catalogue Régional Boeny OGC</Title>
      <CRS>EPSG:4326</CRS>
      <CRS>EPSG:3857</CRS>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>44.5</westBoundLongitude>
        <eastBoundLongitude>47.5</eastBoundLongitude>
        <southBoundLatitude>-17.2</southBoundLatitude>
        <northBoundLatitude>-15.2</northBoundLatitude>
      </EX_GeographicBoundingBox>
      ${layers.map(l => `
      <Layer queryable="1">
        <Name>${l.prefixedName}</Name>
        <Title>${l.title}</Title>
        <Abstract>${l.abstract}</Abstract>
        <CRS>${l.srs}</CRS>
        <EX_GeographicBoundingBox>
          <westBoundLongitude>${l.bbox[0]}</westBoundLongitude>
          <eastBoundLongitude>${l.bbox[2]}</eastBoundLongitude>
          <southBoundLatitude>${l.bbox[1]}</southBoundLatitude>
          <northBoundLatitude>${l.bbox[3]}</northBoundLatitude>
        </EX_GeographicBoundingBox>
        <Style>
          <Name>default_${l.name}</Name>
          <Title>Style OGC SLD Standard</Title>
        </Style>
      </Layer>`).join('')}
    </Layer>
  </Capability>
</WMS_Capabilities>`;
}

// -------------------------------------------------------------
// PRE-CONFIGURED BOENY DATASETS READY FOR GEOSERVER PUBLICATION
// -------------------------------------------------------------

export const PRESET_GEOSERVER_DATASETS: Array<{
  id: string;
  name: string;
  title: string;
  workspace: string;
  store: string;
  abstract: string;
  geometryType: 'Polygon' | 'LineString' | 'Point';
  srs: string;
  style: GeoServerStyle;
  features: GeoServerFeature[];
}> = [
  {
    id: 'zones_reboisement_prioritaires',
    name: 'zones_reboisement_prioritaires',
    title: 'Zones de Reboisement Prioritaire 2024-2026',
    workspace: 'boeny_sig',
    store: 'dredd_shapefiles',
    abstract: 'Parcelles et pépinières communautaires de reboisement massif (Hintsy, Baobab, Acacia) pilotées par la DREDD Boeny et WWF.',
    geometryType: 'Polygon',
    srs: 'EPSG:4326',
    style: {
      fillColor: '#10b981',
      fillOpacity: 0.35,
      strokeColor: '#059669',
      strokeWidth: 2,
      dashArray: '4, 4'
    },
    features: [
      {
        id: 'rebois-1',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.72, -16.25],
            [46.85, -16.20],
            [46.88, -16.32],
            [46.75, -16.38],
            [46.72, -16.25]
          ]]
        },
        properties: {
          code_parcelle: 'BOE-REB-2024-01',
          commune: 'Tsaramandroso (Ambato-Boeny)',
          superficie_ha: 1450,
          essence_dominante: 'Hintsy (Intsia bijuga) & Acacia mangium',
          taux_reprise: '84%',
          financeur: 'Fonds Vert Climat / DREDD',
          annee: 2024
        }
      },
      {
        id: 'rebois-2',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.55, -15.95],
            [46.68, -15.90],
            [46.70, -16.02],
            [46.58, -16.06],
            [46.55, -15.95]
          ]]
        },
        properties: {
          code_parcelle: 'BOE-REB-2024-02',
          commune: 'Ambalakida (Marovoay)',
          superficie_ha: 920,
          essence_dominante: 'Eucalyptus camaldulensis & Khaya madagascariensis',
          taux_reprise: '79%',
          financeur: 'USAID Hay Tao',
          annee: 2024
        }
      },
      {
        id: 'rebois-3',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.38, -15.82],
            [46.48, -15.80],
            [46.49, -15.88],
            [46.40, -15.91],
            [46.38, -15.82]
          ]]
        },
        properties: {
          code_parcelle: 'BOE-REB-2025-03',
          commune: 'Belobaka (Mahajanga II)',
          superficie_ha: 680,
          essence_dominante: 'Anacardier greffé & Moringa oleifera',
          taux_reprise: '91%',
          financeur: 'Union Européenne / Aina',
          annee: 2025
        }
      }
    ]
  },
  {
    id: 'couloirs_faune_ankarafantsika',
    name: 'couloirs_faune_ankarafantsika',
    title: 'Corridors Écologiques & Connectivité Biologique Ankarafantsika',
    workspace: 'boeny_sig',
    store: 'mnp_postgis',
    abstract: 'Axes prioritaires de déplacement et brassage génétique pour le Sifaka de Coquerel (Propithecus coquereli) et le Fosa (Cryptoprocta ferox).',
    geometryType: 'Polygon',
    srs: 'EPSG:4326',
    style: {
      fillColor: '#f59e0b',
      fillOpacity: 0.3,
      strokeColor: '#d97706',
      strokeWidth: 2.5,
      dashArray: '6, 3'
    },
    features: [
      {
        id: 'corridor-nord',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.85, -16.05],
            [47.05, -16.12],
            [47.10, -16.25],
            [46.95, -16.30],
            [46.80, -16.18],
            [46.85, -16.05]
          ]]
        },
        properties: {
          identifiant: 'CORR-BIO-01-NORD',
          nom: 'Corridor Ampijoroa - Betsiboka Est',
          espece_clef: 'Propithecus coquereli (Sifaka)',
          etat_connectivite: 'Moyen (fragmentation par la RN4)',
          largeur_min_m: 350,
          mesure_requise: 'Passages à faune aériens sur la RN4 et pare-feux renforcés'
        }
      },
      {
        id: 'corridor-sud',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.90, -16.42],
            [47.08, -16.48],
            [47.02, -16.62],
            [46.82, -16.55],
            [46.90, -16.42]
          ]]
        },
        properties: {
          identifiant: 'CORR-BIO-02-SUD',
          nom: 'Corridor Forêt Dense vers Mahajamba',
          espece_clef: 'Cryptoprocta ferox (Fosa) & Microcebus ravelobensis',
          etat_connectivite: 'Bon (faible densité humaine)',
          largeur_min_m: 800,
          mesure_requise: 'Patrouilles mixtes MNP / Communautés locales'
        }
      }
    ]
  },
  {
    id: 'perimetres_irrigation_marovoay',
    name: 'perimetres_irrigation_marovoay',
    title: 'Périmètres Hydro-Agricoles & Vulnérabilité Betsiboka',
    workspace: 'boeny_sig',
    store: 'hydro_shapefiles',
    abstract: 'Canaux d\'irrigation majeurs et casiers rizicoles de la plaine de Marovoay soumis aux dépôts de sédiments latéritiques.',
    geometryType: 'LineString',
    srs: 'EPSG:4326',
    style: {
      fillColor: '#0284c7',
      fillOpacity: 0.2,
      strokeColor: '#0284c7',
      strokeWidth: 3,
      dashArray: '5, 5'
    },
    features: [
      {
        id: 'canal-primaire-nord',
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [46.60, -16.08],
            [46.64, -16.12],
            [46.68, -16.14],
            [46.72, -16.11],
            [46.76, -16.08]
          ]
        },
        properties: {
          code_ouvrage: 'CAN-MAR-01',
          nom: 'Canal Primaire Rive Gauche Betsiboka',
          debit_nominal: '14.5 m³/s',
          surface_irriguee_ha: 8500,
          ensablement: 'Critique (baisse de débit de 35%)',
          curage_prevu: 'Septembre 2025'
        }
      },
      {
        id: 'canal-secondaire-sud',
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [46.62, -16.16],
            [46.66, -16.20],
            [46.70, -16.22],
            [46.73, -16.28]
          ]
        },
        properties: {
          code_ouvrage: 'CAN-MAR-02',
          nom: 'Canal d\'Amenée Plaine Centrale Marovoay',
          debit_nominal: '8.2 m³/s',
          surface_irriguee_ha: 4200,
          ensablement: 'Modéré',
          curage_prevu: 'Juillet 2025'
        }
      }
    ]
  },
  {
    id: 'concessions_carbone_mangrove',
    name: 'concessions_carbone_mangrove',
    title: 'Concessions Carbone Bleu & Pêche Durable Bombetoka',
    workspace: 'boeny_sig',
    store: 'dredd_postgis',
    abstract: 'Périmètres de séquestration carbone et gestion communautaire des palétuviers dans le delta de la Betsiboka.',
    geometryType: 'Polygon',
    srs: 'EPSG:4326',
    style: {
      fillColor: '#06b6d4',
      fillOpacity: 0.35,
      strokeColor: '#0891b2',
      strokeWidth: 2
    },
    features: [
      {
        id: 'carb-bombetoka-1',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.25, -15.82],
            [46.34, -15.85],
            [46.36, -15.94],
            [46.26, -15.92],
            [46.25, -15.82]
          ]]
        },
        properties: {
          concession: 'Katsepy Ouest Carbone Bleu',
          organisme: 'Conservation International / FKM Katsepy',
          superficie_ha: 5200,
          stock_carbone: '380 tCO2e/ha',
          statut_redd: 'Enregistrement Verra VCS',
          especes_paletuvier: 'Rhizophora mucronata & Avicennia marina'
        }
      },
      {
        id: 'carb-bombetoka-2',
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [46.36, -15.96],
            [46.46, -15.98],
            [46.44, -16.08],
            [46.33, -16.05],
            [46.36, -15.96]
          ]]
        },
        properties: {
          concession: 'Delta Sud Bombetoka',
          organisme: 'WWF Madagascar / DREDD Boeny',
          superficie_ha: 6800,
          stock_carbone: '410 tCO2e/ha',
          statut_redd: 'Validé Plan Vivo',
          especes_paletuvier: 'Ceriops tagal & Bruguiera gymnorhiza'
        }
      }
    ]
  },
  {
    id: 'patrouilles_anti_braconnage',
    name: 'patrouilles_anti_braconnage',
    title: 'Postes de Garde & Patrouilles Tortue Angonoka (Baly)',
    workspace: 'boeny_sig',
    store: 'mnp_shapefiles',
    abstract: 'Réseau de surveillance mobile et stations fixes de protection de la Tortue à soc d\'or dans le Parc National de Baly.',
    geometryType: 'Point',
    srs: 'EPSG:4326',
    style: {
      fillColor: '#f43f5e',
      fillOpacity: 0.9,
      strokeColor: '#ffffff',
      strokeWidth: 2,
      markerSize: 14
    },
    features: [
      {
        id: 'poste-soalala-1',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [45.32, -16.02]
        },
        properties: {
          poste: 'Poste Avancé Cap Sada',
          effectif_gardes: 6,
          moyens: 'Vedette rapide + GPS Tracker',
          contact_radio: 'Canal VHF 14',
          zone_surveillance: 'Sanctuaire Tortue Angonoka',
          saisies_2024: 0
        }
      },
      {
        id: 'poste-soalala-2',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [45.24, -16.10]
        },
        properties: {
          poste: 'Base Sud Soalala',
          effectif_gardes: 8,
          moyens: 'Quads tout-terrain + Drones thermiques',
          contact_radio: 'Canal VHF 16',
          zone_surveillance: 'Savane côtière et pare-feux périphériques',
          saisies_2024: 2
        }
      },
      {
        id: 'poste-soalala-3',
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [45.45, -16.15]
        },
        properties: {
          poste: 'Poste Rivière Andranomavo',
          effectif_gardes: 4,
          moyens: 'Pirogues motorisées',
          contact_radio: 'Canal VHF 12',
          zone_surveillance: 'Point de contrôle fluvial contre l\'orpaillage et le braconnage',
          saisies_2024: 1
        }
      }
    ]
  }
];

/**
 * Compute bounding box from GeoServer features
 */
export function computeBboxFromFeatures(features: GeoServerFeature[]): [number, number, number, number] {
  let minLon = 180;
  let minLat = 90;
  let maxLon = -180;
  let maxLat = -90;

  const explore = (coords: any) => {
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lon, lat] = coords;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else if (Array.isArray(coords)) {
      coords.forEach(explore);
    }
  };

  features.forEach(f => explore(f.geometry.coordinates));

  if (minLon > maxLon) {
    return [44.5, -17.2, 47.5, -15.2];
  }
  return [minLon, minLat, maxLon, maxLat];
}

/**
 * Create a full GeoServerLayer object from a publish payload
 */
export function createGeoServerLayerFromPayload(payload: GeoServerPublishPayload): GeoServerLayer {
  const prefixedName = `${payload.workspace}:${payload.name}`;
  const bbox = computeBboxFromFeatures(payload.features);
  const sldXml = generateSldXml(payload.name, payload.geometryType, payload.style);

  return {
    id: `layer-${payload.workspace}-${payload.name}-${Date.now()}`,
    workspace: payload.workspace,
    store: payload.store,
    name: payload.name,
    prefixedName,
    title: payload.title,
    abstract: payload.abstract,
    geometryType: payload.geometryType,
    srs: payload.srs,
    bbox,
    publishedAt: new Date().toISOString(),
    featuresCount: payload.features.length,
    wmsUrl: `${GEOSERVER_BASE_URL}/${payload.workspace}/wms`,
    wfsUrl: `${GEOSERVER_BASE_URL}/${payload.workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${prefixedName}&outputFormat=application/json`,
    style: payload.style,
    sldXml,
    features: payload.features,
    activeOnMap: true,
    mode: payload.mode || 'wfs',
    opacity: 0.85
  };
}

/**
 * Initial published layers pre-loaded in GeoServer
 */
export const INITIAL_GEOSERVER_LAYERS: GeoServerLayer[] = [
  createGeoServerLayerFromPayload({
    workspace: PRESET_GEOSERVER_DATASETS[0].workspace,
    store: PRESET_GEOSERVER_DATASETS[0].store,
    name: PRESET_GEOSERVER_DATASETS[0].name,
    title: PRESET_GEOSERVER_DATASETS[0].title,
    abstract: PRESET_GEOSERVER_DATASETS[0].abstract,
    geometryType: PRESET_GEOSERVER_DATASETS[0].geometryType,
    srs: PRESET_GEOSERVER_DATASETS[0].srs,
    style: PRESET_GEOSERVER_DATASETS[0].style,
    features: PRESET_GEOSERVER_DATASETS[0].features,
    mode: 'wfs'
  }),
  createGeoServerLayerFromPayload({
    workspace: PRESET_GEOSERVER_DATASETS[1].workspace,
    store: PRESET_GEOSERVER_DATASETS[1].store,
    name: PRESET_GEOSERVER_DATASETS[1].name,
    title: PRESET_GEOSERVER_DATASETS[1].title,
    abstract: PRESET_GEOSERVER_DATASETS[1].abstract,
    geometryType: PRESET_GEOSERVER_DATASETS[1].geometryType,
    srs: PRESET_GEOSERVER_DATASETS[1].srs,
    style: PRESET_GEOSERVER_DATASETS[1].style,
    features: PRESET_GEOSERVER_DATASETS[1].features,
    mode: 'wfs'
  })
];
