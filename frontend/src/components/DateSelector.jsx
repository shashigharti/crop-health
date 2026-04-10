import DatePicker from 'react-datepicker'
import { useStore } from '../store/useStore'

export default function DateSelector() {
  const { startDate, endDate, setDownloadData, setStartDate, setEndDate } = useStore()

  const handleStartDate = (date) => {
    setStartDate(date)
    setDownloadData(true)
  }

  const handleEndDate = (date) => {
    setEndDate(date)
    setDownloadData(true)
  }

  return (
    <div className='date-selector'>
      <label className='date-selector__field'>
        <span className='date-selector__label'>Start</span>
        <DatePicker
          selected={startDate}
          onChange={handleStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          todayButton='Today'
          placeholderText='Start date'
          popperProps={{ strategy: 'fixed' }}
          className='date-selector__input'
        />
      </label>
      <label className='date-selector__field'>
        <span className='date-selector__label'>End</span>
        <DatePicker
          selected={endDate}
          onChange={handleEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          todayButton='Today'
          placeholderText='End date'
          popperProps={{ strategy: 'fixed' }}
          className='date-selector__input'
        />
      </label>
    </div>
  )
}
