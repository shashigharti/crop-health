export function generateAoiId() {
  const rand = Math.random().toString(36).substring(2, 6)
  return `newaoi-${rand}`
}

export const generateFeatureId = (cropId) => {
  const rand = Math.random().toString(36).substring(2, 6)
  return `pf-${cropId}-${rand}`
}

export const toSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
