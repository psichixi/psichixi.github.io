/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.path = d3.geoPath().projection(this.projection);
    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

        d3.select("#map").selectAll(".team")
            .remove()
        d3.select("#map").selectAll(".host")
            .remove()
        d3.select("#points").selectAll(".gold")
            .remove()
        d3.select("#points").selectAll(".silver")
            .remove()
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
        var teams_features = this.world.features.filter(function(row) {
            return worldcupData.teams_iso.includes(row["id"]);
        })

        d3.select("#map").selectAll(".team")
            .data(teams_features)
            .enter()
            .append("path")
            .attr("class", "team")
            .attr("d", this.path)

        var host_features = this.world.features.filter(function(row) {
            return row["id"] == worldcupData.host_country_code
        })

        d3.select("#map").selectAll(".host")
            .data(host_features)
            .enter()
            .append("path")
            .attr("class", "host")
            .attr("d", this.path)

        var projection = this.projection

        d3.select("#points").selectAll(".gold")
            .data([worldcupData.win_pos]).enter()
            .append("circle")
            .attr("class", "gold")
            .attr("cx", function (d) { return projection(d)[0]; })
            .attr("cy", function (d) { return projection(d)[1]; })
            .attr("r", "8px")

        d3.select("#points").selectAll(".silver")
            .data([worldcupData.ru_pos]).enter()
            .append("circle")
            .attr("class", "silver")
            .attr("cx", function (d) { return projection(d)[0]; })
            .attr("cy", function (d) { return projection(d)[1]; })
            .attr("r", "8px")
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        var transition = d3.transition();
        var projection = this.projection


        this.world = topojson.feature(world, world.objects.countries);
        var countries_features = this.world.features
        
        d3.select("#map").selectAll(".countries")
            .data(countries_features)
            .enter()
            .append("path")
            .attr("class", "countries")
            .attr("d", this.path)

        const graticule = d3.geoGraticule()
            .step([10, 10]);

        d3.select("#map").selectAll(".grat")
            .data([graticule()])
            .enter()
            .append('path')
            .attr("class", "grat")
            .attr('d', this.path)
            .attr("fill", "none")
            .exit().remove();
    }
}
