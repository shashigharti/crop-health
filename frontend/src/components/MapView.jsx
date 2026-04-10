import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { useStore } from '../store/useStore'
import { plotToAOI } from '../utils/geo'
import { generateAoiId, generateFeatureId } from '../utils/common'
import {
  AOI_COLOR,
  FEATURE_COLOR,
  MODES,
  HEALTH_COLORS,
  CROP_COLORS,
  HEALTH_LABELS,
} from '../store/modules/common'

const drawAois = (aoiLayer) => {
  const { aois } = useStore.getState()
  aoiLayer.clearLayers()
  aois
    .filter((a) => a.geometry)
    .forEach((aoi) => {
      L.geoJSON(
        { type: 'Feature', geometry: aoi.geometry, properties: {} },
        {
          style: { color: aoi.color || AOI_COLOR, weight: 5, fillOpacity: 0.15 },
          onEachFeature: (_, l) => {
            l.options.aoiId = aoi.id
            l.bindTooltip(aoi.name, { permanent: false })
          },
        }
      ).addTo(aoiLayer)
    })
}

const syncOverlayLayers = (map, tileLayerRef) => {
  const { satelliteLayers } = useStore.getState()

  Object.values(tileLayerRef.current).forEach((l) => map.removeLayer(l))
  tileLayerRef.current = {}

  Object.entries(satelliteLayers).forEach(([aoiId, aoiLayers]) => {
    if (!aoiLayers) return
    Object.entries(aoiLayers).forEach(([id, layer]) => {
      if (layer?.url && layer?.checked !== false) {
        tileLayerRef.current[id] = L.tileLayer(layer.url, {
          attribution: '© Google Earth Engine',
          opacity: 0.8,
        }).addTo(map)
      }
    })
  })
}

const syncFeatureLayers = (map, featureLayerRef) => {
  const { featurePolygons } = useStore.getState()

  Object.values(featureLayerRef.current).forEach((l) => map.removeLayer(l))
  featureLayerRef.current = {}

  Object.entries(featurePolygons).forEach(([aoiId, crops]) => {
    if (!Array.isArray(crops)) return
    crops
      .filter((poly) => poly.visible !== false)
      .forEach((poly) => {
        featureLayerRef.current[poly.id] = L.geoJSON(
          { type: 'Feature', geometry: poly.geometry, properties: {} },
          {
            style: { color: FEATURE_COLOR, weight: 2, fillOpacity: 0.3 },
          }
        ).addTo(map)
      })
  })
}

const syncCropMapLayer = (map, cropMapLayerRef) => {
  const { plotLayers } = useStore.getState()

  if (cropMapLayerRef.current) {
    map.removeLayer(cropMapLayerRef.current)
    cropMapLayerRef.current = null
  }
  if (plotLayers.crop_map.url && plotLayers.crop_map.visible) {
    cropMapLayerRef.current = L.tileLayer(plotLayers.crop_map.url, {
      attribution: '© Google Earth Engine',
      opacity: 0.8,
    }).addTo(map)
  }
}

