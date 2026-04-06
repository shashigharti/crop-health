export const plotToAOI = ({ bbox: { north, south, east, west } }) => ({
  aoi: {
    type: 'Polygon',
    coordinates: [
      [
        [west, south], // bottom-left
        [east, south], // bottom-right
        [east, north], // top-right
        [west, north], // top-left
        [west, south], // close the ring
      ],
    ],
  },
})

export const bboxToGeoJSON = (aoi) => {
  const { north, south, east, west } = aoi.bbox
  return {
    type: 'Feature',
    properties: { id: aoi.id, name: aoi.name },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, north],
          [east, north],
          [east, south],
          [west, south],
          [west, north],
        ],
      ],
    },
  }
}

export const generateFeatureId = (cropId) => {
  const rand = Math.random().toString(36).substring(2, 6)
  return `pf-${cropId}-${rand}`
}
