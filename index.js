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
        let out_file = `### Cochabamba
| State | Id | Name | Ref | From | To |
| ----- | -- | ---- | --- | ---- | -- |`
        data.log.forEach(element => {
            let error_log = element.error_log ? element.error_log.extractor_error ? `[<font color='red'>${element.error_log.extractor_error}</font>](${element.error_log.uri})` : element.error_log : "✅"
            out_file += `\n${error_log} | [${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${element.name} | ${element.ref} | ${element.from} | ${element.to}`
        });
        // console.log(out_file)
        fs.writeFileSync("README.md", out_file)
    })
    .catch(error => console.error(error))