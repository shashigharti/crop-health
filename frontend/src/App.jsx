import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import TopBar from './components/TopBar'
import Banner from './components/Banner'
import ControlsBar from './components/ControlsBar'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'

export default function App() {
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
