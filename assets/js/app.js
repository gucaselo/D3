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

    // Add data
    // var circlesGroup = chartGroup.selectAll("circle").data(censusData);
    // var textGroup = chartGroup.selectAll("div").data(censusData);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    // circlesGroup.enter()
    .append("circle")
    // .merge(circlesGroup)
    // .transition()
    // .duration(1000)
    .attr("cx", d => xLinearScale(d[xValue]))
    .attr("cy", d => yLinearScale(d[yValue]))
    .attr("r", "10")
    .attr("class", "stateCircle");

    //Add Text to Circles
    var textGroup = chartGroup.selectAll("div")
    .data(censusData)
    .enter()
    // textGroup.enter()
    .append("text")
    // .merge(textGroup)
    // .transition()
    // .duration(1000)
    .attr("x", d => xLinearScale(d[xValue]))
    .attr("y", d => yLinearScale(d[yValue]))
    .attr("class", "stateText")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .attr("font-size", "10")
    .text(d => d.abbr);

    function updateToolTip(xValue, yValue) {
        // Tool tip
        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .html(function(d) {
        return (`${d.state}<br>${xValue}: ${d[xValue]}<br>${yValue}: ${d[yValue]}`);
        });

        circlesGroup.call(toolTip);
        textGroup.call(toolTip);

        // circlesGroup.on("mouseover", function(d) {
        //     toolTip.show(d, this);
        //   })
        //   // Step 4: Create "mouseout" event listener to hide tooltip
        //     .on("mouseout", function(d) {
        //       toolTip.hide(d);
        //     });
        
        textGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });

    }

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
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
    
    // Initialize tooltips with default values
    updateToolTip(xValue, yValue);

    // Create Circles
    function updatePlot(selection, xValue, yValue) {
        // console.log(selection);
        var circlesGroup = chartGroup.selectAll("circle").data(censusData);
        var textGroup = chartGroup.selectAll("text").data(censusData);

        // Update Axis
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[xValue] * 0.97), d3.max(censusData, d => d[xValue])])
        .range([0, width]);

        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[yValue] * 0.89), d3.max(censusData, d => d[yValue])])
        .range([height, 0]);
        
        // Create axis
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
  
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);

        // Create Circles
        circlesGroup.enter()
        .append("circle")
        .merge(circlesGroup)
        .transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[xValue]))
        .attr("cy", d => yLinearScale(d[yValue]))
        .attr("r", "10")
        .attr("class", "stateCircle");

        //Add Text to Circles
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

    // Tool tip function
    // function updateToolTip() {

    //     // var label;
      
    //     // if (chosenXAxis === "hair_length") {
    //     //   label = "Hair Length:";
    //     // }
    //     // else {
    //     //   label = "# of Albums:";
    //     // }
      
    //     var toolTip = d3.tip()
    //       .attr("class", "d3-tip")
    //       .offset([80, -60])
    //       .html(function(d) {
    //         return (`${d.state}`);
    //       });
      
    //     circlesGroup.call(toolTip);
      
    //     circlesGroup.on("mouseover", function(data) {
    //       toolTip.show(data);
    //     })
    //       // onmouseout event
    //       .on("mouseout", function(data, index) {
    //         toolTip.hide(data);
    //       });
      
    //     return circlesGroup;
    //   }
    
    // updateToolTip
    // updateToolTip(xValue, yValue);

     d3.selectAll(".labels").on("click", function(d) {
        var selection = d3.select(this).text();
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

        updatePlot(selection, xValue, yValue);
        updateToolTip(xValue, yValue);
    })

    // // Tool tip
    // d3.selectAll("circle").on("mouseover", function(d) {
    //     var selected = d3.select(this).text();
    //     console.log(selected);


    // });

});