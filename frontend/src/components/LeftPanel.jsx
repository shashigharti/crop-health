import { useStore } from '../store/useStore'
import CropList from './CropList'
import FeatureList from './FeatureList'
import Hint from './Hint'
import Plot from './Plot'
import SatelliteLayer from './Satellite'

export default function LeftPanel() {
  const { leftPanelOpen, setLeftPanelOpen } = useStore()

  return (
    <>
      <div className={`left-panel${leftPanelOpen ? '' : ' left-panel--collapsed'}`}>
        <div className='left-panel__inner'>
          <CropList />
          <SatelliteLayer />
          {/* <FeatureList /> */}
        </div>
      </div>
    </>
  )
}
