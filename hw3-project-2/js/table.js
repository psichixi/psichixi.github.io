/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        //this.tree = null; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = null;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;

        this.sortedAsc = null
        this.sortedHeader = null
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        var table = d3.select("#matchTable").append("tbody");

        /*var teamData = d3.nest()
            .key(function (d) {
                return d.key;
            })
            .rollup(function (leaves) {
                return d3.sum(leaves,function(l){return l.Wins}); 
            })
            .entries(this.tableElements);
        console.log("teamData:")
        console.log(teamData)*/


        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.
        //add GoalAxis to header of col 1.
        this.goalScaleMargin = {right: 10, left: 10}
        this.goalScaleWidth = 190 - this.goalScaleMargin.left - this.goalScaleMargin.right,
        this.goalScaleHeight = 30

        this.maxGoals = this.tableElements.reduce(function(max, current) {
            return Math.max(max, current.value["Goals Made"], current.value["Goals Conceded"]);
        }, 0);

        drawGoalAxis(this.goalScaleMargin, this.goalScaleWidth, this.goalScaleHeight, this.maxGoals)

        function drawGoalAxis(goalScaleMargin, goalScaleWidth, goalScaleHeight, maxGoals)
        {
            var goalAxisSvg = d3.select("#goalHeader")
                .append("svg")
                .attr("width", goalScaleWidth + goalScaleMargin.left + goalScaleMargin.right)
                .attr("height", goalScaleHeight)

            goalAxisSvg
                .append("line")
                .attr("x1", goalScaleMargin.left)
                .attr("y1", 20)
                .attr("x2", goalScaleWidth + goalScaleMargin.left)
                .attr("y2", 20)
                .attr("stroke", "black")

            for (var i = 0; i <= maxGoals / 2; i++) {
                var x = goalScaleMargin.left + i * goalScaleWidth / (maxGoals / 2)
                goalAxisSvg
                    .append("line")
                    .attr("x1", x)
                    .attr("y1", 20)
                    .attr("x2", x)
                    .attr("y2", 15)
                    .attr("stroke", "black")

                var text = goalAxisSvg.append("text")
                    .text( function (d) { return 2 * i; })
                    .attr("font-size", "10px")
                    .attr("fill", "black")
                    .attr("x", function(d) {
                        var width = this.getComputedTextLength()
                        return x - width / 2; })
                    .attr("y", function(d) { return 13 })
            }
        }


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        var tableClass = this;

        d3.selectAll("th")
            .on("click", function(d, i, a) {
                tableClass.collapseList()
                var header = d3.select(this).text()
                if (tableClass.sortedHeader == header && !tableClass.sortedAsc)
                {
                    tableClass.sortedHeader = header
                    tableClass.sortedAsc = true

                    tableClass.tableElements.sort(function(a, b) {
                        return d3.ascending(tableClass.getValueForSort(a, header), tableClass.getValueForSort(b, header));
                    })

                    tableClass.updateTable()

                    return
                }

                tableClass.sortedHeader = header
                tableClass.sortedAsc = false

                tableClass.tableElements.sort(function(a, b) {
                    return d3.descending(tableClass.getValueForSort(a, header), tableClass.getValueForSort(b, header));
                })

                tableClass.updateTable()
            })

        var tree = this.tree
        var data = this.tableElements
        // Clicking on headers should also trigger collapseList() and updateTable(). 

        this.setMouseEvents()
    }

    getValueForSort(row, key) {
        if (!row) {
            return ""
        }
        if (key == "Team") {
            return row.key
        }
        if (key == "Wins" || key == "Losses") {
            return row.value[key]
        }
        if (key == "Total Games") {
            return row.value["TotalGames"]
        }
        if (key == "Goals") {
            return row.value["Delta Goals"]
        }
        if (key == "Round/Result") {
            return row.value["Result"]["ranking"]
        }
        return ""
    }

    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        var table = d3.select("#matchTable").select("tbody");
        if (!table) {
            table = d3.select("#matchTable").append("tbody");
        }

        fillTable(this.tableElements)
        function fillTable(data)
        {
            table.selectAll("tr").remove()
            var rows = table.selectAll("tr")
                .data(data)
                .enter()
                .append("tr")
                    .attr("class", function(d, i) { return d.value.type })
                    .attr("id", function(d, i) { return "row" + i });

            var cells = rows.selectAll("td")
            .data(function(row) {
                return [{key: "Team", value:row.key},
                    {key:"Goals", value: {"Made": row.value["Goals Made"], "Conceded": row.value["Goals Conceded"], "Delta": row.value["Delta Goals"]}},
                    {key:"Result", value:row.value["Result"]["label"]},
                    {key:"Wins", value:row.value["Wins"]},
                    {key:"Losses", value:row.value["Losses"]},
                    {key:"TotalGames", value:row.value["TotalGames"]}]
            })
            .enter()
            .append("td")
            .text(function(d, i) {
                if (d.key != "Team" && d.key != "Result") { return "" } 
                return d.value; 
            })
            .attr("align", "right")
            .attr("nowrap", true)
            .attr("id", function(d, i) { return d.key })

            rows.each(function(d, i, el) {
                var team = d3.select("#" + d3.select(this).attr("id")).selectAll("td")
                    .attr("class", function() { return d.value.type })
            })

            rows.exit().remove()
        }

        this.setMouseEvents()

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

        drawTableGoalsData(this.goalScaleMargin, this.goalScaleWidth, this.goalScaleHeight, this.maxGoals)

        function drawTableGoalsData(goalScaleMargin, goalScaleWidth, goalScaleHeight, maxGoals) {
            var goalsSvg = d3.selectAll("#Goals")
                .append("svg")
                .attr("id", 1)
                .attr("width", goalScaleWidth + goalScaleMargin.left + goalScaleMargin.right)
                .attr("height", 20)

            function getWinsScaleLength(value) {
                return goalScaleMargin.left + value * goalScaleWidth / maxGoals
            }
            goalsSvg
                .append("line")
                    .attr("x1", function (d) {
                        return getWinsScaleLength(d.value["Made"])
                    })
                    .attr("y1", 10)
                    .attr("x2", function (d) {
                        return getWinsScaleLength(d.value["Conceded"])
                    })
                    .attr("y2", 10)
                    .attr("stroke", function (d) {
                        var parent = d3.select(this.parentNode)
                        var cellClass = d3.select(parent.node().parentNode).attr("class")
                        if (cellClass == "game") {
                            return "red"
                        }
                        return d.value["Made"] > d.value["Conceded"] ? "blue" : "red"
                    })
                    .attr("stroke-width", function(d) {
                        var parent = d3.select(this.parentNode)
                        var cellClass = d3.select(parent.node().parentNode).attr("class")
                        if (cellClass == "aggregate") {
                            return 10
                        }
                        return 5
                    })
                    .attr("opacity", 0.6)
            goalsSvg
                .append("circle")
                .attr("cx", function (d) {
                        return getWinsScaleLength(d.value["Conceded"])
                    })
                .attr("cy", 10)
                .attr("class", function (d, i, el) {
                    var parent = d3.select(this.parentNode)
                    var cellClass = d3.select(parent.node().parentNode).attr("class")

                    if (cellClass == "game") {
                        if (d.value["Made"] != d.value["Conceded"]) {
                            return "goalCircleGameLosses"
                        }
                        return "goalCircleGameDraw"
                    }
                    if (d.value["Made"] != d.value["Conceded"]) {
                        return "goalCircleAggrLosses"
                    }
                    return "goalCircleAggrDraw"
                })
            goalsSvg
                .append("circle")
                .attr("cx", function (d) {
                        return getWinsScaleLength(d.value["Made"])
                    })
                .attr("cy", 10)
                .attr("class", function (d, i, el) {
                    var parent = d3.select(this.parentNode)
                    var cellClass = d3.select(parent.node().parentNode).attr("class")

                    if (cellClass == "game") {
                        if (d.value["Made"] != d.value["Conceded"]) {
                            return "goalCircleGameWins"
                        }
                        return "goalCircleGameDraw"
                    }
                    if (d.value["Made"] != d.value["Conceded"]) {
                        return "goalCircleAggrWins"
                    }
                    return "goalCircleAggrDraw"
                })
        }

        let barMargin = {right: 10, left: 0},
            barWidth = 90 - barMargin.left - barMargin.right,
            barHeight = 30

        drawTableBarsData("Wins", this.tableElements)
        drawTableBarsData("Losses", this.tableElements)
        drawTableBarsData("TotalGames", this.tableElements)

        function drawTableBarsData(key, table) {
            var maxValue = table.reduce(function(max, current) {
                if (!current.value[key] || current.value[key] == []) {
                    return max
                }
                return Math.max(max, current.value[key]);
            }, 0);

            function getBarLength(value) {
                if (!value || value == []) {
                    return 0
                }
                return barMargin.left + value * barWidth / maxValue
            }

            var barsSvg = d3.selectAll("#" + key)
                .append("svg")
                .attr("width", barWidth + barMargin.left + barMargin.right)
                .attr("height", 20)
            barsSvg
                .append("line")
                .attr("x1", function (d) {
                        return barMargin.left
                    })
                .attr("y1", 10)
                .attr("x2", function (d) {
                    if (d.value == []) {
                        return 0
                    }
                    return getBarLength(d.value)
                })
                .attr("y2", 10)
                .attr("stroke", function (d) {
                    return "#006666"
                })
                .attr("stroke-width", 20)
                .attr("opacity", function (d) {
                    return d.value / maxValue
                })
            barsSvg
                .append("text")
                .text( function (d) { return d.value })
                .attr("fill", "white")
                .attr("x", function(d) {
                    var width = this.getComputedTextLength()
                    return getBarLength(d.value) - 5 - width / 2; })
                .attr("y", function(d) { return 16 })
        }
    };


    setMouseEvents() {
        var tree = this.tree
        var data = this.tableElements
        let table = this;

        function handleMouseOver(d, i) {
            if (!d) {
                return
            }
            tree.updateTree(d)
        };
        function handleMouseClick(d, i, el) {
            if (!d) {
                return
            }
            var idx = data.findIndex(function(el, i, array) { return el.key == d.key })

            if (data[idx + 1].value.type == "game" && data[idx].value.type != "game") {
                var j = idx + 1
                while (data[j].value.type == "game" && j < data.length ) {
                    ++j
                }
                data.splice(idx + 1, j - (idx + 1))

                table.updateTable()
                return
            }

            for (var j in d.value.games) {
                var el = Object.assign({}, d.value.games[j])
                el.key = "x" + el.key
                data.splice(++idx, 0, el);
            }

            table.updateTable()
        };

        d3.selectAll("tr")
            .on("mouseover", handleMouseOver)
            .on("click", handleMouseClick)
    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        var i = 0
        while (i < this.tableElements.length) {
            if (this.tableElements[i].value.type == "game") {
                var j = i
                while (this.tableElements[j].value.type == "game" && j < this.tableElements.length ) {
                    ++j
                }
                this.tableElements.splice(i, j - i)
            }
            ++i
        }
        this.updateTable()

    }


}
