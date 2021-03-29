
let graph_3_width = MAX_WIDTH, graph_3_height = 250;

// create svg object


  let inital_attr = "Role-Playing"

  let barplot_2 = d3.select("#graph2")
      .append("svg")
      .attr("width", graph_3_width - margin.left - margin.right)
      .attr("height", graph_3_height - 30)
      .append("g")
      .attr("transform",`translate(${margin.left + 20},${45})`);

// reading the data in
function presentData(genre_input){

  let tooltip = d3.select("#graph2")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  d3.csv("../data/video_games.csv").then(function(data) {


      let genre = genre_input

      data = filterData(data, genre);

      let nestedData = d3.nest()
          .key(function(d) {return d.Publisher})
          .entries(data);
          console.log(nestedData);
      var publisher_sales = []
      var x_domain = []
      nestedData.forEach(sum_publisher_sales)
      function sum_publisher_sales(publisher_dict){
        games = Object.values(publisher_dict)[1]
        sales_count = 0
        games.forEach(function(d){
          sales_count += parseFloat(d.Global_Sales)})
        let element = {Pub: Object.values(publisher_dict)[0], total_pub_sales: sales_count}
        let d = Object.values(publisher_dict)[0]
        publisher_sales.push(element)
        x_domain.push(d)}

       // TODO: Create a time scale for the x axis
       let x = d3.scaleBand()
           .domain(x_domain)
           .range([0, graph_3_width - margin.left - margin.right]);

       // TODO: Add x-axis label
       barplot_2.append("g")
           .attr("transform", `translate(0, ${graph_3_width - margin.top - margin.bottom})`)       // HINT: Position this at the bottom of the graph. Make the x shift 0 and the y shift the height (adjusting for the margin)
           .call(d3.axisBottom(x))
           .style("text-anchor", "middle")
           .text("Publishers")
           .attr("class", "title");

       // TODO: Create a linear scale for the y axis
       let y = d3.scaleLinear()
           .domain([0, d3.max(publisher_sales, function(d) {return parseInt(d.total_pub_sales);}) + 10])
           .range([graph_3_height - margin.top - margin.bottom, 0]);

       // TODO: Add y-axis label
       barplot_2.append("g")
          .call(d3.axisLeft(y));

      y_axis_text = barplot_2.append("text")
        .attr("transform",`translate(${0},${-10})`)
        .style("text-anchor", "middle")
        .text("Publisher's Global Sales (In Millions)")
        .style("font-size","10px");

       // OPTIONAL: Adding color
       let color = d3.scaleOrdinal()
           .domain(x_domain)
           .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#ff5c7a"), x_domain.length));
       // tooltip stuff
       let mouseover = function(d) {
           let html = `<br/>${d.Pub}<br/>
                   <br>Total Publisher Sales:${d.total_pub_sales}</br>`;       // HINT: Display the song here

           // Show the tooltip and set the position relative to the event X and Y location
           tooltip.html(html)
               .style("left", `${(d3.event.pageX) -75 }px`)
               .style("top", `${(d3.event.pageY) -75}px`)
               .transition()
               .duration(200)
               .style("opacity", 0.9)};

       // Mouseout function to hide the tool on exit
       let mouseout = function(d) {
           // Set opacity back to 0 to hide
           tooltip.transition()
               .duration(200)
               .style("opacity", 0);};

        let bars = barplot_2.selectAll("rect").data(publisher_sales);
        // adding the bars on the barplot
        bars.enter().append("rect")
                .merge(bars)
                // .transition()
                // .duration(1000)
                // .attr("y", y(0))
                .attr("class", "onenode")
                .attr("x", function(d) {return x(d.Pub);})
                .attr("width", x.bandwidth())
                // .attr("height", function(d) {return y(parseInt(d.total_pub_sales)); });
                .attr('y', function(d) {return y(d.total_pub_sales);})
                .attr('height', function(d){ return graph_3_height - y(d.total_pub_sales) - margin.bottom - margin.top;})
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .attr("fill", function(d) { return color(d.Pub) });

       // Add chart title
       barplot_2.append("text")
           .attr("transform", `translate(250, ${-20})`)
           .style("text-anchor", "middle")
           .style("font-size", 15)
           .text(`${genre} Top Publishers`)
           .attr("class", "title");  });}

function filterData(data, genre) {
  return data.filter(function(a) { return a.Genre === (genre); });}
  function setAttr() {
    barplot_2.selectAll('*').remove();
    barplot_2
      .append("svg")
      .attr("width", graph_3_width - margin.left - margin.right)
      .attr("height", graph_3_height - 30)
      .append("g")
      .attr("transform",`translate(${margin.left + 20},${45})`);
    console.log("before jpdate: " + inital_attr);
    inital_attr = document.getElementById("attrInput").value;
    console.log("after jpdate: " + inital_attr);
    updateDashboard()}

  function updateDashboard() {
    d3.selectAll("onenode").remove();
    d3.selectAll("title").remove();
    presentData(inital_attr);}

presentData(inital_attr)
