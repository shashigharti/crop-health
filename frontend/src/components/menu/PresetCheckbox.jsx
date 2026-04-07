import { useStore } from '../../store/useStore'
import { AOI_COLOR, FEATURE_COLOR } from '../../store/modules/common'

import { bboxToGeometry } from '../../utils/geo'

const PRESET_AOIS = [
  {
    id: 'coffee',
    name: 'Coffee',
    checked: true,
    color: AOI_COLOR,
    bbox: { north: -0.411017, south: -0.428983, east: 36.958983, west: 36.941017 },
    geometry: bboxToGeometry({
      north: -0.411017,
      south: -0.428983,
      east: 36.958983,
      west: 36.941017,
    }),
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    checked: true,
    color: AOI_COLOR,
    bbox: { north: 6.698983, south: 6.681017, east: -1.611017, west: -1.628983 },
    geometry: bboxToGeometry({
      north: 6.698983,
      south: 6.681017,
      east: -1.611017,
      west: -1.628983,
    }),
  },
  {
    id: 'other',
    name: 'Other',
    checked: true,
    color: AOI_COLOR,
    bbox: { north: -0.441017, south: -0.458983, east: 36.908983, west: 36.891017 },
    geometry: bboxToGeometry({
      north: -0.441017,
      south: -0.458983,
      east: 36.908983,
      west: 36.891017,
    }),
  },
]

const PRESET_FEATURE_POLYGONS = [
  {
    id: 'pf-coffee-1',
    name: 'Coffee Plot 1',
    crop: 'coffee',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.411915, south: -0.428085, east: 36.958085, west: 36.941915 },
    geometry: bboxToGeometry({
      north: -0.411915,
      south: -0.428085,
      east: 36.958085,
      west: 36.941915,
    }),
  },
  {
    id: 'pf-coffee-2',
    name: 'Coffee Plot 2',
    crop: 'coffee',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.412814, south: -0.427186, east: 36.957186, west: 36.942814 },
    geometry: bboxToGeometry({
      north: -0.412814,
      south: -0.427186,
      east: 36.957186,
      west: 36.942814,
    }),
  },
  {
    id: 'pf-coffee-3',
    name: 'Coffee Plot 3',
    crop: 'coffee',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.413712, south: -0.426288, east: 36.956288, west: 36.943712 },
    geometry: bboxToGeometry({
      north: -0.413712,
      south: -0.426288,
      east: 36.956288,
      west: 36.943712,
    }),
  },
  {
    id: 'pf-cocoa-1',
    name: 'Cocoa Plot 1',
    crop: 'cocoa',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: 6.698085, south: 6.681915, east: -1.611915, west: -1.628085 },
    geometry: bboxToGeometry({
      north: 6.698085,
      south: 6.681915,
      east: -1.611915,
      west: -1.628085,
    }),
  },
  {
    id: 'pf-cocoa-2',
    name: 'Cocoa Plot 2',
    crop: 'cocoa',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: 6.697186, south: 6.682814, east: -1.612814, west: -1.627186 },
    geometry: bboxToGeometry({
      north: 6.697186,
      south: 6.682814,
      east: -1.612814,
      west: -1.627186,
    }),
  },
  {
    id: 'pf-cocoa-3',
    name: 'Cocoa Plot 3',
    crop: 'cocoa',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: 6.696288, south: 6.683712, east: -1.613712, west: -1.626288 },
    geometry: bboxToGeometry({
      north: 6.696288,
      south: 6.683712,
      east: -1.613712,
      west: -1.626288,
    }),
  },
  {
    id: 'pf-other-1',
    name: 'Other Plot 1',
    crop: 'other',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.441915, south: -0.458085, east: 36.908085, west: 36.891915 },
    geometry: bboxToGeometry({
      north: -0.441915,
      south: -0.458085,
      east: 36.908085,
      west: 36.891915,
    }),
  },
  {
    id: 'pf-other-2',
    name: 'Other Plot 2',
    crop: 'other',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.442814, south: -0.457186, east: 36.907186, west: 36.892814 },
    geometry: bboxToGeometry({
      north: -0.442814,
      south: -0.457186,
      east: 36.907186,
      west: 36.892814,
    }),
  },
  {
    id: 'pf-other-3',
    name: 'Other Plot 3',
    crop: 'other',
    checked: true,
    color: FEATURE_COLOR,
    bbox: { north: -0.443712, south: -0.456288, east: 36.906288, west: 36.893712 },
    geometry: bboxToGeometry({
      north: -0.443712,
      south: -0.456288,
      east: 36.906288,
      west: 36.893712,
    }),
  },
]

