const osmToGeojson = require('osm-public-transport-export')
const fs = require('fs')
osmToGeojson({
    bounds: {
        south: -17.57727,
        west: -66.376555,
        north: -17.276198,
        east: -65.96397,
    },
    outputDir: __dirname + '/out',
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
        let out_file = `### Bolivia-Cochabamba
| Id | Name | Ref | From | To | State |
| -- | ---- | --- | ---- | -- | ----- |`
        data.log.forEach(element => {
            if (element.error_log) route_with_error++
            let error_log = element.error_log ? element.error_log.extractor_error ? `[${element.error_log.extractor_error}](${element.error_log.uri})` : element.error_log : "✅"
            out_file += `\n[${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${element.name} | ${element.ref} | ${element.from} | ${element.to} | ${error_log}`
        });
        // console.log(out_file)
        out_file = `### Count
**Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}

${out_file}`
        fs.writeFileSync("README.md", out_file)
    })
    .catch(error => console.error(error))