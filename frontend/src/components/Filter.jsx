import { useStore } from '../store/useStore'
import { HEALTH_LABELS, CROP_LABELS } from '../store/modules/common'

export default function Filter() {
  const {
    selectedCrop,
    setSelectedCrop,
    selectedCropHealth,
    setSelectedCropHealth,
    applyPlotFilters,
  } = useStore()

  const cropOptions = Object.entries(CROP_LABELS) // [[0,'Other'],[1,'Coffee'],[2,'Cocoa']]
  const healthOptions = Object.entries(HEALTH_LABELS) // [[0,'Stressed'],[1,'Moderate'],[2,'Healthy']]

  const handleApply = () => {
    const crops = selectedCrop ? [selectedCrop] : []
    const healths = selectedCropHealth ? [Number(selectedCropHealth)] : []
    applyPlotFilters(crops, healths)
  }

  const handleReset = () => {
    setSelectedCrop(null)
    setSelectedCropHealth(null)
    applyPlotFilters([], [])
  }

  return (
    <div className='filter-bar'>
      <label className='filter-bar__label'>Crop</label>
      <select
        className='filter-bar__select'
        value={selectedCrop ?? ''}
        onChange={(e) => setSelectedCrop(e.target.value || null)}
      >
        <option value=''>All crops</option>
        {cropOptions.map(([value, label]) => (
          <option key={value} value={label.toLowerCase()}>
            {label}
          </option>
        ))}
      </select>

      <label className='filter-bar__label'>Health</label>
      <select
        className='filter-bar__select'
        value={selectedCropHealth ?? ''}
        onChange={(e) => setSelectedCropHealth(e.target.value || null)}
      >
        <option value=''>All health</option>
        {healthOptions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button className='filter-bar__btn' onClick={handleApply}>
        Apply
      </button>
      <button className='filter-bar__btn filter-bar__btn--reset' onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}
