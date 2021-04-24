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
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
      });
    
    //   Create scale functions
    // ==============================
    // var nameid = `d.healthcare`
    // console.log(nameid)

    var xLinearScale = d3.scaleLinear()
    // .domain(d3.extent(censusData, d => d.healthcare))
    .domain(d3.extent(censusData, d => d.poverty))
    // d3.extent(medalData, d => d.date)
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => d.healthcare))
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

    //////////////////////////////////***************** */
    
    function filterData(selection) {
        // selection = d3.select(this).text()
        // selection = d3.select("g").selectAll(".labels").text()
        console.log(selection)
        if (selection === "In Poverty (%)") {
            console.log("Selection poverty % was made");
            // console.log(censusData.map(d => d.poverty));
            var result = censusData.map(d => d.poverty);
            console.log(result)
            return result
        }
        else if (selection === "Age (Median)") {
            // console.log("Selection age median was made");
            var result = censusData.map(d => d.age);
            return result
        }
        else if (selection === "Household Income (Median)") {
            // console.log("an unknown selection was made")
            var result = censusData.map(d => d.age);
            return result
        }
    }



    ///////////////////////////////****************/

    // Create Circles
    // ==============================
    function updatePlot(selection) {
        // var circlesGroup = chartGroup.selectAll("circle")
        // .data(censusData)
        // .enter()
        // .append("circle")
        // // .attr("cx", d => xLinearScale(d.healthcare))
        // .attr("cx", xLinearScale(filterData(selection)))
        // // .attr("cx", function(d) {
    
        // //     return xLinearScale(d.healthcare)
        // // })
        // .attr("cy", d => yLinearScale(d.poverty))
        // .attr("r", "10")
        // .attr("class", "stateCircle")
        // // .attr("fill", "pink")
        // .attr("opacity", ".5");

        // console.log(selection);
        var circlesGroup = chartGroup.selectAll("circle").data(censusData);
        var textGroup = chartGroup.selectAll("div").data(censusData);
        var xLinearScale = d3.scaleLinear().range([0, width]);
        var yLinearScale = d3.scaleLinear().range([height, 0]);

        if (selection === "In Poverty (%)" || selection === "Age (Median)" || selection === "Household Income (Median)") {
            if (selection === "In Poverty (%)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.poverty)) 
                yLinearScale.domain(d3.extent(censusData, d => d.healthcare))    
    
                // Create Circles
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
    
            }
            else if (selection === "Age (Median)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.age))
                yLinearScale.domain(d3.extent(censusData, d => d.healthcare))
                
                // Create Circles
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.age))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.age))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
            }
            else if (selection === "Household Income (Median)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.income));
                yLinearScale.domain(d3.extent(censusData, d => d.healthcare));
                
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.income))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.income))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
            }
        }

        else if (selection === "Obese (%)" || selection === "Smokes (%)" || selection === "Lacks Healthcare(%)") {
            if (selection === "Obese (%)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.poverty)) 
                yLinearScale.domain(d3.extent(censusData, d => d.obesity))    
    
                // Create Circles
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.obesity))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.obesity))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
    
            }
            else if (selection === "Smokes (%)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.age))
                yLinearScale.domain(d3.extent(censusData, d => d.smokes))
                
                // Create Circles
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.age))
                .attr("cy", d => yLinearScale(d.smokes))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.age))
                .attr("y", d => yLinearScale(d.smokes))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
            }
            else if (selection === "Lacks Healthcare(%)") {
                // Update Axis
                xLinearScale.domain(d3.extent(censusData, d => d.income));
                yLinearScale.domain(d3.extent(censusData, d => d.healthcare));
                
                circlesGroup.enter()
                .append("circle")
                .merge(circlesGroup)
                .transition()
                .duration(500)
                .attr("cx", d => xLinearScale(d.income))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", "10")
                .attr("class", "stateCircle");
    
                //Add Text to Circles
                textGroup.enter()
                .append("text")
                .merge(textGroup)
                .transition()
                .duration(500)
                .attr("x", d => xLinearScale(d.income))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("class", "stateText")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("font-size", "10")
                .text(d => d.abbr);
            }
        }
        
    
        // Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
        chartGroup.append("g")
        .call(leftAxis);
        
        // var textGroup = chartGroup.selectAll("div")
        // .data(censusData)
        // .enter()
        // .append("text")
        // .attr("x", d => xLinearScale(d.healthcare))
        // .attr("y", d => yLinearScale(d.poverty))
        // .attr("class", "stateText")
        // .attr("text-anchor", "middle")
        // .attr("alignment-baseline", "central")
        // .attr("font-size", "10")
        // .text(d => d.abbr)
        // // .attr("transform", "translate(0, 5)")
    }


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
            // .classed(function(d){
            //     // counter = 0;
            //     if (counter === 0) {
            //         console.log(`first Y: ${counter}`)
            //         counter += 1;
            //         console.log(`after first Y: ${counter}`)
            //         return active
            //     }
            //     else {
            //         counter += 1;
            //         return inactive
            //     }
            // }, true);
    
            chartGroup.append("g")
            .append("text")
            // .data(x)
            .attr("transform", `translate(${width / 2}, ${bottomMargin})`)
            .attr("class", "aText")
            // .text("In Poverty(%)");
            .text(x[i])
            .classed("labels", true)
            .classed("inactive", true);
            // .classed(function(d){
            //     // counter = 0;
            //     if (counter === 0) {
            //         console.log(`first X: ${counter}`)
            //         counter += 1;
            //         console.log(`After first X: ${counter}`)
            //         return active
            //     }
            //     else if (counter > 0) {
            //         counter += 1;
            //         return inactive
            //     }
            // }, true);
            // var counter =+ 1;
            console.log(chartGroup.selectAll(".aText").node())
        }
    }

    axisLabels(xAxisTexts, yAxisTexts);
    // console.log(d3.selectAll(".inactive").html())

    //////////////////////////////////
    // d3.selectAll(".labels").on("click", function(d) {
    //     console.log(d3.select(this).text())
    // })
    // d3.selectAll(".labels").on("click", updatePlot);

     d3.selectAll(".labels").on("click", function(d) {
        // axisLabels(xAxisTexts, yAxisTexts);
        d3.select(this).classed("active", true);
        d3.select(this).classed("inactive", false);
         
        var selection = d3.select(this).text();
        updatePlot(selection);
    })

    ////////////////////////////////

    // var xSelection = d3.selectAll(".labels");

    // xSelection.on("click",
});

