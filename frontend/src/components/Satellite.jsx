import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useGeeAPI } from '../apis/gee'
import Legend from './Legend'

export default function SatelliteLayer() {
  const {
    selectedAoi,
    satelliteLayerDefs,
    satelliteLayers,
    setSatelliteLayer,
    downloadData,
    setDownloadData,
  } = useStore()
  const { download } = useGeeAPI()

  console.log(satelliteLayers)

  const aoiLayers = satelliteLayers[selectedAoi?.id] ?? {}

  const toggleLayer = (aoiId, layerId) => {
    const current = satelliteLayers[aoiId]?.[layerId]?.checked ?? true
    setSatelliteLayer(aoiId, layerId, { checked: !current })
  }

  useEffect(() => {
    if (!selectedAoi) return
    const layers = Object.values(aoiLayers ?? {})
    const allLoaded = layers.length > 0 && layers.every(({ url }) => url)

    if (!allLoaded) {
      setDownloadData(true)
      return
    }

    setDownloadData(false)
  }, [selectedAoi])

  useEffect(() => {
    if (downloadData) {
      download(selectedAoi.id)
      setDownloadData(false)
    }
  }, [downloadData])

  if (!selectedAoi) {
    return (
      <fieldset className='crop-list'>
        <legend>Satellite Layers</legend>
        <div className='crop-empty'>
          <i className='bi bi-arrow-up crop-empty__icon' />
          <span>Select a crop class above to download satellite images</span>
        </div>
      </fieldset>
    )
  }

  return (
    <fieldset className='crop-list'>
      <legend>Satellite Layers — {selectedAoi.name}</legend>

      {satelliteLayers &&
        Object.keys(aoiLayers).length > 0 &&
        satelliteLayerDefs.map((layer) => {
          const state = aoiLayers[layer.id] ?? { checked: true, status: 'idle', url: null }
          return (
            <>
              <div key={layer.id} className='crop-item sat-item'>
                <input
                  type='checkbox'
                  checked={state.checked ?? true}
                  onChange={() => toggleLayer(selectedAoi.id, layer.id)}
                />
                <div className='crop-info' style={{ flex: 1 }}>
                  <span className='crop-name'>
                    <i className={`bi ${layer.icon}`} style={{ marginRight: '0.3rem' }} />
                    {layer.name}
                  </span>
                  <span className='crop-bbox'>{layer.desc}</span>
                </div>
                <span className='sat-status'>
                  {state.status === 'done' && state.url && (
                    <i className='bi bi-check-circle-fill sat-done-icon' title='Downloaded' />
                  )}
                  {state.status === 'downloading' && (
                    <i className='bi bi-arrow-repeat      sat-spin-icon' title='Downloading...' />
                  )}
                  {state.status === 'error' && (
                    <i className='bi bi-x-circle-fill     sat-error-icon' title='Failed' />
                  )}
                </span>
              </div>
              <Legend legend={state.legend?.palette ?? []} labels={state.legend?.labels ?? {}} />
            </>
          )
        })}
    </fieldset>
  )
}
