/** Class implementing the yearsShiftChart. */
class YearsShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divYearsShiftChart = d3.select("#yearsShiftChart")//.classed("sideBar", true);
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedYears){
        this.divYearsShiftChart.selectAll("ul").remove()

        if (selectedYears.length == 0) {
            return
        }

        var ul = this.divYearsShiftChart.select("#yearsList").append('ul');
        ul.selectAll('li')
            .data(selectedYears)
            .enter()
            .append('li')
            .html(function(d, i) {
                return d.YEAR
            });

    };


}
