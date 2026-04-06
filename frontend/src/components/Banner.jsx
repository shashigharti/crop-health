import { useStore } from '../store/useStore'

export default function Banner() {
  const { steps, stepsComplete } = useStore()

  return (
    <div className='banner'>
      <div className='banner__how-to'>
        {steps.map((text, i) => (
          <div key={i} className={`banner__step}`}>
            <div className={`banner__step-num ${stepsComplete[i] ? 'banner__step--done' : ''}`}>
              {stepsComplete[i] ? <i className='bi bi-check-circle' /> : i + 1}
            </div>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
