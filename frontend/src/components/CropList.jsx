import { useState } from 'react'
import { useStore } from '../store/useStore'
import Hint from './Hint'

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

export default function CropList() {
  const { aois, setAois, setMapCenter } = useStore()
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const selectedId = aois.find((a) => a.checked)?.id ?? null

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

  return (
    <fieldset className='crop-list'>
      <legend>STEP1 — Crops (Classes)</legend>

      <Hint message={<>Add new class by adding a bounding box</>} />
      {aois.length === 0 ? (
        <p className='crop-empty'>No AOIs set — Add AOIs for classes or use preset</p>
      ) : (
        aois.map((aoi) => (
          <div key={aoi.id} className='crop-item'>
            <input
              type='radio'
              name='crop-selection'
              checked={aoi.id === selectedId}
              onChange={() => handleChange(aoi.id)}
            />
            <div className='crop-info' style={{ flex: 1 }}>
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
                <span className='crop-name'>
                  {aoi.name}
                  <i
                    className='bi bi-pencil crop-edit-icon'
                    title='Edit name'
                    onClick={() => startEdit(aoi)}
                  />
                </span>
              )}
              {aoi.bbox && (
                <span className='crop-bbox'>
                  N {aoi.bbox.north}° S {aoi.bbox.south}° E {aoi.bbox.east}° W {aoi.bbox.west}°
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </fieldset>
  )
}
