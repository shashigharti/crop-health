import { useStore } from '../store/useStore'
import { useGeeAPI } from '../apis/gee'

export default function SatelliteLayer() {
  const { aois, satelliteLayerDefs, satelliteLayers, setSatelliteLayer } = useStore()
  const { download } = useGeeAPI()

  const selectedAoi = aois.find((a) => a.checked)
  const aoiLayers = satelliteLayers[selectedAoi?.id] ?? {}
  const allDone = satelliteLayerDefs.every((l) => aoiLayers[l.id]?.status === 'done')
  const anyDownloading = satelliteLayerDefs.some((l) => aoiLayers[l.id]?.status === 'downloading')

  const toggleLayer = (aoiId, layerId) => {
    const current = satelliteLayers[aoiId]?.[layerId]?.checked ?? true
    // console.log(satelliteLayers[aoiId], !current);
    setSatelliteLayer(aoiId, layerId, { checked: !current })
  }

  // console.log(satelliteLayers);

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

      {satelliteLayerDefs.map((layer) => {
        const state = aoiLayers[layer.id] ?? { checked: true, status: 'idle', url: null }
        return (
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
        )
      })}

      <button
        className={`sat-download-all ${allDone ? 'sat-download-all--done' : ''}`}
        onClick={() => download(selectedAoi.id)}
        disabled={anyDownloading}
      >
        {anyDownloading && (
          <>
            <i className='bi bi-arrow-repeat sat-spin-icon' /> Downloading...
          </>
        )}
        {allDone && (
          <>
            <i className='bi bi-check-circle-fill' /> Re-download All
          </>
        )}
        {!anyDownloading && !allDone && (
          <>
            <i className='bi bi-download' /> Download All
          </>
        )}
      </button>
    </fieldset>
  )
}
