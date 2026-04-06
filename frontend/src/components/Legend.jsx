export default function Legend({ legend, labels }) {
  return (
    <div className='legend'>
      {Object.entries(legend).map(([value, color]) => (
        <div key={value} className='legend__item'>
          <span className='legend__dot' style={{ background: color }} />
          <span className='legend__label'>{labels?.[value] ?? value}</span>
        </div>
      ))}
    </div>
  )
}