const syncPlotsLayer = (map, plotLayerRef) => {
  const { plotLayers } = useStore.getState()
  const { geojson, filteredGeojson, visible } = plotLayers.plots

  if (plotLayerRef.current) {
    map.removeLayer(plotLayerRef.current)
    plotLayerRef.current = null
  }

  const data = filteredGeojson ?? geojson
  if (!data || !visible) return

  plotLayerRef.current = L.geoJSON(data, {
    style: (feature) => ({
      color: HEALTH_COLORS[feature.properties.health] ?? '#808080',
      fillColor: HEALTH_COLORS[feature.properties.health] ?? '#808080',
      weight: 2,
      fillOpacity: 0.35,
    }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties
      layer.bindPopup(`
        <b style="color:${CROP_COLORS[p.crop] ?? '#fff'}">${p.crop}</b><br/>
        Health: ${HEALTH_LABELS[p.health] ?? 'Unknown'}<br/>
        Area: ${p.area_ha?.toFixed(2)} ha
      `)
    },
  }).addTo(map)
}

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const aoiLayerRef = useRef(null)
  const tileLayerRef = useRef({})
  const featureLayerRef = useRef({})
  const cropMapLayerRef = useRef(null)
  const plotLayerRef = useRef(null)
  const initializedRef = useRef(false)
  const { mapCenter } = useStore()

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !mapCenter?.bounds) return
    const { mapZoom } = useStore.getState()
    map.flyTo(mapCenter.bounds, mapZoom, { animate: true, duration: 1.2 })
  }, [mapCenter])

  useEffect(() => {
    if (initializedRef.current || !mapRef.current) return
    initializedRef.current = true

    const { mapCenter: center, mapZoom: zoom } = useStore.getState()

    const map = L.map(mapRef.current, {
      center: center ?? [-0.42, 36.95],
      zoom: zoom ?? 12,
      zoomControl: true,
      preferCanvas: true,
    })
    mapInstanceRef.current = map

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google',
      maxZoom: 21,
    }).addTo(map)

    L.control
      .layers(
        {
          OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
          }),
          'Google Hybrid': L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            attribution: '© Google',
            maxZoom: 21,
          }),
          'Esri World Imagery': L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: '© Esri', maxZoom: 19 }
          ),
        },
        {},
        { collapsed: false }
      )
      .addTo(map)

    const aoiLayer = new L.FeatureGroup()
    aoiLayerRef.current = aoiLayer
    map.addLayer(aoiLayer)

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: false,
      editMode: false,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    })

    map.on('pm:create', (e) => {
      const { mode, aois, setAois, selectedAoi, setSelectedAoi, addFeaturePolygon } =
        useStore.getState()
      // const selectedAoi = aois.find((a) => a.checked)
      const bounds = e.layer.getBounds()
      const center = bounds.getCenter()

      // console.log('geometry:', JSON.stringify(e.layer.toGeoJSON().geometry))
      // console.log('bounds:', bounds)
      // console.log('center:', center)

      if (mode === MODES.ADD_FEATURE) {
        if (!selectedAoi) {
          e.layer.remove()
          return
        }
        const id = generateFeatureId(selectedAoi.id)
        e.layer.options.featureId = id

        addFeaturePolygon(selectedAoi.id, {
          id,
          name: `Feature ${id}`,
          checked: true,
          color: FEATURE_COLOR,
          bbox: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          center: { lat: center.lat, lng: center.lng },
          geometry: e.layer.toGeoJSON().geometry,
        })
        return
      }

      e.layer.options.aoiId = generateAoiId()
      setAois([
        ...aois,
        {
          id: e.layer.options.aoiId,
          name: 'New AOI',
          checked: true,
          color: AOI_COLOR,
          bbox: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          center: { lat: center.lat, lng: center.lng },
          geometry: e.layer.toGeoJSON().geometry,
        },
      ])
      setSelectedAoi(e.layer.options.aoiId)
    })

    map.on('pm:remove', (e) => {
      const { aois, setAois } = useStore.getState()
      setAois(aois.filter((a) => a.id !== e.layer.options.aoiId))
    })

    drawAois(aoiLayer)
    syncOverlayLayers(map, tileLayerRef)
    syncFeatureLayers(map, featureLayerRef)
    syncCropMapLayer(map, cropMapLayerRef)
    syncPlotsLayer(map, plotLayerRef)

    const unsubAois = useStore.subscribe(
      (s) => s.aois,
      () => drawAois(aoiLayer)
    )
    const unsubSatellite = useStore.subscribe(
      (s) => s.satelliteLayers,
      () => syncOverlayLayers(map, tileLayerRef)
    )
    const unsubFeatures = useStore.subscribe(
      (s) => s.featurePolygons,
      () => syncFeatureLayers(map, featureLayerRef)
    )
    const unsubCropMap = useStore.subscribe(
      (s) => s.plotLayers.crop_map,
      () => syncCropMapLayer(map, cropMapLayerRef)
    )
    const unsubPlots = useStore.subscribe(
      (s) => s.plotLayers.plots,
      () => syncPlotsLayer(map, plotLayerRef)
    )

    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      unsubAois()
      unsubSatellite()
      unsubFeatures()
      unsubCropMap()
      unsubPlots()
      initializedRef.current = false
      map.remove()
      mapInstanceRef.current = null
      aoiLayerRef.current = null
      tileLayerRef.current = {}
      featureLayerRef.current = {}
      cropMapLayerRef.current = null
      plotLayerRef.current = null
    }
  }, [])

  return (
    <div className='map-area'>
      <div ref={mapRef} className='map-container' style={{ height: '100%' }} />
    </div>
  )
}
