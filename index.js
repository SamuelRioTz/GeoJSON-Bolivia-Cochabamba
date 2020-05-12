const osmToGeojson = require('osm-public-transport-export')
const fs = require('fs')
osmToGeojson({
    "bounds": {
        "north": -18.746312,
        "west": 47.410204,
        "south": -19.020805,
        "east": 47.609331
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
        let out_file = `### Antananarivo
| Id | Name | Ref | From | To | State |
| -- | ---- | --- | ---- | -- | ----- |`
        data.log.forEach(element => {
            let tags = element.tags
            if (element.error) route_with_error++
            let state = element.error ? element.error.extractor_error ? `[${element.error.extractor_error}](${element.error.uri})` : element.error : "✅"
            out_file += `\n[${element.id}](https://www.openstreetmap.org/relation/${element.id}) | ${tags.name} | ${tags.ref} | ${tags.from} | ${tags.to} | ${state}`
        });
        // console.log(out_file)
        out_file = `### Count
**Total**: ${data.log.length}  **Correct**: ${data.log.length - route_with_error}  **With error**: ${route_with_error}

${out_file}`
        fs.writeFileSync("README.md", out_file)
    })
    .catch(error => console.error(error))