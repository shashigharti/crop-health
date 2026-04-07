import { useEffect } from 'react'

import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import TopBar from './components/TopBar'
import Banner from './components/Banner'
import ControlsBar from './components/ControlsBar'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import { useStore } from './store/useStore'

export default function App() {
  const { aois, setUserMessage } = useStore()

  useEffect(() => {
    if (aois.length === 0) {
      setUserMessage('Use Preset or Add AOIs by drawing a bounding box on the map')
    }
    console.log('init')
  }, [])

  return (
    <div className='app'>
      <TopBar />
      <Banner />
      <ControlsBar />
      <div className='workspace'>
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  )
}
