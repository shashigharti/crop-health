export const createFilter = (set, get) => ({
  selectedCrop:       null,
  selectedCropHealth: null,

  setSelectedCrop:       (crop)   => set({ selectedCrop: crop }),
  setSelectedCropHealth: (health) => set({ selectedCropHealth: health }),

  applyPlotFilters: (selectedCrops, selectedHealths) => {
    const { plotLayers } = get()
    const geojson = plotLayers?.plots?.geojson
    
    if (!geojson) {
      console.warn('no geojson in plotLayers.plots')
      return
    }

    const filteredGeojson = {
      ...geojson,
      features: geojson.features.filter(f => {
        const cropMatch   = !selectedCrops.length   || selectedCrops.includes(f.properties.crop)
        const healthMatch = !selectedHealths.length || selectedHealths.includes(f.properties.health)
        return cropMatch && healthMatch
      }),
    }

    console.log('filteredGeojson features:', filteredGeojson.features.length)

    set((state) => ({
      plotLayers: {
        ...state.plotLayers,
        plots: { ...state.plotLayers.plots, filteredGeojson },
      },
    }))
  },

  resetPlotFilters: () => {
    const { plotLayers } = get()
    set({
      selectedCrop:       null,
      selectedCropHealth: null,
      plotLayers: {
        ...plotLayers,
        plots: { ...plotLayers.plots, filteredGeojson: null },
      },
    })
  },
})