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

// Default Axis selection
var xValue = "poverty";
var yValue = "healthcare"

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
      });
    
    //   Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d[xValue]))
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d[yValue]))
    .range([height, 0]);

    // Add data //
    var circlesGroup = chartGroup.selectAll("circle").data(censusData);
    var textGroup = chartGroup.selectAll("div").data(censusData);

    // Create Circles
    circlesGroup.enter()
    .append("circle")
    .merge(circlesGroup)
    .transition()
    .duration(500)
    .attr("cx", d => xLinearScale(d[xValue]))
    .attr("cy", d => yLinearScale(d[yValue]))
    .attr("r", "10")
    .attr("class", "stateCircle");

    //Add Text to Circles
    textGroup.enter()
    .append("text")
    .merge(textGroup)
    .transition()
    .duration(500)
    .attr("x", d => xLinearScale(d[xValue]))
    .attr("y", d => yLinearScale(d[yValue]))
    .attr("class", "stateText")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "10")
    .text(d => d.abbr);

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

    
    // function filterData(selection) {
    //     // selection = d3.select(this).text()
    //     // selection = d3.select("g").selectAll(".labels").text()
    //     console.log(selection)
    //     if (selection === "In Poverty (%)") {
    //         console.log("Selection poverty % was made");
    //         // console.log(censusData.map(d => d.poverty));
    //         var result = censusData.map(d => d.poverty);
    //         console.log(result)
    //         return result
    //     }
    //     else if (selection === "Age (Median)") {
    //         // console.log("Selection age median was made");
    //         var result = censusData.map(d => d.age);
    //         return result
    //     }
    //     else if (selection === "Household Income (Median)") {
    //         // console.log("an unknown selection was made")
    //         var result = censusData.map(d => d.age);
    //         return result
    //     }
    // }

    // Create Circles
    // ==============================

    // Add axis labels when page loads
    xAxisTexts = ["In Poverty (%)", "Age (Median)", "Household Income (Median)"];
    yAxisTexts = ["Lacks Healthcare(%)", "Smokes (%)", "Obese (%)"];

    var leftMargin = margin.left;
    var bottomMargin = height + margin.top;
    var counter = 0;
    for(i=0; i<xAxisTexts.length; i++) {
        
        leftMargin -= 20;
        bottomMargin += 12;

        var yLabels = chartGroup.append("g")
        .append("text")   
        // .data(yAxisTexts)
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - leftMargin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        // Reverse the order for appending y labels because of the order of margins increments
        .text(yAxisTexts[(yAxisTexts.length-1) - i])
        .classed("labels", true)
        .classed("inactive", true);

        var xLabels = chartGroup.append("g")
        .append("text")
        // .data(x)
        .attr("transform", `translate(${width / 2}, ${bottomMargin})`)
        .attr("class", "aText")
        // .text("In Poverty(%)");
        .text(xAxisTexts[i])
        .classed("labels", true)
        .classed("inactive", true);


    function updatePlot(selection, xValue, yValue) {
        // if (!chartGroup.empty()) {
        //     chartGroup.remove();
        //   };
        // console.log(selection);
        var circlesGroup = chartGroup.selectAll("circle").data(censusData);
        var textGroup = chartGroup.selectAll("div").data(censusData);
        var xLinearScale = d3.scaleLinear();
        var yLinearScale = d3.scaleLinear();

        // Update Axis
        xLinearScale.domain(d3.extent(censusData, d => d[xValue]))
                    .range([0, width]);
        yLinearScale.domain(d3.extent(censusData, d => d[yValue]))
                    .range([height, 0])    

        // Create Circles
        circlesGroup.enter()
        .append("circle")
        // .merge(circlesGroup)
        .transition()
        .duration(500)
        .attr("cx", d => xLinearScale(d[xValue]))
        .attr("cy", d => yLinearScale(d[yValue]))
        .attr("r", "10")
        .attr("class", "stateCircle");

        //Add Text to Circles
        textGroup.enter()
        .append("text")
        // .merge(textGroup)
        .transition()
        .duration(500)
        .attr("x", d => xLinearScale(d[xValue]))
        .attr("y", d => yLinearScale(d[yValue]))
        .attr("class", "stateText")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", "10")
        .text(d => d.abbr);

        // Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
        chartGroup.append("g")
        .call(leftAxis);

        // axisLabels(xAxisTexts, yAxisTexts);
    }

    /////////////////////////////////


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
            .classed("inactive", true);
    
            chartGroup.append("g")
            .append("text")
            // .data(x)
            .attr("transform", `translate(${width / 2}, ${bottomMargin})`)
            .attr("class", "aText")
            // .text("In Poverty(%)");
            .text(x[i])
            .classed("labels", true)
            .classed("inactive", true);

            // console.log(chartGroup.selectAll(".aText").node())
        }
    }

    // axisLabels(xAxisTexts, yAxisTexts);
    // console.log(d3.selectAll(".inactive").html())

     d3.selectAll(".labels").on("click", function(d) {
        var selection = d3.select(this).text();
        // axisLabels(xAxisTexts, yAxisTexts);
        // var xValue;
        if (selection === "In Poverty (%)" || selection === "Age (Median)" || selection === "Household Income (Median)") {
            if (selection === "In Poverty (%)") {
                xValue = "poverty";
            }
            else if (selection === "Age (Median)") {
                xValue = "age";
            }
            else if (selection === "Household Income (Median)"){
                xValue = "income";
            }
        }

        else if (selection === "Obese (%)" || selection === "Smokes (%)" || selection === "Lacks Healthcare(%)") {
            if (selection === "Obese (%)") {
                yValue = "obesity";
            }
            else if (selection === "Smokes (%)") {
                yValue = "smokes";
            }
            else if (selection === "Lacks Healthcare(%)"){
                yValue = "healthcare";
            }
        }
        d3.select(this).classed("active", true);
        d3.select(this).classed("inactive", false);
         
        // var selection = d3.select(this).text();
        updatePlot(selection, xValue, yValue);
    })
}

});

