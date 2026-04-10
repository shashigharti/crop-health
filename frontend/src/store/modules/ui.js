export const createUi = (set, get) => ({
  currentStep: 0,
  steps: [
    'Draw boundaries (AOIs) for each crop class e.g. Cocoa, Coffee',
    'Download data (EMIT + S2)',
    'Visualize Indices (NDVI/NDRI)',
  ],
  stepsComplete: [false, false, false, false, false],

  setCurrentStep: (currentStep) => set({ currentStep }),
  setStepComplete: (index, value) =>
    set((s) => {
      const stepsComplete = [...s.stepsComplete]
      stepsComplete[index] = value
      return { stepsComplete }
    }),

  leftPanelOpen: true,
  setLeftPanelOpen: (leftPanelOpen) => set({ leftPanelOpen }),
  training: false,
  trainDone: false,
  plotting: false,
  plotDone: false,

  setTraining: (training) => set({ training }),
  setTrainDone: (trainDone) => set({ trainDone }),
  setPlotting: (plotting) => set({ plotting }),
  setPlotDone: (plotDone) => set({ plotDone }),
})
