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
            out_file = ` ${name} \nTotal: ${data.log.length}\tCorrect: ${data.log.length - route_with_error}\tWith error: ${route_with_error}\n`
            return out_file

        })
        .catch(error => console.error(error))
async function main() {
    let out_log = ""
    for (let city of cities) {
        console.time(city.name)
        out_log += await osmAllDowloader(city.name, city.bounds)
        console.timeEnd(city.name)
    }
    fs.writeFileSync("output.txt", out_log)
}
main().catch(console.log)