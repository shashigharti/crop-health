import { useStore } from '../store/useStore'
import Hint from './Hint'

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

  const deleteFeature = (polyId) => {
    setFeaturePolygons({
      ...featurePolygons,
      [selectedAoi.id]: featurePolygons[selectedAoi.id].filter((p) => p.id !== polyId),
    })
  }

  return (
    <fieldset className='feature-list'>
      <legend>Feature List{selectedAoi ? ` — ${selectedAoi.name}` : ''}</legend>

      {!selectedAoi && (
        <Hint
          message={
            <>
              <span>Select an AOI above to view its features</span>
            </>
          }
        />
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
        <div key={poly.id} className='list-item'>
          <input
            type='checkbox'
            checked={poly.visible ?? true}
            onChange={() => toggleVisible(poly.id)}
          />
          <div className='list-item__info'>
            <span className='list-item__name'>
              <i className='bi bi-pentagon' style={{ marginRight: '0.3rem', opacity: 0.6 }} />
              {String(poly.name)}
            </span>
          </div>
          <div className='list-item__actions'>
            <button className='list-item__btn list-item__btn--edit' title='Edit feature'>
              <i className='bi bi-pencil-square' />
            </button>
            <button
              className='list-item__btn list-item__btn--delete'
              onClick={() => deleteFeature(poly.id)}
              title='Delete feature'
            >
              <i className='bi bi-trash3' />
            </button>
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
