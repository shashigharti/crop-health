import { useStore } from '../store/useStore'

export default function FeatureList() {
  const { featurePolygons, aois, clearCropFeatures, setFeaturePolygons } = useStore()
  const selectedAoi = aois.find((a) => a.checked)
  const selectedPolygons = selectedAoi
    ? Array.isArray(featurePolygons[selectedAoi.id])
      ? featurePolygons[selectedAoi.id]
      : []
    : []

  console.log(featurePolygons)

  const toggleVisible = (polyId) => {
    setFeaturePolygons({
      ...featurePolygons,
      [selectedAoi.id]: featurePolygons[selectedAoi.id].map((p) =>
        p.id === polyId ? { ...p, visible: !p.visible } : p
      ),
    })
  }

  return (
    <fieldset className='feature-list'>
      <legend>Feature List{selectedAoi ? ` — ${selectedAoi.name}` : ''}</legend>

      {!selectedAoi && (
        <div className='crop-empty'>
          <i className='bi bi-arrow-up crop-empty__icon' />
          <span>Select an AOI above to view its features</span>
        </div>
      )}

      {selectedAoi && selectedPolygons.length === 0 && (
        <div className='crop-empty'>
          <i className='bi bi-info-circle crop-empty__icon' />
          <span>
            Add features for <strong>{selectedAoi.name}</strong>
          </span>
        </div>
      )}

      {selectedPolygons.map((poly) => (
        <div key={poly.id} className='crop-item'>
          <input
            type='checkbox'
            checked={poly.visible ?? false}
            onChange={() => toggleVisible(poly.id)}
          />
          <div className='crop-info'>
            <span className='crop-name'>
              <i className='bi bi-pentagon' style={{ marginRight: '0.3rem', opacity: 0.6 }} />
              {String(poly.name)}
            </span>
          </div>
        </div>
      ))}

      {selectedAoi && (
        <button
          className='sat-download-all sat-download-all--danger'
          onClick={() => clearCropFeatures(selectedAoi.id)}
        >
          <i className='bi bi-trash' /> Clear All Features
        </button>
      )}
    </fieldset>
  )
}
