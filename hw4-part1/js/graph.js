
d3.json("data/countries_1995_2012.json", function(error, json_data) {

    var countriesByIds = {}
    for (var i in json_data) {
        countriesByIds[json_data[i].country_id] = i
    }

    var svg = d3.select(".view").append("svg")
    var rowHeight = 15

    var graph = {nodes: [], links: []};

    graph.nodes = json_data

    graph.nodes.forEach(function(d, i) {
        var years = d.years[0]
        for (var i in years.top_partners) {
            var sourceId = countriesByIds[d.country_id]
            var targetId = countriesByIds[years.top_partners[i].country_id]
            graph.links.push({"source": graph.nodes[sourceId], "target": graph.nodes[targetId]})
        }
    })

    var simulation = d3.forceSimulation()
    init()

    var continents = {}
    var continentsArray = []
    var k = 0
    for (var i in graph.nodes) {
        var continent = graph.nodes[i].continent
        if (!(continent in continents)) {
            continentsArray.push({"name": continent, "i": k})
            continents[continent] = {"idx": k}
            ++k
        }
    }

    var radio = d3.select(".control")
        .append("p").append('radiobuttons')

    var layoutTypes = ["Equal distance", "Line", "Scatterplot", "Circular", "Grouped line", "Grouped circular", "Double circular"]

    var currentLayout = layoutTypes[0]
    function onRadioClick(value, i) {
        currentLayout = value
        if (value != layoutTypes[1]) {
            d3.selectAll(".selectLineLayoutKey")
                .attr("disabled", "disabled")
        }
        if (value != layoutTypes[2]) {
            d3.selectAll(".selectScatterplotKey")
                .attr("disabled", "disabled")
        }
        if (value != layoutTypes[3]) {
            d3.selectAll(".selectCircularKey")
                .attr("disabled", "disabled")
        }
        if (value != layoutTypes[4] && value != layoutTypes[5]) {
            simulation.stop()
        }

        if (value == layoutTypes[0])
        {
            equalDistanceLayout()
        } else if (value == layoutTypes[1]) {
            d3.selectAll(".selectLineLayoutKey")
                .attr("disabled", null)
            lineLayout()
        } else if (value == layoutTypes[2]) {
            d3.selectAll(".selectScatterplotKey")
                .attr("disabled", null)
            scatterplotLayout()
        } else if (value == layoutTypes[3]) {
            d3.selectAll(".selectCircularKey")
                .attr("disabled", null)
            circularLayout()
        } else if (value == layoutTypes[4]) {
            groupedLineLayout()
        } else if (value == layoutTypes[5]) {
            groupedCircularLayout()
        } else if (value == layoutTypes[6]) {
            doubleCircularLayout()
        }
    }

    radio.append("label").html("Layout type: ")
        .selectAll("input")
        .data(layoutTypes)
        .enter()
        .append("label")
        .text(function(d) { return "    " + d; })
        .append("input")
        .attr("type", "radio")
        .attr("name", "type_radio")
        .attr("id", function(d) { return d; })
        .attr("value", currentLayout)
        .on("click", onRadioClick)

    radio.selectAll("input")
        .each(function(d,i){
            var element = d3.select(this);
            if (element.attr("id") == layoutTypes[0]) {
                element.node().checked = true
            }
            if (element.attr("id") == layoutTypes[0] && element.node().checked) {
                equalDistanceLayout()
            }
        })


    var select = d3.select(".control")
        .append("p").append('selectGroup')

    var layoutKeyTypes = ["population", "gdp"]

    function onSelectLineKeyChange() {
        selectValue = d3.select('.selectLineLayoutKey').property('value')
        if (currentLayout == layoutTypes[1]) {
            lineLayout()
        }
    };

    var select = d3.select('.control')
        .append("p").append('selectGroup')
        .attr("disabled", "disabled")

    select.append("label").html("Line layout by: ")
        .attr('class','select')

    select = select.append('select')
        .attr("disabled", "disabled")
        .attr('class','selectLineLayoutKey')
        .on('change', onSelectLineKeyChange)

    var options = select
      .selectAll('option')
        .data(layoutKeyTypes).enter()
        .append('option')
            .attr('class','select')
            .text(function (d) { return d; });


    var select = d3.select(".control")
        .append("p").append('selectScatterplotKeyGroup')

    var scatterPlotLayoutKeyTypes = ["population, gdp", "longitude, latitude"]

    function onSelectScatterplotKeyChange() {
        selectValue = d3.select('.selectScatterplotKey').property('value')
        if (currentLayout == layoutTypes[2]) {
            scatterplotLayout()
        }
    };

    var select = d3.select('.control')
        .append("p").append('selectGroup')
        .attr("disabled", "disabled")

    select.append("label").html("Scatterplot layout by: ")
        .attr('class','select')

    select = select.append('select')
        .attr("disabled", "disabled")
        .attr('class','selectScatterplotKey')
        .on('change', onSelectScatterplotKeyChange)

    var options = select
      .selectAll('option')
        .data(scatterPlotLayoutKeyTypes).enter()
        .append('option')
            .attr('class','select')
            .text(function (d) { return d; });



    var select = d3.select(".control")
        .append("p").append('selectCircularKeyGroup')

    var circularLayoutKeyTypes = ["population", "gdp"]

    function onSelectCircularKeyChange() {
        var selectValue = d3.select('.selectCircularKey').property('value')
        if (currentLayout == layoutTypes[3]) {
            circularLayout()
        }
    };

    var select = d3.select('.control')
        .append("p").append('selectGroup')
        .attr("disabled", "disabled")

    select.append("label").html("Circular layout sort by: ")
        .attr('class','select')

    select = select.append('select')
        .attr("disabled", "disabled")
        .attr('class','selectCircularKey')
        .on('change', onSelectCircularKeyChange)

    var options = select
      .selectAll('option')
        .data(circularLayoutKeyTypes).enter()
        .append('option')
            .attr('class','select')
            .text(function (d) { return d; });

    var link = svg.selectAll(".link")
    var nodes = svg.selectAll(".node")

    function init() {
        link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "gray")
            .attr("stroke-width", "1px")
            .attr("d", d3.line().curve(d3.curveBundle.beta(0.5)))

        var nodes = svg.selectAll("g")
            .data(json_data)
        var nodesEnter = nodes
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("id", function(d) { return d.name })

        nodesEnter.append("circle")
            .attr("class", "circle")
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "white")

        nodesEnter
            .append("text")
            .text(function(d, i) {
                return d.name
            })
            .attr("x", function(d, i) {
                return 10
            })
            .attr("y", 5)
            d3.selectAll("text")
                .attr("font-size", 14)

        nodesEnter
            .on("mouseover", handleMouseOver)
    }

    function handleMouseOver(d, i) {
        d3.selectAll(".selected")
            .attr("class", "circle")
        d3.selectAll(".link")
            .transition().duration(200)
            .attr("stroke", "gray")
            .attr("stroke-width", 1)

        var reducedOpacity = 0.2
        d3.selectAll(".link")
            .attr("opacity", reducedOpacity)

        d3.selectAll(".node")
            .attr("opacity", reducedOpacity)
        var node = d3.select(this)
            .attr("opacity", 1)
        var circle = node.select("circle")
            .attr("class", "selected")

        link.each(function(d, i, el) {
            var cur = d3.select(this)
            if (cur.datum().source.country_id == circle.datum().country_id || cur.datum().target.country_id == circle.datum().country_id) {

                cur
                    .transition().duration(300)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("opacity", 1)
            }
        })

    }

    function equalDistanceLayout() {
        var width = 400
        var height = (json_data.length + 1) * rowHeight
        svg
            .attr("width", width)
            .attr("height", height)

        graph.nodes.forEach(function(d, i) {
            d.x = 10
            d.y = (rowHeight + i * rowHeight)
        })

        graph_update(1500);
    }

    function lineLayout() {
        var height = 1200
        var layoutSize = height - 100
        svg
            .attr("width", 400)
            .attr("height", height)

        var key = d3.select('.selectLineLayoutKey').property('value')

        var maxValue = json_data.reduce(function(max, current) {
            return Math.max(max, current.years[0][key]);
        }, 0);

        graph.nodes.forEach(function(d, i) {
            d.x = 10;
            d.y = layoutSize * d.years[0][key] / maxValue;
        })

        graph_update(1500)
    }

    function scatterplotLayout() {
        var width = 1200
        var height = 1200

        var margin = 100
        var layoutSizeX = width - margin
        var layoutSizeY = height - margin
        svg
            .attr("width", width)
            .attr("height", height)

        var keyX = ""
        var keyY = ""
        var key = d3.select('.selectScatterplotKey').property('value')
        if (key == scatterPlotLayoutKeyTypes[0]) {
            keyX = "population"
            keyY = "gdp"
        } else {
            keyX = "longitude"
            keyY = "latitude"
        }

        var maxValueX = json_data.reduce(function(max, current) {
            value = (key == scatterPlotLayoutKeyTypes[1]) ? current[keyX] : current.years[0][keyX]
            return Math.max(max, value);
        }, 0);
        var maxValueY = json_data.reduce(function(max, current) {
            value = (key == scatterPlotLayoutKeyTypes[1]) ? current[keyY] : current.years[0][keyY]
            return Math.max(max, value);
        }, 0);

        var minValueX = json_data.reduce(function(min, current) {
            value = (key == scatterPlotLayoutKeyTypes[1]) ? current[keyX] : current.years[0][keyX]
            return Math.min(min, value);
        }, 0);
        var minValueY = json_data.reduce(function(min, current) {
            value = (key == scatterPlotLayoutKeyTypes[1]) ? current[keyY] : current.years[0][keyY]
            return Math.min(min, value);
        }, 0);

        graph.nodes.forEach(function(d, i) {
            valueX = (key == scatterPlotLayoutKeyTypes[1]) ? d[keyX] : d.years[0][keyX]
            valueY = (key == scatterPlotLayoutKeyTypes[1]) ? d[keyY] : d.years[0][keyY]
            d.x = 5 + layoutSizeX * (valueX - minValueX) / (maxValueX - minValueX)
            d.y = 10 + layoutSizeY * (valueY - minValueY) / (maxValueY - minValueY)
        })

        graph_update(1500)
    }


    function circularLayout() {
        var height = 1200
        var width = 1200
        var layoutSize = height - 100
        svg
            .attr("width", width)
            .attr("height", height)

        var r = Math.min(height, width) - 200//* 3 / 4// /2;

        var arc = d3.arc()
              .outerRadius(r);

        var key = d3.select('.selectCircularKey').property('value')

        var pie = d3.pie()
            .sort(function(a, b) {
                return a.years[0][key] - b.years[0][key];})
            .value(function(d, i) { 
                return 1;  // We want an equal pie share/slice for each point
            })

        graph.nodes = pie(graph.nodes).map(function(d, i) {
            d.innerRadius = 0;
            d.outerRadius = r;

            d.data.x = arc.centroid(d)[0] + width / 2;
            d.data.y = arc.centroid(d)[1] + height / 2;

            return d.data;
        })

        graph_update(1500)
    }

    /*var color = d3.scaleOrdinal(d3.schemeCategory20)
    svg.selectAll("circle")
        .attr("fill", function(d, i) {
            return color(d.continent)
        })*/
    function groupedLineLayout() {
        var width = 1200
        var height = 400

        svg
            .attr("width", width)
            .attr("height", height)

        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){ return d.r + 8 }).iterations(1) )
            .force("charge", d3.forceManyBody(180))
            .force("y", d3.forceY(height / 2))
            .force("x", d3.forceX(function(d){
                var size = Object.keys(continents).length
                var x = width / (size + 2) * (continents[d.continent].idx + 1)
                return x
            }))

        var ticked = function() {
            graph_update(1)
        }

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked)
            /*.force("link") 
            .links(graph.links);*/
    }


    function groupedCircularLayout() {
        var width = 1200
        var height = 800

        svg
            .attr("width", width)
            .attr("height", height)

        var r = Math.min(height, width) / 2;

        var arc = d3.arc()
              .outerRadius(r);

        var pie = d3.pie()
            .value(function(d, i) { 
                return 1;
            })

        continentsArray = pie(continentsArray).map(function(d, i) {
            d.innerRadius = 0;
            d.outerRadius = r;

            d.data.centroidX = arc.centroid(d)[0] + width / 2;
            d.data.centroidY = arc.centroid(d)[1] + height / 2;
            continents[d.data.name].centroidX = arc.centroid(d)[0] + width / 2;
            continents[d.data.name].centroidY = arc.centroid(d)[1] + height / 2;

            return d.data;
        })

        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){ return d.r + 64 }).iterations(1) )
            .force("charge", d3.forceManyBody())
            .force("y", d3.forceY(function(d) {
                var y = continents[d.continent].centroidY
                return y
            }))
            .force("x", d3.forceX(function(d){
                var x = continents[d.continent].centroidX
                return x
            }))

        var ticked = function() {
            graph_update(1)
        }

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked)
            /*.force("link")
            .links(graph.links);*/
    }



    function doubleCircularLayout() {
        var width = 1200
        var height = 800

        svg
            .attr("width", width)
            .attr("height", height)

        var r = Math.min(height, width) / 2;

        var arc = d3.arc()
              .outerRadius(r);

        var pie = d3.pie()
            .value(function(d, i) { 
                return 1;
            })

        continentsArray = pie(continentsArray).map(function(d, i) {
            d.innerRadius = 0;
            d.outerRadius = r;

            d.data.centroidX = arc.centroid(d)[0] + width / 2;
            d.data.centroidY = arc.centroid(d)[1] + height / 2;
            continents[d.data.name].centroidX = arc.centroid(d)[0] + width / 2;
            continents[d.data.name].centroidY = arc.centroid(d)[1] + height / 2;

            return d.data;
        })

        for (var i in continentsArray) {
            var internalR = Math.min(height, width) / 5;

            var internalArc = d3.arc()
                  .outerRadius(internalR);

            var internalPie = d3.pie()
                .value(function(d, i) { 
                    return 1;
                })

            var continent = continentsArray[i].name
            var centerX = continents[continent].centroidX
            var centerY = continents[continent].centroidY

            var filteredGraph = graph.nodes.filter(function(d, i) {
                return d.continent == continent
            })

            var filteredPie = pie(filteredGraph)

            graph.nodes = graph.nodes.map(function(d, i) {
                if (d.continent != continent) {
                    return d
                }
                var pieElement = filteredPie.find(function(pieDatum, i) {
                    return d.name == pieDatum.data.name
                })

                pieElement.innerRadius = 0;
                pieElement.outerRadius = internalR;

                d.x = internalArc.centroid(pieElement)[0] + centerX
                d.y = internalArc.centroid(pieElement)[1] + centerY

                return d
            })
        }
        graph_update(1500)
    }


    function graph_update(duration) {
        link.transition().duration(duration)
          .attr("x1", function(d) { return d.target.x; })
          .attr("y1", function(d) { return d.target.y; })
          .attr("x2", function(d) { return d.source.x; })
          .attr("y2", function(d) { return d.source.y; });

        var nodes = svg.selectAll("g")
        nodes.transition().duration(duration)
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            });
        }

});

