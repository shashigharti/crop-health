export const MODES = {
  ADD_AOI: 'Add AOI',
  ADD_FEATURE: 'Add Feature',
}

export const HEALTH_LABELS = { 0: 'Stressed', 1: 'Moderate', 2: 'Healthy' }
export const CROP_LABELS = { 0: 'Other', 1: 'Coffee', 2: 'Cocoa' }

export const HEALTH_COLORS = {
  0: '#d7191c',
  1: '#fdae61',
  2: '#1a9641',
}

export const CROP_COLORS = {
  0: '#808080',
  1: '#00ff00',
  2: '#ff00ff',
}

export const AOI_COLOR = '#1565c0'
export const FEATURE_COLOR = '#00ff00'

export const createCommon = (set) => ({
  mode: MODES.ADD_AOI,
  userMessage: '',
  cropMapUrl: '',
  plotsGeoJSON: null,

  setMode: (mode) => set({ mode }),
  setUserMessage: (userMessage) => set({ userMessage }),
  setCropMapUrl: (cropMapUrl) => set({ cropMapUrl }),
  setPlotsGeoJSON: (plotsGeoJSON) => set({ plotsGeoJSON }),
})
