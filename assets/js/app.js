var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Ajust plot location by setting some margins from svg area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
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
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
      });
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[xValue] * 0.97), d3.max(censusData, d => d[xValue])])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[yValue] * 0.89), d3.max(censusData, d => d[yValue])])
    .range([height, 0]);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[xValue]))
    .attr("cy", d => yLinearScale(d[yValue]))
    .attr("r", "10")
    .attr("class", "stateCircle");

    //Add Text to Circles
    var textGroup = chartGroup.selectAll("div")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[xValue]))
    .attr("y", d => yLinearScale(d[yValue]))
    .attr("class", "stateText")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "10")
    .text(d => d.abbr);

    //----------------------------------------------------//
    //  Update Tooltip function based on axis selection  //
    //--------------------------------------------------//
    function updateToolTip(xValue, yValue) {
        
        // Tool tip
        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
        return (`${d.state}<br>${xValue}: ${d[xValue]}<br>${yValue}: ${d[yValue]}`);
        });

        // circlesGroup.call(toolTip);
        textGroup.call(toolTip);
        
        // Used text group instead of circleGroup because it was easier than finding the circle lines
        textGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
            })
            // "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });

    }

    // Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .call(leftAxis);

    // Assigning margins values
    var leftMargin = margin.left;
    var bottomMargin = height + margin.top;
    
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
    
    // Initialize tooltips with default values
    updateToolTip(xValue, yValue);

    //--------------------------------------------------------//
    //  Function to update Plot based on user Axis selection  //
    //--------------------------------------------------------//
    function updatePlot(selection, xValue, yValue) {

        var circlesGroup = chartGroup.selectAll("circle").data(censusData);
        var textGroup = chartGroup.selectAll("text").data(censusData);

        // Update Axes
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[xValue] * 0.97), d3.max(censusData, d => d[xValue])])
        .range([0, width]);

        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[yValue] * 0.89), d3.max(censusData, d => d[yValue])])
        .range([height, 0]);
        
        // Create Axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Transition added to calling updated Axes
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
  
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);

        // Create Circles for Scatter Plot
        circlesGroup.enter()
        .append("circle")
        .merge(circlesGroup)
        .transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[xValue]))
        .attr("cy", d => yLinearScale(d[yValue]))
        .attr("r", "10")
        .attr("class", "stateCircle");

        //Add Text to Circles for Scatter Plot using state abbreviations
        textGroup.enter()
        .append("text")
        .merge(textGroup)
        .transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[xValue]))
        .attr("y", d => yLinearScale(d[yValue]))
        .attr("class", "stateText")
        .attr("font-size", "10")
        .text(d => d.abbr);

    };


    // Event listeners. On click update plot based on Axis selection
     d3.selectAll(".labels").on("click", function(d) {
        var selection = d3.select(this).text();
        // console.log(selection)

        // If X Axis was selected
        if (selection === "In Poverty (%)" || selection === "Age (Median)" || selection === "Household Income (Median)") {
            if (selection === "In Poverty (%)") {
                // Assign X Axis value to update plot
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

        // Else If Y Axis was selected
        else if (selection === "Obese (%)" || selection === "Smokes (%)" || selection === "Lacks Healthcare (%)") {
            // Assign Y Axis value to update plot
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

        // Update Plot with updated selected Axes values
        updatePlot(selection, xValue, yValue);

        // Update Tooltip with updated selected Axes values
        updateToolTip(xValue, yValue);
    })

});