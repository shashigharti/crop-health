export default function Hint({ message, html, style }) {
  return (
    <div className='crop-hint' style={{ marginBottom: '0.6rem', ...style }}>
      <i className='bi bi-info-circle crop-hint__icon' />
      {html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : <span>{message}</span>}
    </div>
  )
}
