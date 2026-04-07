import { useState } from 'react'
import { useStore } from '../store/useStore'
import Hint from './Hint'

export default function FeatureList() {
  const { featurePolygons, aois, clearCropFeatures, setFeaturePolygons } = useStore()
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const selectedAoi = aois.find((a) => a.checked)
  const polygons = selectedAoi ? (featurePolygons[selectedAoi.id] ?? []) : []

  const updatePolygons = (updater) =>
    setFeaturePolygons({
      ...featurePolygons,
      [selectedAoi.id]: updater(featurePolygons[selectedAoi.id] ?? []),
    })

  const toggleVisible = (id) =>
    updatePolygons((ps) => ps.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)))

  const deleteFeature = (id) => updatePolygons((ps) => ps.filter((p) => p.id !== id))

  const commitEdit = () => {
    const name = editingName.trim()
    if (name) updatePolygons((ps) => ps.map((p) => (p.id === editingId ? { ...p, name } : p)))
    setEditingId(null)
  }

  return (
    <fieldset className='feature-list'>
      <legend>Feature List{selectedAoi ? ` — ${selectedAoi.name}` : ''}</legend>

      {!selectedAoi && <Hint message={<span>Select an AOI above to view its features</span>} />}

      {selectedAoi && polygons.length === 0 && (
        <div className='crop-empty'>
          <i className='bi bi-info-circle crop-empty__icon' />
          <span>
            Add features for <strong>{selectedAoi.name}</strong>
          </span>
        </div>
      )}

      {polygons.map((poly) => (
        <div key={poly.id} className='list-item'>
          <input
            type='checkbox'
            checked={poly.visible ?? true}
            readOnly
            onClick={(e) => {
              e.stopPropagation()
              toggleVisible(poly.id)
            }}
          />
          <div className='list-item__info'>
            {editingId === poly.id ? (
              <input
                className='crop-name-input'
                value={editingName}
                placeholder='Feature name'
                autoFocus
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
              />
            ) : (
              <span className='list-item__name'>
                <i className='bi bi-pentagon' style={{ marginRight: '0.3rem', opacity: 0.6 }} />
                {poly.name}
              </span>
            )}
          </div>
          <div className='list-item__actions'>
            <button
              className='list-item__btn list-item__btn--edit'
              onClick={() => {
                setEditingId(poly.id)
                setEditingName(poly.name)
              }}
              title='Edit feature'
            >
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

      {selectedAoi && polygons.length > 0 && (
        <button
          className='feature-list__delete feature-list__delete--danger'
          onClick={() => clearCropFeatures(selectedAoi.id)}
        >
          <i className='bi bi-trash' /> Clear All
        </button>
      )}
    </fieldset>
  )
}
