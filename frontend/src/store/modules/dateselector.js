const toDateOnly = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const today = toDateOnly(new Date())
const oneYearAgo = toDateOnly(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))

export const createDateSelector = (set) => ({
  startDate: oneYearAgo,
  endDate: today,

  setStartDate: (date) => set({ startDate: toDateOnly(date) }),
  setEndDate: (date) => set({ endDate: toDateOnly(date) }),
})
