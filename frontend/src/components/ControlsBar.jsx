import { useStore } from '../store/useStore'
import { useGeeAPI } from '../apis/gee'
import FeatureCheckbox from './menu/FeatureCheckbox'
import PresetCheckbox from './menu/PresetCheckbox'
import Filter from './Filter'
import DateSelector from './DateSelector'

const LEFT_ITEMS = [
  // { name: 'Train the Model', icon: 'bi-cpu', mode: 'train' },
  { name: 'Make Plot', icon: 'bi-bar-chart', mode: 'makePlot' },
]

const RIGHT_ITEMS = [{ name: 'Export', icon: 'bi-box-arrow-up', mode: 'export' }]

export default function ControlsBar() {
  const { addFeaturesAndTrain, makePlot } = useGeeAPI()

  const {
    training,
    setTraining,
    trainDone,
    setTrainDone,
    plotting,
    setPlotting,
    plotDone,
    setPlotDone,
  } = useStore()

  const handleTrain = async () => {
    setTraining(true)
    setTrainDone(false)
    try {
      await addFeaturesAndTrain()
      setTrainDone(true)
    } finally {
      setTraining(false)
    }
  }

  const handleMakePlot = async () => {
    setPlotting(true)
    setPlotDone(false)
    try {
      await makePlot()
      setPlotDone(true)
    } finally {
      setPlotting(false)
    }
  }
  const CALLBACKS = {
    train: handleTrain,
    makePlot: handleMakePlot,
  }

  const handleClick = (item) => {
    const cb = CALLBACKS[item.mode]
    if (cb) cb()
  }

  const renderBtn = (item) => {
    const isTrainBtn = item.mode === 'train'
    const isPlotBtn = item.mode === 'makePlot'
    const busy = (isTrainBtn && training) || (isPlotBtn && plotting)
    const done = (isTrainBtn && trainDone) || (isPlotBtn && plotDone)

    return (
      <button
        key={item.mode}
        className='controls-bar__btn'
        onClick={() => handleClick(item)}
        disabled={busy}
      >
        {busy && (
          <i className='bi bi-arrow-repeat sat-spin-icon' style={{ marginRight: '0.3rem' }} />
        )}
        {!busy && done && (
          <i
            className='bi bi-check-circle-fill'
            style={{ color: 'var(--color-success)', marginRight: '0.3rem' }}
          />
        )}
        {!busy && !done && <i className={`bi ${item.icon}`} style={{ marginRight: '0.3rem' }} />}
        {item.name}
      </button>
    )
  }

  return (
    <div className='controls-bar'>
      <div className='container-fluid'>
        <div className='row align-items-center'>
          <div className='col-2 d-flex justify-content-start align-items-center gap-2'>
            {LEFT_ITEMS.map(renderBtn)}
          </div>
          <div className='col-4 d-flex justify-content-center gap-3'>
            <PresetCheckbox />
            {/* <FeatureCheckbox /> */}
            <DateSelector />
          </div>
          <div className='col-4 d-flex justify-content-center gap-3'>
            <Filter />
          </div>
          {/* <div className='col-2 d-flex justify-content-end gap-2'>{RIGHT_ITEMS.map(renderBtn)}</div> */}
        </div>
      </div>
    </div>
  )
}
