import { useStore } from '../store/useStore'
import { plotToAOI } from '../utils/geo'

const CROP_KEYS = ['cocoa', 'coffee', 'other']

export const useGeeAPI = () => {
  const { aois, satelliteLayerDefs, setSatelliteLayer } = useStore()

  const { setUserMessage, setStepComplete } = useStore.getState()

  const markStepsComplete = (upTo) => {
    for (let i = 0; i <= upTo; i++) setStepComplete(i, true)
  }

  const download = async (aoiId) => {
    const aoi = aois.find((a) => a.id === aoiId)
    if (!aoi) return

    satelliteLayerDefs.forEach((l) => setSatelliteLayer(aoiId, l.id, { status: 'downloading' }))
    setUserMessage(`DATA DOWNLOAD: Started for ${aoiId}...`)

    try {
      console.log(aoi)
      const res = await fetch('/api/images/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aoi: aoi.geometry,
          class_name: aoi.id,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setUserMessage(`DATA DOWNLOAD: Error | ${data.detail}`)
        satelliteLayerDefs.forEach((l) => setSatelliteLayer(aoiId, l.id, { status: 'error' }))
        return
      }

      Object.entries(data.layers).forEach(([id, url]) =>
        setSatelliteLayer(aoiId, id, { status: 'done', url })
      )
      setUserMessage(`DATA DOWNLOAD: ${data.status}`)
    } catch (e) {
      satelliteLayerDefs.forEach((l) => setSatelliteLayer(aoiId, l.id, { status: 'error' }))
      setUserMessage(`DATA DOWNLOAD: Failed | ${e?.message ?? 'Unknown error'}`)
      console.error(e)
    }
  }

  const addFeaturesAndTrain = async () => {
    const { featurePolygons, aois, setPlotLayer } = useStore.getState()
    const selectedAoi = aois.find((a) => a.checked)

    if (!selectedAoi) {
      setUserMessage('Select an AOI first.')
      return
    }

    const cropEntries = Object.entries(featurePolygons).filter(
      ([key, polygons]) => CROP_KEYS.includes(key) && Array.isArray(polygons) && polygons.length > 0
    )

    if (cropEntries.length === 0) {
      setUserMessage('Add training polygons first.')
      return
    }

    setUserMessage('TRAINING: Processing data...')

    for (const [cropName, polygons] of cropEntries) {
      for (const poly of polygons) {
        const res = await fetch('/api/training/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geometry: poly.geometry, class_name: cropName }),
        })

        const data = await res.json()
        if (!res.ok) {
          setUserMessage(`TRAINING: Error adding ${cropName} | ${data.detail}`)
          return
        }
        setUserMessage(`TRAINING: ${data.status}`)
      }
    }

    setUserMessage('TRAINING: Started — this may take a few seconds...')

    const res = await fetch('/api/training/train', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setUserMessage(`TRAINING: Failed | ${data.detail}`)
      return
    }

    setPlotLayer('crop_map', { url: data.layers.crop_map })
    markStepsComplete(2)
    setUserMessage(`TRAINING: Complete | ${data.status}`)
    return data
  }

  const makePlot = async () => {
    const { setPlotLayer } = useStore.getState()
    setUserMessage('PLOTS: Building plot polygons...')

    const res = await fetch('/api/plots/make', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setUserMessage(`PLOTS: Failed | ${data.detail}`)
      return
    }

    setPlotLayer('plots', { geojson: data.geojson })
    markStepsComplete(3)
    setUserMessage(`PLOTS: ${data.status}`)
    return data
  }

  return { download, addFeaturesAndTrain, makePlot }
}
