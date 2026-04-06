import HelpPanel from './HelpPanel'
import MapView from './MapView'

export default function RightPanel() {
  return (
    <div className='right-panel'>
      <MapView />
      <HelpPanel />
    </div>
  )
}
