   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){

        // ******* TODO: PART II *******

        var curClass = this

        var independent = electionResult.filter(function(d) {
            return d["I_EV"] != "";
        });
        independent.sort(function(a, b) {
            return a["I_EV"] > b["I_EV"]
        })
        independent = independent.map(function(d) {
            var result = {}
            result["class"] = curClass.chooseClass("I")
            result["value"] = d["I_EV"]
            result["RD_Difference"] = 0//d["RD_Difference"]
            return result
        })

        var republicans = electionResult.filter(function(d) {
            return d["R_EV"] != "";
        });
        republicans = republicans.map(function(d) {
            var result = {}
            result["class"] = curClass.chooseClass("R")
            result["value"] = d["R_EV"]
            result["RD_Difference"] = parseFloat(d["RD_Difference"])
            return result
        })
        republicans.sort(function(a, b) {
            return a["RD_Difference"] - b["RD_Difference"]
        })

        var democrats = electionResult.filter(function(d) {
            return d["D_EV"] != "";
        });
        democrats = democrats.map(function(d) {
            var result = {}
            result["class"] = curClass.chooseClass("D")
            result["value"] = d["D_EV"]
            result["RD_Difference"] = parseFloat(d["RD_Difference"])
            return result
        })
        democrats = democrats.sort(function(a, b) {
            return a["RD_Difference"] - b["RD_Difference"]
        })
        var data = independent.concat(democrats).concat(republicans)
        var sum = electionResult.reduce(function(sum, current) {
            return parseInt(current["Total_EV"]) + sum
        }, 0);

        var indSum = independent.reduce(function(sum, current) {
            return parseInt(current.value) + sum
        }, 0);
        var repSum = republicans.reduce(function(sum, current) {
            return parseInt(current.value) + sum
        }, 0);
        var demSum = democrats.reduce(function(sum, current) {
            return parseInt(current.value) + sum
        }, 0);

        this.svg.selectAll("rect").remove()
        this.svg.selectAll("text").remove()
        var maxX = 0
        var svgWidth = this.svgWidth

        function getWidth(d) {
            return d.value * svgWidth / sum
        }
        var rectHeight = 50
        var y0 = 45
        var centerLineHeight = 60
        var minDemocratX = svgWidth
        this.svg.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("class", "electoralVotes")
            .attr("width", function(d) {
                return getWidth(d)
            })
            .attr("height", rectHeight)
            .attr("x", function(d, i) {
                var x = maxX
                var width = getWidth(d)
                maxX += width
                if (d.class == "democrat" && x < minDemocratX) {
                    minDemocratX = x
                }
                if (electionResult[i]) {
                    electionResult[i]["x"] = x
                    electionResult[i]["width"] = width
                }
                return x
            })
            .attr("y", y0)
            .attr("class", function(d) {
                if (d.class == "independent") {
                    return d.class
                }
            })
            .attr("fill", function(d) {
                if (d.class == "independent") {
                    return;
                }
                return colorScale(d.RD_Difference)
            })

        this.svg.append("line")
            .attr("x1", svgWidth / 2)
            .attr("y1", y0 - (centerLineHeight - rectHeight) / 2)
            .attr("x2", svgWidth / 2)
            .attr("y2", y0 - (centerLineHeight - rectHeight) / 2 + centerLineHeight)
            .attr("stroke", "black")
            .attr("stroke-width", 1)

        this.svg.append("text")
            .attr("class", "votesPercentageNote")
            .text("Electoral vote (" + parseInt(sum * 0.51) + " needed to win)")
            .attr("x", function(d, i) {
                return svgWidth / 2 //- d3.select(this).node().getBBox().width / 2
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })

        if (indSum > 0) {
            this.svg.append("text")
            .text(indSum)
            .attr("class", "independent electoralVoteText")
            .attr("x", 0)
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })
        }

        this.svg.append("text")
            .text(demSum)
            .attr("class", "democrat electoralVoteText")
            .attr("x", minDemocratX)
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })

        this.svg.append("text")
            .text(repSum)
            .attr("class", "republican electoralVoteText")
            .attr("x", function(d, i ) {
                return svgWidth
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })
    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

        var shiftChart = this.shiftChart
        function brushed(d) {
            var s = d3.event.selection;
            if (s == null) {
                shiftChart.update([])
                return
            }

            var x0 = s[0]
            var xMax = s[1]

            var selectedStates = []
            electionResult.forEach((row)=>{
                if (row.x + row.width > x0 && row.x <= xMax) {
                    selectedStates.push(row)
                }
            });
            shiftChart.update(selectedStates)
        }
        var brush = d3.brushX().extent([[0,y0],[this.svgWidth, y0 + rectHeight]]).on("end", brushed);
        this.svg.append("g").attr("class", "brush").call(brush);

    };

    
}
