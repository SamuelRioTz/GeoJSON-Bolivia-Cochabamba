const osmToGeojson = require('osm-public-transport-export')
const fs = require('fs')
let osmAllDowloader = (name, bounds) =>
    osmToGeojson({
        bounds: {
            south: -17.57727,
            west: -66.376555,
            north: -17.276198,
            east: -65.96397,
        },
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
            out_file += `### ${name} =>   **Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}`

            // fs.writeFileSync(`${name}.md`, out_file)
            return out_file

        })
        .catch(error => console.error(error))

osmAllDowloader("Cochabamba", 'cochabamba').then(response => {
    // fs.writeFileSync(response)
})