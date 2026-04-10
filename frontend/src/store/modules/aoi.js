export const createAoi = (set, get) => ({
  aois: [],

  setAois: (aois) => set({ aois }),
  selectedAoi: null,
  setSelectedAoi: (id) => {
    const aois = get().aois
    // console.log('id received:', id)
    const found = aois.find((aoi) => aoi.id === id) ?? null
    // console.log('found result:', found)

    set({ selectedAoi: found })
  },

  addAoi: (aoi) =>
    set((s) => ({
      aois: [
        ...s.aois,
        {
          id: aoi.id,
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
