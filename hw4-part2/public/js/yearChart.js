
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, multipleYearsTileChart, votePercentageChart, electionWinners, yearsShiftChart)
    {
        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.multipleYearsTileChart = multipleYearsTileChart
        this.votePercentageChart = votePercentageChart;
        this.yearsShiftChart = yearsShiftChart
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

       // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

        var curClass = this

        var minYear = this.electionWinners.reduce(function(min, current) {
            return Math.min(min, current.YEAR);
        }, 3000);
        var maxYear = this.electionWinners.reduce(function(max, current) {
            return Math.max(max, current.YEAR);
        }, 0);

        var svgWidth = this.svgWidth
        var svg = this.svg
        var electoralVoteChart = this.electoralVoteChart
        var votePercentageChart = this.votePercentageChart
        var tileChart = this.tileChart
        var multipleYearsTileChart = this.multipleYearsTileChart
        var colorScale = this.colorScale
        var electionWinners = this.electionWinners

        var lastData = null

        function onCircleClick(d, i) {
            var el = d3.select(this)
            svg.selectAll("circle").attr("class", function(d, i) {
                return d3.select(this).attr("class").replace(/ selected/g, '')
            })
            el.attr("class", function(d, i) {
                return el.attr("class") + " selected"
            })

            var fileName = "year_timeline_" + d.YEAR + ".csv"
            d3.csv("data/" + fileName, function (error, data) {
                lastData = data
                electoralVoteChart.update(data, colorScale)
                votePercentageChart.update(data)
                tileChart.update(data, colorScale)
            })
        };
        function onCircleMouseOver(d, i) {
            var el = d3.select(this)
            svg.selectAll("circle").attr("class", function(d, i) {
                return d3.select(this).attr("class").replace(/ highlighted/g, '')
            })
            el.attr("class", function(d, i) {
                return el.attr("class") + " highlighted"
            })
        };

        var r = 20

        this.svg.append("line")
            .attr("x1", 0)
            .attr("y1", r * 2)
            .attr("x2", this.svgWidth)
            .attr("y2", r * 2)
            .attr("class", "lineChart")

        this.svg.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", r * 4)
            .attr("stroke-width", 3)
            .attr("stroke", "#404040")

        var nodes = this.svg.selectAll("g")
            .data(this.electionWinners)
        var nodesEnter = nodes
            .enter()
            .append("g")
            .attr("class", "node")

        this.svg.selectAll("g")
            .attr("transform", function(d, i) {
                var x = r * 2 + (svgWidth - r * 4) * (d.YEAR - minYear) / (maxYear - minYear)
                var y = r * 2
                if (electionWinners[i]) {
                    electionWinners[i].x = x
                }
                return "translate(" + x + "," + y + ")"; 
            });

        nodesEnter.append("circle")
            .attr("class", function(d, i) {
                return curClass.chooseClass(d.PARTY)
            })
            .attr("r", function(d, i) { return r })
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "white")
            .on("click", onCircleClick)
            .on("mouseover", onCircleMouseOver)

        nodesEnter
            .append("text")
            .attr("class", "yeartext")
            .text(function(d, i) {
                return d.YEAR
            })

        nodesEnter.selectAll("text")
            .attr("y", function(d, i) {
                var height = d3.select(this).node().getBBox().height
                return r + height
            })

        nodesEnter.selectAll("text")
            .attr("x", function(d, i) {
                var width = d3.select(this).node().getBBox().width
                if (width < 50) {
                    width = 82
                }
                return 2 * r - width / 2
            })


    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of art and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

        var yearsShiftChart = this.yearsShiftChart
        function brushed(d) {
            var s = d3.event.selection;
            if (s == null) {
                yearsShiftChart.update([])
                return
            }

            var x0 = s[0]
            var xMax = s[1]

            var selectedYears = []
            electionWinners.forEach((row)=>{
                if (row.x + r > x0 && row.x - r <= xMax) {
                    selectedYears.push(row)
                }
            });
            yearsShiftChart.update(selectedYears)

            var count = 0
            var yearsData = []

            var minYear = selectedYears.reduce(function(min, current) {
                return Math.min(min, current.YEAR);
            }, 3000);
            var maxYear = selectedYears.reduce(function(max, current) {
                return Math.max(max, current.YEAR);
            }, 0);

            var minX = 0
            var maxX = 0
            d3.selectAll("g").each(function(d,i) {
                var datum = d3.select(this).datum()
                if (typeof datum === 'undefined') {
                    return
                }

                var offset = 5
                if (datum.YEAR == minYear) {
                    minX = datum.x - r - offset
                } else if (datum.YEAR == maxYear) {
                    maxX = datum.x + r + offset
                }
            })

            selectedYears.forEach((row)=>{
                var fileName = "year_timeline_" + row.YEAR + ".csv"
                d3.csv("data/" + fileName, function (error, data) {
                    yearsData.push(data)
                    count++
                    if (count == selectedYears.length) {
                        multipleYearsTileChart.update(lastData, colorScale, yearsData, minX, maxX)

                        d3.select("#multipleYearsVisCheckbox").on("change", function(d) {
                            var multipleYears = d3.select("#multipleYearsVisCheckbox").property("checked")
                            if (multipleYears) {
                                d3.select("#multipleYearsTileChart").attr("style", "display: inline;")
                                d3.select("#sidebar").attr("style", "display: none;")
                                multipleYearsTileChart.update(lastData, colorScale, yearsData, minX, maxX)
                            } else {
                                d3.select("#multipleYearsTileChart").attr("style", "display: none;")
                                d3.select("#sidebar").attr("style", "display: inline;")
                            }
                        });
                    }
                })
            });
        }
        var brush = d3.brushX().extent([[0, r * 3],[this.svgWidth, this.svgHeight]]).on("end", brushed);
        this.svg.append("g").attr("class", "brush").call(brush);

    };

};