/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 


        //Create a root for the tree using d3.stratify(); 

        
        //Add nodes and links to the tree. 

        var treeDataSubset = []
        for (var i in treeData) {
            if (!treeData[i].Team) {
                continue
            }
            var flg = true
            for (var j in treeDataSubset) {
                if (!flg ||
                   (treeData[i].Team == treeDataSubset[j].Opponent &&
                    treeData[i].Opponent == treeDataSubset[j].Team)) {
                    flg = false
                    continue
                }
            }
            if (flg && treeData[i].Team) {
                treeDataSubset.push(treeData[i])
            }
        }
        treeData = treeDataSubset

        var newTreeData = []
        var data = {}
        var treeDataQueue = []
        for (var i in treeData) {
            treeDataQueue.push({"data": treeData[i], "i":i})
        }
        while (treeDataQueue.length > 0) {
            var elem = treeDataQueue.shift()
            var datum = elem.data
            var i = elem.i

            var id = datum.id
            var team = datum.Team
            var opponent = datum.Opponent

            var winner = datum.Wins == "1" ? datum.Team : datum.Opponent

            var ranking = 0
            if (!(team in data) &&
                !(opponent in data)) {
                data[team] = {}
                data[opponent] = {}

                data[team]["maxRanking"] = 1
                data[opponent]["maxRanking"] = 1
            }
            else if (opponent == "" && treeDataQueue.length == 0) {
                data[opponent] = {}
                ranking = data[team]["maxRanking"]
            }
            else if ((!(team in data) || !(opponent in data))) {
                if (opponent != "" || treeDataQueue.length > 0) {
                    treeDataQueue.push(elem)
                }
                continue
            }
            else {
                ranking = data[team]["maxRanking"]
            }

            ranking++
            data[team]["lost"] = (winner != team)
            data[team]["maxRanking"] = ranking

            data[opponent]["lost"] = (winner != opponent)
            data[opponent]["maxRanking"] = ranking

            data[team][ranking] = {}
            data[opponent][ranking] = {}
            data[team][ranking]["id"] = id
            data[opponent][ranking]["id"] = id
            data[team][ranking]["i"] = i
            data[opponent][ranking]["i"] = i

            if (data[team][ranking - 1]) {
                treeData[data[team][ranking - 1]["i"]].parentId = id
            }
            if (data[team][ranking + 1]) {
                treeData[data[team][ranking]["i"]].parentId = 
                    data[team][ranking + 1]["id"]
            }

            if (data[opponent][ranking - 1]) {
                treeData[data[opponent][ranking - 1]["i"]].parentId = id
            }
            if (data[opponent][ranking + 1]) {
                treeData[data[opponent][ranking]["i"]].parentId = 
                    data[opponent][ranking + 1]["id"]
            }
        }

        for (var i in treeData) {
            if (!treeData[i].Opponent) {
                var teamElement = {}
                teamElement.name = treeData[i].Team
                teamElement.id = treeData[i].id + "_" + treeData[i].Team
                teamElement.parentId = ""
                teamElement.win = true
                newTreeData.push(teamElement)
                continue
            }
            var winner = treeData[i].Wins == "1" ? treeData[i].Team : treeData[i].Opponent

            var teamElement = {}
            teamElement.name = treeData[i].Team
            teamElement.id = treeData[i].id + "_" + treeData[i].Team
            teamElement.parentId = (treeData[i].parentId + "_" + winner)
            teamElement.win = (winner == teamElement.name)
            newTreeData.push(teamElement)

            var opponentElement = {}
            opponentElement.name = treeData[i].Opponent
            opponentElement.id = treeData[i].id + "_" + treeData[i].Opponent
            opponentElement.parentId = (treeData[i].parentId + "_" + winner)
            opponentElement.win = (winner == opponentElement.name)
            newTreeData.push(opponentElement)
        }

        var root = d3.stratify()
            .id(function(d) { return d.id; })
            .parentId(function(d) { return d.parentId; })
            (newTreeData);

        // Set the dimensions and margins of the diagram
        let margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 400 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        //let svg = d3.select("body").append("svg")
        var svg = d3.select("#tree")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                  + margin.left + "," + margin.top + ")");

        var i = 0
        let duration = 750

        let treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        //root = d3.hierarchy(treeData, function(d) { return d.children; });

        root.x0 = height / 2;
        root.y0 = 0;

        update(root);

        // Collapse the node and all it's children
        //Here we create a _children attribute to hide the 'hidden' children. 
        function collapse(d) {
            if(d.children) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }

        function update(source) {

            // Assigns the x and y position for the nodes
            let treeData = treemap(root);

            // Compute the new tree layout.
            let nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 80});

            // ****************** Nodes section ***************************

            // Update the nodes...
            let node = svg.selectAll("g.node")
                .data(nodes, function(d) {return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            let nodeEnter = node.enter().append("g")
                //.attr("class', 'node")
                .attr("class", function(d) {
                    return d.data.win ? "winner" : "node"
                })
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)

            nodeEnter.append("text")
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) { return d.data.name; });

            let nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")";
            });

            // Update the node attributes and style
            nodeUpdate.select("circle")
                .attr("r", 5)
                .attr("cursor", "pointer");


            let nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // ****************** links section ***************************

            let link = svg.selectAll("path.link")
                .data(links, function(d) { return d.id; });

            let linkEnter = link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("id", function(d) {
                    return d.data.name
                })
                .attr("d", function(d) {
                    let o = {x: source.x0, y: source.y0}
                    return diagonal(o, o)
                })

            let linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                .duration(duration)
                .attr("d", function(d){ return diagonal(d, d.parent) });

            let linkExit = link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    let o = {x: source.x, y: source.y}
                    return diagonal(o, o)
                })
                .remove();

            nodes.forEach(function(d){
                d.x0 = d.x;
                d.y0 = d.y;
            });

            function diagonal(s, d) {
                var path = `M ${s.y} ${s.x}
                        C ${(s.y + d.y) / 2} ${s.x},
                          ${(s.y + d.y) / 2} ${d.x},
                          ${d.y} ${d.x}`

                return path
            }

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }
        }
    };


    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree()
        d3.selectAll("#" + row)
            .attr("class", "selected")
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.selectAll("path.selected")
            .attr("class", "link") 
    }
}