const PRESET_TILE_URL =
  'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/18bb14f5b281f52f1253d04aa26e927e-4073e4976b65e0567302d6ed191d1604/tiles/{z}/{x}/{y}'

const GEOJSON = {
  type: 'FeatureCollection',
  columns: {
    area_ha: 'Number',
    count: 'Long<0, 4294967295>',
    crop: 'String',
    health: 'Integer',
    plot_id: 'Long',
    'system:index': 'String',
  },
  features: [
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.941239765790264, -0.4290353796954835],
            [36.94177875496074, -0.4290353796954835],
            [36.94177875496074, -0.4284963905250118],
            [36.941239765790264, -0.4284963905250118],
            [36.941239765790264, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68538-796',
      properties: {
        area_ha: 0.3591855381581372,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294368468532452,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94177875496074, -0.4290353796954835],
            [36.9423177441312, -0.4290353796954835],
            [36.9423177441312, -0.4284963905250118],
            [36.94177875496074, -0.4284963905250118],
            [36.94177875496074, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68539-796',
      properties: {
        area_ha: 0.35918553815289594,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294372763499748,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.9423177441312, -0.4290353796954835],
            [36.942856733301674, -0.4290353796954835],
            [36.942856733301674, -0.4284963905250118],
            [36.9423177441312, -0.4284963905250118],
            [36.9423177441312, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68540-796',
      properties: {
        area_ha: 0.35918553815655807,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294377058467044,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.942856733301674, -0.4290353796954835],
            [36.94339572247215, -0.4290353796954835],
            [36.94339572247215, -0.4284963905250118],
            [36.942856733301674, -0.4284963905250118],
            [36.942856733301674, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68541-796',
      properties: {
        area_ha: 0.35918553815681914,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294381353434340,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94339572247215, -0.4290353796954835],
            [36.94393471164262, -0.4290353796954835],
            [36.94393471164262, -0.4284963905250118],
            [36.94339572247215, -0.4284963905250118],
            [36.94339572247215, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68542-796',
      properties: {
        area_ha: 0.35918553815706145,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294385648401636,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94393471164262, -0.4290353796954835],
            [36.94447370081309, -0.4290353796954835],
            [36.94447370081309, -0.4284963905250118],
            [36.94393471164262, -0.4284963905250118],
            [36.94393471164262, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68543-796',
      properties: {
        area_ha: 0.3591855381568866,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294389943368932,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94447370081309, -0.4290353796954835],
            [36.945012689983564, -0.4290353796954835],
            [36.945012689983564, -0.4284963905250118],
            [36.94447370081309, -0.4284963905250118],
            [36.94447370081309, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68544-796',
      properties: {
        area_ha: 0.35918553815582943,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294394238336228,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.945012689983564, -0.4290353796954835],
            [36.945551679154036, -0.4290353796954835],
            [36.945551679154036, -0.4284963905250118],
            [36.945012689983564, -0.4284963905250118],
            [36.945012689983564, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68545-796',
      properties: {
        area_ha: 0.3591855381577431,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294398533303524,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.945551679154036, -0.4290353796954835],
            [36.94609066832451, -0.4290353796954835],
            [36.94609066832451, -0.4284963905250118],
            [36.945551679154036, -0.4284963905250118],
            [36.945551679154036, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68546-796',
      properties: {
        area_ha: 0.3591855381588234,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294402828270820,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94609066832451, -0.4290353796954835],
            [36.94662965749498, -0.4290353796954835],
            [36.94662965749498, -0.4284963905250118],
            [36.94609066832451, -0.4284963905250118],
            [36.94609066832451, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68547-796',
      properties: {
        area_ha: 0.359185538156473,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294407123238116,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94662965749498, -0.4290353796954835],
            [36.94716864666545, -0.4290353796954835],
            [36.94716864666545, -0.4284963905250118],
            [36.94662965749498, -0.4284963905250118],
            [36.94662965749498, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68548-796',
      properties: {
        area_ha: 0.35918553815623494,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294411418205412,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94716864666545, -0.4290353796954835],
            [36.947707635835926, -0.4290353796954835],
            [36.947707635835926, -0.4284963905250118],
            [36.94716864666545, -0.4284963905250118],
            [36.94716864666545, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68549-796',
      properties: {
        area_ha: 0.3591855381534551,
        count: 1,
        crop: 'coffee',
        health: 2,
        plot_id: 294415713172708,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.947707635835926, -0.4290353796954835],
            [36.94824662500639, -0.4290353796954835],
            [36.94824662500639, -0.4284963905250118],
            [36.947707635835926, -0.4284963905250118],
            [36.947707635835926, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68550-796',
      properties: {
        area_ha: 0.3591855381506753,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294420008140004,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94824662500639, -0.4290353796954835],
            [36.94878561417686, -0.4290353796954835],
            [36.94878561417686, -0.4284963905250118],
            [36.94824662500639, -0.4284963905250118],
            [36.94824662500639, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68551-796',
      properties: {
        area_ha: 0.3591855381584871,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294424303107300,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94878561417686, -0.4290353796954835],
            [36.949324603347335, -0.4290353796954835],
            [36.949324603347335, -0.4284963905250118],
            [36.94878561417686, -0.4284963905250118],
            [36.94878561417686, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68552-796',
      properties: {
        area_ha: 0.35918553815527776,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294428598074596,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.949324603347335, -0.4290353796954835],
            [36.94986359251781, -0.4290353796954835],
            [36.94986359251781, -0.4284963905250118],
            [36.949324603347335, -0.4284963905250118],
            [36.949324603347335, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68553-796',
      properties: {
        area_ha: 0.359185538157122,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294432893041892,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.94986359251781, -0.4290353796954835],
            [36.95040258168828, -0.4290353796954835],
            [36.95040258168828, -0.4284963905250118],
            [36.94986359251781, -0.4284963905250118],
            [36.94986359251781, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68554-796',
      properties: {
        area_ha: 0.35918553815429743,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294437188009188,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95040258168828, -0.4290353796954835],
            [36.95094157085875, -0.4290353796954835],
            [36.95094157085875, -0.4284963905250118],
            [36.95040258168828, -0.4284963905250118],
            [36.95040258168828, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68555-796',
      properties: {
        area_ha: 0.3591855381603805,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294441482976484,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95094157085875, -0.4290353796954835],
            [36.951480560029225, -0.4290353796954835],
            [36.951480560029225, -0.4284963905250118],
            [36.95094157085875, -0.4284963905250118],
            [36.95094157085875, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68556-796',
      properties: {
        area_ha: 0.3591855381592468,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294445777943780,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.951480560029225, -0.4290353796954835],
            [36.9520195491997, -0.4290353796954835],
            [36.9520195491997, -0.4284963905250118],
            [36.951480560029225, -0.4284963905250118],
            [36.951480560029225, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68557-796',
      properties: {
        area_ha: 0.3591855381559934,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294450072911076,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.9520195491997, -0.4290353796954835],
            [36.95255853837017, -0.4290353796954835],
            [36.95255853837017, -0.4284963905250118],
            [36.9520195491997, -0.4284963905250118],
            [36.9520195491997, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68558-796',
      properties: {
        area_ha: 0.3591855381518566,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294454367878372,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95255853837017, -0.4290353796954835],
            [36.95309752754064, -0.4290353796954835],
            [36.95309752754064, -0.4284963905250118],
            [36.95255853837017, -0.4284963905250118],
            [36.95255853837017, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68559-796',
      properties: {
        area_ha: 0.3591855381566086,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294458662845668,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95309752754064, -0.4290353796954835],
            [36.953636516711114, -0.4290353796954835],
            [36.953636516711114, -0.4284963905250118],
            [36.95309752754064, -0.4284963905250118],
            [36.95309752754064, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68560-796',
      properties: {
        area_ha: 0.3591855381579978,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294462957812964,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.953636516711114, -0.4290353796954835],
            [36.95417550588158, -0.4290353796954835],
            [36.95417550588158, -0.4284963905250118],
            [36.953636516711114, -0.4284963905250118],
            [36.953636516711114, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68561-796',
      properties: {
        area_ha: 0.3591855381551355,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294467252780260,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95417550588158, -0.4290353796954835],
            [36.95471449505205, -0.4290353796954835],
            [36.95471449505205, -0.4284963905250118],
            [36.95417550588158, -0.4284963905250118],
            [36.95417550588158, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68562-796',
      properties: {
        area_ha: 0.35918553815562243,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294471547747556,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95471449505205, -0.4290353796954835],
            [36.955253484222524, -0.4290353796954835],
            [36.955253484222524, -0.4284963905250118],
            [36.95471449505205, -0.4284963905250118],
            [36.95471449505205, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68563-796',
      properties: {
        area_ha: 0.35918553815951015,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294475842714852,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.955253484222524, -0.4290353796954835],
            [36.955792473393, -0.4290353796954835],
            [36.955792473393, -0.4284963905250118],
            [36.955253484222524, -0.4284963905250118],
            [36.955253484222524, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68564-796',
      properties: {
        area_ha: 0.3591855381544708,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294480137682148,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.955792473393, -0.4290353796954835],
            [36.95633146256347, -0.4290353796954835],
            [36.95633146256347, -0.4284963905250118],
            [36.955792473393, -0.4284963905250118],
            [36.955792473393, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68565-796',
      properties: {
        area_ha: 0.3591855381575002,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294484432649444,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95633146256347, -0.4290353796954835],
            [36.95687045173394, -0.4290353796954835],
            [36.95687045173394, -0.4284963905250118],
            [36.95633146256347, -0.4284963905250118],
            [36.95633146256347, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68566-796',
      properties: {
        area_ha: 0.3591855381541769,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294488727616740,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95687045173394, -0.4290353796954835],
            [36.957409440904414, -0.4290353796954835],
            [36.957409440904414, -0.4284963905250118],
            [36.95687045173394, -0.4284963905250118],
            [36.95687045173394, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68567-796',
      properties: {
        area_ha: 0.35918553816058113,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294493022584036,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.957409440904414, -0.4290353796954835],
            [36.957948430074886, -0.4290353796954835],
            [36.957948430074886, -0.4284963905250118],
            [36.957409440904414, -0.4284963905250118],
            [36.957409440904414, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68568-796',
      properties: {
        area_ha: 0.3591855381538389,
        count: 1,
        crop: 'coffee',
        health: 1,
        plot_id: 294497317551332,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.957948430074886, -0.4290353796954835],
            [36.95848741924536, -0.4290353796954835],
            [36.95848741924536, -0.4284963905250118],
            [36.957948430074886, -0.4284963905250118],
            [36.957948430074886, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68569-796',
      properties: {
        area_ha: 0.359185538158079,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294501612518628,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.941239765790264, -0.4284963905250118],
            [36.95902640841583, -0.4284963905250118],
            [36.95902640841583, -0.411248737069917],
            [36.941239765790264, -0.411248737069917],
            [36.941239765790264, -0.4284963905250118],
          ],
        ],
      },
      id: '1_+68570-764',
      properties: {
        area_ha: 379.3003659210338,
        count: 1056,
        crop: 'coffee',
        health: 0,
        plot_id: 294368468532453,
      },
    },
    {
      type: 'Feature',
      geometry: {
        geodesic: false,
        type: 'Polygon',
        coordinates: [
          [
            [36.95848741924536, -0.4290353796954835],
            [36.95902640841583, -0.4290353796954835],
            [36.95902640841583, -0.4284963905250118],
            [36.95848741924536, -0.4284963905250118],
            [36.95848741924536, -0.4290353796954835],
          ],
        ],
      },
      id: '1_+68570-796',
      properties: {
        area_ha: 0.3591855381551278,
        count: 1,
        crop: 'coffee',
        health: 0,
        plot_id: 294505907485924,
      },
    },
  ],
}

export default function PresetCheckbox() {
  const { aois, setAois, setPlotLayer, setFeaturePolygons } = useStore()

  const presetActive = PRESET_AOIS.every((p) => aois.some((a) => a.id === p.id))

  const handleChange = () => {
    if (presetActive) {
      setAois(aois.filter((a) => !PRESET_AOIS.some((p) => p.id === a.id)))
      setFeaturePolygons([])
      setPlotLayer('crop_map', { url: null, checked: false, label: 'Crop Classification' })
      setPlotLayer('plots', { geojson: null, checked: false, label: 'Plots' })
      return
    }

    const featureByClass = PRESET_FEATURE_POLYGONS.reduce((crop, feature) => {
      const key = feature.crop
      crop[key] = [...(crop[key] ?? []), feature]
      return crop
    }, {})

    setPlotLayer('crop_map', { url: PRESET_TILE_URL, checked: false, label: 'Crop Classification' })
    setPlotLayer('plots', { geojson: GEOJSON, checked: false, label: 'Plots' })
    setFeaturePolygons(featureByClass)
    setAois([...aois.filter((a) => !PRESET_AOIS.some((p) => p.id === a.id)), ...PRESET_AOIS])
  }

  return (
    <label className='preset-checkbox'>
      <input type='checkbox' checked={presetActive} onChange={handleChange} />
      <i className='bi bi-seedling' />
      <span>Use Preset</span>
    </label>
  )
}
