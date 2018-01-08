/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        var curClass = this
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html((d)=> {
                /* populate data in the following format
                 * tooltip_data = {
                 * "result":[
                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
                 * ]
                 * }
                 * pass this as an argument to the tooltip_render function then,
                 * return the HTML content returned from that method.
                 * */

                var D_Nominee_prop = electionResult[0]["D_Nominee_prop"]
                var D_Votes_Total = electionResult[0]["D_Votes_Total"]
                var D_PopularPercentage = electionResult[0]["D_PopularPercentage"]

                var R_Nominee_prop = electionResult[0]["R_Nominee_prop"]
                var R_Votes_Total = electionResult[0]["R_Votes_Total"]
                var R_PopularPercentage = electionResult[0]["R_PopularPercentage"]

                var I_Nominee_prop = electionResult[0]["I_Nominee_prop"]
                var I_Votes_Total = electionResult[0]["I_Votes_Total"]
                var I_PopularPercentage = electionResult[0]["I_PopularPercentage"]

                /*electionResult.forEach((row)=>{
                    D_Nominee_prop += row["D_Nominee_prop"]
                    D_Votes_Total += row["D_Votes_Total"]
                    D_PopularPercentage += row["D_PopularPercentage"]

                    R_Nominee_prop += row["R_Nominee_prop"]
                    R_Votes_Total += row["R_Votes_Total"]
                    R_PopularPercentage += row["R_PopularPercentage"]

                    I_Nominee_prop += row["I_Nominee_prop"]
                    I_Votes_Total += row["I_Votes_Total"]
                    I_PopularPercentage += row["I_PopularPercentage"]
                });*/
                var tooltip_data = {
                  "result":[
                  {"nominee":D_Nominee_prop, "votecount":D_Votes_Total, "percentage":D_PopularPercentage, "party":"D"} ,
                  {"nominee":R_Nominee_prop, "votecount":R_Votes_Total, "percentage": R_PopularPercentage, "party":"R"} ,
                  {"nominee":I_Nominee_prop, "votecount":I_Votes_Total, "percentage": I_PopularPercentage, "party":"I"}
                  ]
                }

                return curClass.tooltip_render(tooltip_data);
            });

        this.svg.selectAll("rect").remove()
        this.svg.selectAll("text").remove()

        this.svg.call(tip);

        var rectHeight = 50
        var centerLineHeight = 60
        var y0 = 95
        var maxX = 0
        var svgWidth = this.svgWidth
        var minDemocratX = svgWidth

        var indSum = electionResult.reduce(function(sum, current) {
            return parseFloat(current["I_PopularPercentage"]) + sum
        }, 0);
        if (isNaN(indSum)) {
            indSum = 0
        }

        var demSum = electionResult.reduce(function(sum, current) {
            return parseFloat(current["D_PopularPercentage"]) + sum
        }, 0);

        var repSum = electionResult.reduce(function(sum, current) {
            return parseFloat(current["R_PopularPercentage"]) + sum
        }, 0);

        var indPercentage = (indSum / electionResult.length).toFixed(1)
        var demPercentage = (demSum / electionResult.length).toFixed(1)
        var repPercentage = (repSum / electionResult.length).toFixed(1)

        var sum = indSum + demSum + repSum
        function getWidth(d) {
            if (typeof d === 'undefined')
                return 0
            return d * svgWidth / sum
        };

        var curClass = this
        this.svg.append("rect")
            .attr("class", "votesPercentage independent")
            .attr("x", function(d, i) {
                var x = maxX
                maxX += getWidth(indSum)
                return x
            })
            .attr("y", y0)
            .attr("height", rectHeight)
            .attr("width", function(d, i) {
                return getWidth(indSum)
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        this.svg.append("rect")
            .attr("class", "votesPercentage democrat")
            .attr("x", function(d, i) {
                var x = maxX
                maxX += getWidth(demSum)
                if (x < minDemocratX) {
                    minDemocratX = x
                }
                return x
            })
            .attr("y", y0)
            .attr("height", rectHeight)
            .attr("width", function(d, i) {
                return getWidth(demSum)
            })
            .on("mouseover", function(d, i) {
                curClass.tooltip_render(tooltip_data)
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        this.svg.append("rect")
            .attr("class", "votesPercentage republican")
            .attr("x", function(d, i) {
                var x = maxX
                maxX += getWidth(repSum)
                return x
            })
            .attr("y", y0)
            .attr("height", rectHeight)
            .attr("width", function(d, i) {
                return getWidth(repSum)
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        this.svg.append("line")
            .attr("x1", svgWidth / 2)
            .attr("y1", y0 - (centerLineHeight - rectHeight) / 2)
            .attr("x2", svgWidth / 2)
            .attr("y2", y0 - (centerLineHeight - rectHeight) / 2 + centerLineHeight)
            .attr("stroke", "black")
            .attr("stroke-width", 1)

        this.svg.append("text")
            .attr("class", "electoralVotesNote")
            .text("Popular vote (50%)")
            .attr("x", function(d, i) {
                return svgWidth / 2 //- d3.select(this).node().getBBox().width / 2
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height * 2
            })

        var democratNomineeX = 0
        if (indSum > 0) {
            this.svg.append("text")
            .text(indPercentage + "%")
            .attr("class", "independent electoralVoteText")
            .attr("x", 0)
            .attr("y", function(d, i) {
                var bbox = d3.select(this).node().getBBox()
                if (bbox.width > minDemocratX) {
                    minDemocratX = bbox.width + 10
                }
                return bbox.height * 2
            })
            this.svg.append("text")
                .text(electionResult[0]["I_Nominee"])
                .attr("class", "independent electoralVotesNote")
                .attr("x", function(d, i ) {
                    return 0
                })
                .attr("y", function(d, i) {
                    var bbox = d3.select(this).node().getBBox()
                    democratNomineeX = bbox.width + 10
                    return bbox.height
                })
        }

        this.svg.append("text")
            .text(demPercentage + "%")
            .attr("class", "democrat electoralVoteText")
            .attr("x", minDemocratX)
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height * 2
            })
        this.svg.append("text")
            .text(electionResult[0]["D_Nominee"])
            .attr("class", "democrat electoralVotesNote")
            .attr("x", function(d, i ) {
                return democratNomineeX
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })

        this.svg.append("text")
            .text(repPercentage + "%")
            .attr("class", "republican electoralVoteText")
            .attr("x", function(d, i ) {
                return svgWidth
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height * 2
            })
        this.svg.append("text")
            .text(electionResult[0]["R_Nominee"])
            .attr("class", "republican electoralVotesNote")
            .attr("x", function(d, i ) {
                return svgWidth
            })
            .attr("y", function(d, i) {
                return d3.select(this).node().getBBox().height
            })

        // ******* TODO: PART III *******

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .votesPercentage class to style your bars.

        //Display the total percentage of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element

        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    };


}