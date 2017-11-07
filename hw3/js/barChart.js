/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    clearBarcharts() {
        d3.select("svg")
            .selectAll(".barGroup")
            .remove()
        d3.selectAll('.axis')
            .remove()
    }
    updateBarChart(selectedDimension) {
        // ******* TODO: PART I *******
        // Create the x and y scales; make
        // sure to leave room for the axes
        var svgHeight = d3.select("#barChart").attr("height")
        var svgWidth = d3.select("#barChart").attr("width")
        var x0 = 40
        var y0 = svgHeight - 100
        var xOffset = 20

        var maxBarHeight = y0

        var years = this.allData.map(function(row) {
                return row["YEAR"]
            })
        var maxValue = Math.max.apply(null,
            this.allData.map(function(row) {
                return row[selectedDimension]
            })
        )

        // Create colorScale
        function getBarHeight(row) {
            return row[selectedDimension] * maxBarHeight / maxValue
        }

        var minLight = 20
        var maxLight = 56
        var colorScale = d3.scaleLinear()
            .domain([0, maxBarHeight])
            .range([maxLight, minLight])

        function getColor(row) {
            var light = colorScale(getBarHeight(row))
            return "hsl(209,99%," + light + "%)";
        }

        // Create the axes (hint: use #xAxis and #yAxis)
        var rowWidth = 20
        var barWidth = 17

        var margin = {top: 0, right: 0, bottom: svgHeight - y0, left: x0 + xOffset},
            width = rowWidth * this.allData.length, //svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .domain(this.allData.map(function(d) { return d["YEAR"]; }))

        var y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

        d3.select("#barChart").select("#xAxis").append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.4em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        d3.select("#barChart").select("#yAxis").append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(d3.axisLeft(y));

        // Create the bars (hint: use #bars)

        var barGroupsEnter = d3.select("#barChart").select("#bars")
            .selectAll("g.barGroup")
            .data(this.allData).enter()
            .append("g")
            .classed("barGroup", true);

        barGroupsEnter.append("rect")
            .attr("width", barWidth)
            .style("fill", getColor)
            .attr('stroke', '#2378ae')

        barGroupsEnter.attr("transform", function (d, i) {
            return "translate(" + (i * rowWidth) + ", " + (y0 - getBarHeight(d)) + ")";
        })

        var y = d3.scaleLinear()
            .domain([0, maxBarHeight])
            .range([maxBarHeight, 0])

        barGroupsEnter.selectAll("rect")
            .attr("height", function (d) { return getBarHeight(d); })
            .attr("x", x0 + xOffset)


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

        var infoPanel = this.infoPanel
        var worldMap = this.worldMap
        function updatePage(row) {
            infoPanel.updateInfo(row)
            worldMap.updateMap(row)
        }

        var toggleBarColor = (function() {
            var prevBar = null
            var prevColor = null

            return function() {
                var curBar = d3.select(this)
                var data = curBar.data()[0]
                if (prevBar != curBar && prevBar != null) {
                    prevBar.style("fill", prevColor)
                }

                curBar.style("fill", "red")
                prevBar = curBar
                prevColor = getColor(data)
                updatePage(data)
            }
        })();


        barGroupsEnter.selectAll("rect")
            .on("click", toggleBarColor)

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(selectedDimension) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.clearBarcharts()
        this.updateBarChart(selectedDimension)
    }
}