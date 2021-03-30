//map
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 450;
let map = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .attr("transform",`translate(${10},20)`);

//paths
var input = d3.geoMercator()
    .scale(graph_2_width / 2 / Math.PI)
    .translate([graph_2_width / 2, graph_2_height / 2]);
var path = d3.geoPath().projection(input);
var g = map.append("g");

// create country names, publisher, id object
const names = [];
d3.csv("hw6-dataviz-noah14noah/data/genres_preprocessed.csv").then(function(data) {
    data.forEach(function(d) {
        let element = {id: d.country_id, name: d.Name, genre: d.Genre};
        names.push(element);
    });
})
let title_2 = map.append("text")
    .attr("transform",`translate(100,20)`)
    .style("text-anchor","center")
    .style("font-size",15)
    .text("Top Genre by Region");

//loading map data
d3.json("hw6-dataviz-noah14noah/data/world-110m2.json").then(function(topology) {
    g.selectAll("path")
        .data(topojson.feature(topology,topology.objects.countries).features)
        .enter().append("path")
        .attr("class","country")
        .attr("fill", "#8974E4")
        .attr("d",path)
        .append("title")
            .text(function(d) {
                function checkID(k) { return k.id == d.id }
                const country = names.find(checkID)
                // console.log(countryObj)
                return "Country: " + country['name']+", Top Genre (By Region): "+country['genre']; //janky "tooltip, include tooltip for vertical graph"
            })
});
