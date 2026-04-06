export const createMap = (set) => ({
  basemapLayers: {
    googleHybrid: true,
    openStreetMap: false,
    esriWorldImagery: false,
  },

  // overlayLayers: {},

  mapCenter: [-0.42, 36.95],
  setMapCenter: (bounds) => set({ mapCenter: { bounds } }),

  mapZoom: 12,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),

  setBasemapLayer: (key, value) =>
    set((s) => ({ basemapLayers: { ...s.basemapLayers, [key]: value } })),

  // setOverlayLayer: (key, value) =>
  //   set((s) => ({
  //     overlayLayers: {
  //       ...s.overlayLayers,
  //       [key]: { ...s.overlayLayers[key], ...value },
  //     },
  //   })),
})
