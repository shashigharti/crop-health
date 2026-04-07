export const plotToAOI = ({ geometry: { north, south, east, west } }) => ({
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

export const bboxToGeometry = ({ north, south, east, west }) => ({
  type: 'Polygon',
  coordinates: [
    [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
      [west, south],
    ],
  ],
})
