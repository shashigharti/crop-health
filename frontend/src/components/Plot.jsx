import { useStore } from '../store/useStore'
import { HEALTH_COLORS, CROP_COLORS, HEALTH_LABELS, CROP_LABELS } from '../store/modules/common'
import Legend from './Legend'
import Hint from './Hint'

export default function Plot() {
  const { plotLayers, setPlotLayer } = useStore()

  const hasData = plotLayers.crop_map.url || plotLayers.plots.geojson

  if (!hasData) {
    return (
      <fieldset className='crop-list'>
        <legend>Plot Layers</legend>
        <Hint html='Click <strong>Make Plot</strong> in the toolbar to generate plots' />
      </fieldset>
    )
  }

  return (
    <fieldset className='crop-list'>
      <legend>Plot Layers</legend>

      {Object.entries(plotLayers).map(([id, layer]) => {
        const hasLayer = id === 'crop_map' ? !!layer.url : !!layer.geojson
        const isChecked = !!layer.visible

        return (
          <div key={id}>
            <div className='crop-item sat-item'>
              <input
                type='checkbox'
                checked={isChecked}
                disabled={!hasLayer}
                onChange={() => setPlotLayer(id, { visible: !isChecked })}
              />
              <div className='crop-info' style={{ flex: 1 }}>
                <span className='crop-name'>{layer.label}</span>
              </div>
              <span className='sat-status'>
                {hasLayer ? (
                  <i className='bi bi-check-circle-fill sat-done-icon' title='Available' />
                ) : (
                  <i className='bi bi-hourglass' title='Not ready' />
                )}
              </span>
            </div>
            <Legend
              legend={layer.legend}
              labels={id === 'crop_map' ? CROP_LABELS : HEALTH_LABELS}
            />
          </div>
        )
      })}
    </fieldset>
  )
}
