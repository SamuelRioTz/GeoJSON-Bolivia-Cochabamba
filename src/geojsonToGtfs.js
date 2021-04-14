const geojsonToGtfs = require("geojson-to-gtfs");
const path = require('path');
const loadCsv = require('csv-load-sync');
const routesInfo = loadCsv(path.join(__dirname, '/../definitions', 'routes-info.csv'));
const carTypes = loadCsv(path.join(__dirname, '/../definitions', 'car-types.csv'));
const stops = require("./../out/stops.json");

function exportGtfs(outputPath) {
  // Lookup maps
  const lineLookup = new WeakMap();
  const lineToType = {};
  const lineToAgency = {};
  const lineToSpeed = {};
  const lineToColor = {};
  routesInfo.forEach((info) => {
    const carType = carTypes.find((car) => car.type === info.type);

    lineToType[info.name] = info.type;
    lineToAgency[info.name] = info.agency;
    lineToSpeed[info.name] = carType.speed;
    lineToColor[info.name] = carType.color;
  });
  const agencyNameToId = {};
  let agencyId = 1;


  const gtfsConfig = (stopMapping) => ({
    prepareGeojsonFeature: (feature) => {
      const line = getLineFromProperties(feature.properties);
      lineLookup.set(feature, line);
    },
    agencyId: (feature) => {
      const line = lineLookup.get(feature);
      const name = lineToAgency[line];
      let id = agencyNameToId[name];

      if (id) {
        return id;
      }

      id = agencyId++;

      if (name) {
        agencyNameToId[name] = id;
      }

      return id;
    },
    agencyName: (feature) => {
      const line = lineLookup.get(feature);
      const name = lineToAgency[line] || "UNNAMED";

      return name;
    },
    agencyUrl: "https://www.trufi.app",
    stopName: (coords, coordsIndex, feature) => {
      const nodeId = feature.geometry.nodes[coordsIndex];
      return stopMapping[nodeId];
    },
    routeShortName: (feature) => lineLookup.get(feature),
    routeLongName: (feature) => {
      const line = lineLookup.get(feature);
      const type = lineToType[line];
      const description = getRouteNameFromProperties(feature.properties);

      return `${description} (${type})`;
    },
    routeColor: (feature) => {
      const line = lineLookup.get(feature);
      const color = lineToColor[line] || "000000";

      return color;
    },
    vehicleSpeed: (feature) => {
      const line = lineLookup.get(feature);
      const speed = lineToSpeed[line] || 25;

      return speed;
    },
  });
  geojsonToGtfs(
    __dirname + "/../out/routes.geojson",
    __dirname + "/../out/gtfs.zip",
    gtfsConfig(stops)
  );
}

function getLineFromProperties(properties) {
  const lineCandidate = properties.ref || properties.name;

  return (
    lineCandidate
      // Only use text before the colon
      .split(":", 2)[0]
      // Remove car type
      .replace(/(?:Bus|Minibus|Microbus|Trufi)/gi, "")
      // Remove surrounding space
      .trim()
      // Remove everything but the last word
      .replace(/^(?:.+\s)+/, "")
  );
}

function getRouteNameFromProperties(properties) {
  return (
    properties.name
      // Remove everything before the colon
      .substr(properties.name.indexOf(":") + 1)
      // Remove surrounding space
      .trim()
  );
}
exportGtfs();
