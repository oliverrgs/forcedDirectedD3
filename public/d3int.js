var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

function emailToFields(email){
	var from;
	var to;
	for(var field of email.message.split("\n")){
		if(field.startsWith("From: ")){
			from = field.slice(6)
		}
		if(field.startsWith("To: ")){
			to = field.slice(4);
		}
		
	}
	return {"from": from, "to": to} 
}
function DoD3(name){
var filename = "small.json";
if(name == "jane@a.com"){
	filename = "emails.json";
}	
d3.json(filename, function(error, jsonBlob) {
	var knownNodes = [];
	var knownEdges = [];
	var Nodes = [];
	var idIter = 1;
	var graph = {};
	graph.nodes=[];
	graph.links=[];
	for(var email of jsonBlob){
		var fields = emailToFields(email);
		
		if(knownNodes.indexOf(fields.from) <0){
			knownNodes.push(fields.from);
			graph.nodes.push(
				{"id": fields.from, "group": idIter++}
			);
		}
		if(knownNodes.indexOf(fields.to) <0){
			knownNodes.push(fields.to);
			graph.nodes.push(
				{"id": fields.to, "group": idIter++}
			);
		}
		var linkHash = fields.from+"_________##__________"+fields.to;
		if(knownEdges.indexOf(linkHash) <0){
			knownEdges.push(linkHash);
			graph.links.push({"source": fields.from, "target": fields.to, "value": email.length });
		}
	}
	
	console.log(graph);
	
  if (error) throw error;
	
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});
}
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}