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
    // .domain([d3.min(censusData, d => d[xValue]), d3.max(censusData, d => d[xValue])])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d[yValue]))
    // .domain([d3.min(censusData, d => d[yValue]), d3.max(censusData, d => d[yValue])])
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

    // Add axis labels when page loads
    xAxisTexts = ["In Poverty (%)", "Age (Median)", "Household Income (Median)"];
    yAxisTexts = ["Lacks Healthcare(%)", "Smokes (%)", "Obese (%)"];

    var leftMargin = margin.left;
    var bottomMargin = height + margin.top;
    var counter = 0;
    
    // X Axis Labels
    var xPoverty = chartGroup.append("g")
        .append("text")
        .attr("transform", `translate(${width / 2}, ${bottomMargin + 12})`)
        .attr("class", "aText")
        .text("In Poverty (%)")
        .classed("labels", true)
        .classed("active", true);

    var xAge = chartGroup.append("g")
        .append("text")
        .attr("transform", `translate(${width / 2}, ${bottomMargin + 24})`)
        .attr("class", "aText")
        .text("Age (Median)")
        .classed("labels", true)
        .classed("inactive", true);

    var xIncome = chartGroup.append("g")
        .append("text")
        .attr("transform", `translate(${width / 2}, ${bottomMargin + 36})`)
        .attr("class", "aText")
        .text("Household Income (Median)")
        .classed("labels", true)
        .classed("inactive", true);

    // Y Axis Labels
    var yHealthcare = chartGroup.append("g")
        .append("text")   
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - leftMargin + 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)")
        .classed("labels", true)
        .classed("active", true);
    
    var ySmokes = chartGroup.append("g")
        .append("text")   
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - leftMargin + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Smokes (%)")
        .classed("labels", true)
        .classed("inactive", true);

    var yObese = chartGroup.append("g")
        .append("text")   
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - leftMargin + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Obese (%)")
        .classed("labels", true)
        .classed("inactive", true);



    ///////////////////////////////////
    // for(i=0; i<xAxisTexts.length; i++) {
        
    //     leftMargin -= 20;
    //     bottomMargin += 12;

    //     var yLabels = chartGroup.append("g")
    //     .append("text")   
    //     // .data(yAxisTexts)
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - leftMargin)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .attr("class", "aText")
    //     // Reverse the order for appending y labels because of the order of margins increments
    //     .text(yAxisTexts[(yAxisTexts.length-1) - i])
    //     .classed("labels", true)
    //     .classed("inactive", true);

        // var xLabels = chartGroup.append("g")
        // .append("text")
        // // .data(x)
        // .attr("transform", `translate(${width / 2}, ${bottomMargin})`)
        // .attr("class", "aText")
        // // .text("In Poverty(%)");
        // .text(xAxisTexts[i])
        // .classed("labels", true)
        // .classed("inactive", true);
        
    // };

    // Create Circles
    // ==============================
    function updatePlot(selection, xValue, yValue) {
        // console.log(selection);
        var circlesGroup = chartGroup.selectAll("circle").data(censusData);
        var textGroup = chartGroup.selectAll("text").data(censusData);
        var xLinearScale = d3.scaleLinear();
        var yLinearScale = d3.scaleLinear();

        // Update Axis
        // var xLinearScale = d3.scaleLinear()
        // .domain(d3.extent(censusData, d => d[xValue]))
        // // .domain([d3.min(censusData, d => d[xValue]), d3.max(censusData, d => d[xValue])])
        // .range([0, width]);

        // var yLinearScale = d3.scaleLinear()
        // .domain(d3.extent(censusData, d => d[yValue]))
        // // .domain([d3.min(censusData, d => d[yValue]), d3.max(censusData, d => d[yValue])])
        // .range([height, 0]);


        // Update Axis
        xLinearScale.domain(d3.extent(censusData, d => d[xValue]))
                    .range([0, width]);


        yLinearScale.domain(d3.extent(censusData, d => d[yValue]))
                    .range([height, 0]);

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
    };

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
        console.log(selection)

        if (selection === "In Poverty (%)" || selection === "Age (Median)" || selection === "Household Income (Median)") {
            if (selection === "In Poverty (%)") {
                xValue = "poverty";
                xPoverty
                    .classed("active", true)
                    .classed("inactive", false);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);

            }
            else if (selection === "Age (Median)") {
                xValue = "age";
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", true)
                    .classed("inactive", false);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (selection === "Household Income (Median)"){
                xValue = "income";
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
                xIncome
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }

        else if (selection === "Obese (%)" || selection === "Smokes (%)" || selection === "Lacks Healthcare (%)") {
            if (selection === "Obese (%)") {
                yValue = "obesity";
                
                yHealthcare
                    .classed("active", false)
                    .classed("inactive", true);
                ySmokes
                    .classed("active", false)
                    .classed("inactive", true);
                yObese
                    .classed("active", true)
                    .classed("inactive", false);

            }
            else if (selection === "Smokes (%)") {
                yValue = "smokes";

                yHealthcare
                    .classed("active", false)
                    .classed("inactive", true);
                ySmokes
                    .classed("active", true)
                    .classed("inactive", false);
                yObese
                    .classed("active", false)
                    .classed("inactive", true);

            }
            else if (selection === "Lacks Healthcare (%)"){
                yValue = "healthcare";

                yHealthcare
                    .classed("active", true)
                    .classed("inactive", false);
                ySmokes
                    .classed("active", false)
                    .classed("inactive", true);
                yObese
                    .classed("active", false)
                    .classed("inactive", true);

            }
        }
        // d3.select(this).classed("active", true);
        // d3.select(this).classed("inactive", false);
         
        // var selection = d3.select(this).text();
        updatePlot(selection, xValue, yValue);
    })

});