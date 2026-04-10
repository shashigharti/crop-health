const DEFAULT_SATELLITE_LAYERS = [
  { id: 'emit_rgb', name: 'EMIT RGB', desc: 'Hyperspectral RGB composite', icon: 'bi-broadcast' },
  { id: 's2_rgb', name: 'Sentinel-2 RGB', desc: 'Multispectral RGB composite', icon: 'bi-layers' },
  { id: 'ndvi', name: 'NDVI (Sentinel-2)', desc: 'Vegetation index', icon: 'bi-tree' },
  { id: 'ndre', name: 'NDRE (EMIT)', desc: 'Red-edge vegetation index', icon: 'bi-broadcast' },
]

export const createSatellite = (set) => ({
  satelliteLayerDefs: DEFAULT_SATELLITE_LAYERS,
  downloadData: false,
  setDownloadData: (downloadData) => set({ downloadData }),

  satelliteLayers: {},

  setSatelliteLayer: (aoiId, layerId, value) =>
    set((s) => ({
      satelliteLayers: {
        ...s.satelliteLayers,
        [aoiId]: {
          ...s.satelliteLayers[aoiId],
          [layerId]: { ...s.satelliteLayers[aoiId]?.[layerId], ...value },
        },
      },
    })),

  initSatelliteLayer: (aoiId) =>
    set((s) => ({
      satelliteLayers: {
        ...s.satelliteLayers,
        [aoiId]:
          s.satelliteLayers[aoiId] ??
          Object.fromEntries(
            DEFAULT_SATELLITE_LAYERS.map((l) => [
              l.id,
              { checked: false, status: 'idle', url: null },
            ])
          ),
      },
    })),

  removeSatelliteLayer: (aoiId) =>
    set((s) => {
      console.log('removing', aoiId, s.satelliteLayers)
      const { [aoiId]: _, ...rest } = s.satelliteLayers
      console.log('remaining', rest)
      return { satelliteLayers: rest }
    }),
})
