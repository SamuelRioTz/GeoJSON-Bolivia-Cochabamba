const osmToGeojson = require("osm-public-transport-export");
const geojsonBuilder = () =>
  osmToGeojson({
    bounds: {
      south: 17.958761,
      west: -16.025151,
      north: 18.192123,
      east: -15.874505,
    },
    outputDir: __dirname + "/../out",
    mapProperties: (tags) => ({
      ...tags,
      stroke: "#164154",
      "stroke-width": 5,
    }),
    stopNameSeparator: " y ",
    stopNameFallback: "innominada",
  });

module.exports = geojsonBuilder;
