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
          <fieldset className='crop-list'>
            <legend>Step 2 — Add Features</legend>
            <Hint
              message={
                <>
                  For feature class, <strong>download following satellite images</strong> and add
                  new features.
                </>
              }
            />
            <SatelliteLayer />
            <Hint
              message={
                <>
                  Click <strong>"Enable to Add Feature"</strong> to add features for selected class.
                </>
              }
            />
            <div style={{ marginTop: '0.5rem' }}>
              <FeatureList />
            </div>
            <Plot />
          </fieldset>
        </div>
      </div>      
    </>
  )
}
