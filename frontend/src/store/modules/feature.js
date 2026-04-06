export const createFeature = (set) => ({
  featurePolygons: {},

  setFeaturePolygons: (polygons) => set({ featurePolygons: polygons }),

  clearFeaturePolygons: () => set({ featurePolygons: {} }),

  clearCropFeatures: (crop) =>
    set((s) => ({
      featurePolygons: {
        ...s.featurePolygons,
        [crop]: [],
      },
    })),

  addFeaturePolygon: (crop, feature) =>
    set((s) => ({
      featurePolygons: {
        ...s.featurePolygons,
        [crop]: [...(s.featurePolygons[crop] ?? []), feature],
      },
    })),

  toggleFeatureVisible: (crop, id) =>
    set((s) => ({
      featurePolygons: {
        ...s.featurePolygons,
        [crop]: (s.featurePolygons[crop] ?? []).map((p) =>
          p.id === id ? { ...p, visible: !p.visible } : p
        ),
      },
    })),
})
