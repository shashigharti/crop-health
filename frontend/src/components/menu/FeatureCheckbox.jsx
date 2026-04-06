import { useStore } from '../../store/useStore'
import { MODES } from '../../store/modules/common'

const MESSAGES = {
  [MODES.ADD_FEATURE]:
    'MODE: Add Feature | Draw polygons on the map to add features for the selected class',
  [MODES.ADD_AOI]: 'MODE: Add AOI | Draw boundaries (AOIs) for each class e.g. Cocoa, Coffee',
}

export default function FeatureCheckbox() {
  const { mode, setMode, setUserMessage } = useStore()
  const isActive = mode === MODES.ADD_FEATURE

  const handleChange = () => {
    const mode = isActive ? MODES.ADD_AOI : MODES.ADD_FEATURE
    setMode(mode)
    setUserMessage(MESSAGES[mode])
  }

  return (
    <label className={`preset-checkbox ${isActive ? 'preset-checkbox--active' : ''}`}>
      <input type='checkbox' checked={isActive} onChange={handleChange} />
      <span>Enable Add Feature</span>
    </label>
  )
}
