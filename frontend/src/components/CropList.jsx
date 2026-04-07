import { useState } from 'react'
import { useStore } from '../store/useStore'
import Hint from './Hint'
import { toSlug } from '../utils/common'

export default function CropList() {
  const { aois, setAois, setMapCenter } = useStore()
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const selectedId = aois.find((a) => a.checked)?.id ?? null

  console.log(aois)

  const handleChange = (id) => {
    setAois(aois.map((a) => ({ ...a, checked: a.id === id })))
    const aoi = aois.find((a) => a.id === id)
    if (aoi?.bbox) {
      const { north, south, east, west } = aoi.bbox
      setMapCenter([(north + south) / 2, (east + west) / 2])
    }
  }

  const startEdit = (aoi) => {
    setEditingId(aoi.id)
    setEditingName(String(aoi.name))
  }

  const commitEdit = () => {
    const newName = editingName.trim()
    if (newName) {
      setAois(
        aois.map((a) => (a.id === editingId ? { ...a, name: newName, id: toSlug(newName) } : a))
      )
    }
    setEditingId(null)
  }

  const deleteAoi = (id) => {
    setAois(aois.filter((a) => a.id !== id))
  }

  return (
    <fieldset className='crop-list'>
      <legend>STEP1 — Crops (Classes)</legend>

      <Hint message={<>Add new class by adding a bounding box</>} />
      {aois.length === 0 ? (
        <p className='crop-empty'>No AOIs set — Add AOIs for classes or use preset</p>
      ) : (
        aois.map((aoi) => (
          <div key={aoi.id} className='list-item'>
            <input
              type='radio'
              name='crop-selection'
              checked={aoi.id === selectedId}
              onChange={() => handleChange(aoi.id)}
            />
            <div className='list-item__info'>
              {editingId === aoi.id ? (
                <input
                  className='crop-name-input'
                  value={editingName}
                  placeholder='Name (e.g. Coffee)'
                  autoFocus
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                />
              ) : (
                <span className='list-item__name'>{aoi.name}</span>
              )}
              {/* {aoi.bbox && (
                <span className='crop-bbox'>
                  N {aoi.bbox.north}° S {aoi.bbox.south}° E {aoi.bbox.east}° W {aoi.bbox.west}°
                </span>
              )} */}
            </div>
            <div className='list-item__actions'>
              <button
                className='list-item__btn list-item__btn--edit'
                onClick={() => startEdit(aoi)}
                title='Edit name'
              >
                <i className='bi bi-pencil-square' />
              </button>
              <button
                className='list-item__btn list-item__btn--delete'
                onClick={() => deleteAoi(aoi.id)}
                title='Delete AOI'
              >
                <i className='bi bi-trash3' />
              </button>
            </div>
          </div>
        ))
      )}
    </fieldset>
  )
}
