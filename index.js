const osmToGeojson = require('osm-public-transport-export')
const fs = require('fs')
const cities = require("./cities")
let osmAllDowloader = (name, bounds) =>
    osmToGeojson({
        bounds: bounds,
        // outputDir: __dirname + `/${outputDir}`,
        mapProperties: (tags) => ({
            ...tags,
            stroke: '#164154',
            "stroke-width": 5,
        }),
        stopNameSeparator: ' y ',
        stopNameFallback: 'innominada',
    })
        .then(data => {
            let route_with_error = 0
            let out_file
            data.log.forEach(element => {
                if (element.error) route_with_error++
            });
            out_file = `### ${name} =>   **Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}`
            return out_file

        })
        .catch(error => console.error(error))
async function main() {
    let out_log = ""
    for (let city of cities) {
        out_log += await osmAllDowloader(city.name, city.bounds)
    }
    console.log(out_log)
}
main().catch(console.log)