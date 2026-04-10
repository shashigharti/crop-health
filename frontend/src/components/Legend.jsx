export default function Legend({ legend, labels }) {
  const isGradient = labels && Object.keys(labels).length > 0

  if (isGradient) {
    return (
      <div className='legend'>
        <div className='legend__row'>
          {Object.entries(labels)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([key, value], index) => (
              <div key={key} className='legend__item'>
                <span className='legend__dot' style={{ background: legend[index] }} />
                <span className='legend__label'>{value}</span>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className='legend'>
      <div className='legend__row'>
        {legend.map(({ name, wavelength_nm }, index) => (
          <div key={index} className='legend__item'>
            <span className='legend__dot' style={{ background: ['red', 'green', 'blue'][index] }} />
            <span className='legend__label'>
              {name} ({wavelength_nm}nm)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
