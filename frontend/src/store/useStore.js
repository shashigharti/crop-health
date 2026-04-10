import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { createUi } from './modules/ui'
import { createMap } from './modules/map'
import { createAoi } from './modules/aoi'
import { createFilter } from './modules/filter'
import { createFeature } from './modules/feature'
import { createSatellite } from './modules/satellite'
import { createPlot } from './modules/plot'
import { createCommon } from './modules/common'
import { createDateSelector } from './modules/dateselector'

const STORAGE_KEY = 'cropmap-state'

export const useStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...createUi(set, get),
        ...createMap(set, get),
        ...createAoi(set, get),
        ...createFilter(set, get),
        ...createFeature(set, get),
        ...createSatellite(set, get),
        ...createCommon(set, get),
        ...createPlot(set, get),
        ...createDateSelector(set, get),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => {
          const { mapInstance, mapZoom, ...rest } = state
          return rest
        },
      }
    )
  )
)
