export const createAoi = (set) => ({
  aois: [],

  setAois: (aois) => set({ aois }),

  addAoi: (aoi) =>
    set((s) => ({
      aois: [
        ...s.aois,
        {
          id: aoi.id ?? Date.now(),
          name: aoi.name || 'New AOI',
          checked: true,
          color: aoi.color || '#1565c0',
          bbox: aoi.bbox || null,
          center: aoi.center || null,
          geometry: aoi.geometry || null,
        },
      ],
    })),

  updateAoiName: (id, name) =>
    set((s) => ({ aois: s.aois.map((a) => (a.id === id ? { ...a, name } : a)) })),

  toggleAoiChecked: (id) =>
    set((s) => ({
      aois: s.aois.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)),
    })),

  removeAoi: (id) => set((s) => ({ aois: s.aois.filter((a) => a.id !== id) })),
})
