DUMMY_GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [36.941, -0.420], [36.945, -0.420],
                    [36.945, -0.425], [36.941, -0.425],
                    [36.941, -0.420],
                ]]
            },
            "properties": {"crop": "coffee", "health": 2, "area_ha": 1.5, "ndvi_mean": 0.72, "ndre_mean": 0.31, "plot_id": 1}
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [36.946, -0.421], [36.950, -0.421],
                    [36.950, -0.426], [36.946, -0.426],
                    [36.946, -0.421],
                ]]
            },
            "properties": {"crop": "coffee", "health": 1, "area_ha": 0.8, "ndvi_mean": 0.48, "ndre_mean": 0.15, "plot_id": 2}
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [36.951, -0.422], [36.955, -0.422],
                    [36.955, -0.427], [36.951, -0.427],
                    [36.951, -0.422],
                ]]
            },
            "properties": {"crop": "cocoa", "health": 0, "area_ha": 2.1, "ndvi_mean": 0.38, "ndre_mean": 0.08, "plot_id": 3}
        }
    ]
}