import { useStore } from '../store/useStore'

export default function HelpPanel() {
  const { userMessage } = useStore()

  return (
    <div className='help-panel'>
      <i className='bi bi-info-circle help-panel__icon' />
      <span className='help-panel__mode'>{userMessage}</span>
    </div>
  )
}
