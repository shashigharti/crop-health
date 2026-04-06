import { HEALTH_COLORS, CROP_COLORS } from './common'

export const createPlot = (set) => ({
  plotLayers: {
    crop_map: { url: null, visible: false, label: 'Crop Classification', legend: CROP_COLORS },
    plots: { geojson: null, visible: false, label: 'Crop Health', legend: HEALTH_COLORS },
  },

  selectedPlotLayer: 'crop_map',

  setPlotLayer: (id, value) =>
    set((s) => ({
      plotLayers: {
        ...s.plotLayers,
        [id]: { ...s.plotLayers[id], ...value },
      },
    })),

  setSelectedPlotLayer: (id) => set({ selectedPlotLayer: id }),
})
