var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
    
    //   Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.healthcare))
    // d3.extent(medalData, d => d.date)
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.poverty))
    .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale( d.poverty))
    .attr("r", "10")
    .attr("class", "stateCircle")
    // .attr("fill", "pink")
    .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll("div")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale( d.poverty))
    .attr("class", "stateText")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "10")
    .text(d => d.abbr)
    // .attr("transform", "translate(0, 5)")

    /////////////////////////////////
    xAxisTexts = ["In Poverty (%)", "Age (Median)", "Household Income (Median)"];
    yAxisTexts = ["Lacks Healthcare(%)", "Smokes (%)", "Obese (%)"];

    function axisLabels(x, y) {
        var leftMargin = margin.left;
        var bottomMargin = height + margin.top;
        var counter = 0;
        for(i=0; i<x.length; i++) {
            // console.log(i);
            
            leftMargin -= 20;
            bottomMargin += 12;
            // console.log(`left: ${leftMargin} & right: ${bottomMargin}`)

            chartGroup.append("g")
            .append("text")   
            // .data(yAxisTexts)
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - leftMargin)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "aText")
            // Reverse the order for appending y labels because of the order of margins increments
            .text(y[(y.length-1) - i])
            .classed("labels", true)
            .classed(function(d){
                // counter = 0;
                if (counter === 0) {
                    console.log(`first Y: ${counter}`)
                    counter += 1;
                    console.log(`after first Y: ${counter}`)
                    return active
                }
                else {
                    counter += 1;
                    return inactive
                }
            }, true);
    
            chartGroup.append("g")
            .append("text")
            // .data(x)
            .attr("transform", `translate(${width / 2}, ${bottomMargin})`)
            .attr("class", "aText")
            // .text("In Poverty(%)");
            .text(x[i])
            .classed("labels", true)
            .classed(function(d){
                // counter = 0;
                if (counter === 0) {
                    console.log(`first X: ${counter}`)
                    counter += 1;
                    console.log(`After first X: ${counter}`)
                    return active
                }
                else if (counter > 0) {
                    counter += 1;
                    return inactive
                }
            }, true);
            var counter =+ 1;
        }
    }

    axisLabels(xAxisTexts, yAxisTexts);

    //////////////////////////////////
    d3.selectAll(".labels").on("click", function(d) {
        console.log(d3.select(this).text())
    })
    ////////////////////////////////
});

