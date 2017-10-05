import Graph from "react-graph-vis";
import React, {Component} from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      nodeCount: 10,
      startNode: 1
    };
    this.getData(this.state.nodeCount);
  }

  getData(nodeCount) {
    var response;
    var xhttp = new XMLHttpRequest();
    xhttp.onload  = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200)
        {
            response = xhttp.responseText;
            this.setGraph(response);
        }
    }.bind(this);
    xhttp.open("GET", "http://localhost:8080/api/generate/" + nodeCount.toString(), false);
    xhttp.send();
  }

  setGraph(graph) {
    graph = JSON.parse(graph);
    this.originalGraph = graph;

    this.graph = {
      nodes: [],
      edges: []
    };
    var nodes = [];
    var edges = [];

    for (var node in graph.nodes) {
        nodes.push({
            id: graph.nodes[node].id,
            label: graph.nodes[node].id
        });
    }
    for (var edge in graph.edges) {
        edges.push({
            from: graph.edges[edge].source.id,
            to: graph.edges[edge].target.id,
            Length: graph.edges[edge].weight,
            label: graph.edges[edge].weight
        });
    }

    this.graph.nodes = nodes;
    this.graph.edges = edges;

    this.options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000",
        arrows: {
          to: {
            enabled: false,
            scaleFactor: .1
          }
        }
      },
      physics: {
        enabled: true,
        repulsion: 1
      }
    };

    this.events = {
      select: function(event) {
        var { nodes, edges } = event;
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
      }
    }
  }

  generateGraph() {
    this.getData(this.state.nodeCount);
    this.setState(prevState => ({
      id: prevState.id++
    }));
  }

  getShortestPath() {
    var response;
    var xhttp = new XMLHttpRequest();
    xhttp.onload  = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200)
        {
            response = xhttp.responseText;
        }
    }.bind(this);
    xhttp.open("POST", "http://localhost:8080/api/solve/" + this.state.startNode.toString(), false);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    var data = JSON.stringify(this.originalGraph);
    xhttp.send(data);
  }

  updateNodeCount(evt) {
    this.setState({
      nodeCount: evt.target.value
    })
  }

  updateStartNode(evt) {
    this.setState({
      startNode: evt.target.value
    })
  }

  render() {
    return (
      <div style={{ height: "100%" }}> 
        <div className="row" style={{ height: "100%" }}>
          <div className="col-lg-3 col-md-3 col-sm-3" style={{ height: "100%" }}>

            <div style= {{ marginTop: "100px" }}>
              <div className="form-group">
                <input value={this.state.nodeCount} onChange={this.updateNodeCount.bind(this)} type="text" className="form-control" placeholder="# of nodes" />
              </div>
              <button type="button" className="btn btn-primary" onClick={this.generateGraph.bind(this)}>Generate</button>
            </div>

            <div style= {{ marginTop: "100px" }}>
              <div className="form-group">
                <input value={this.state.startNode} onChange={this.updateStartNode.bind(this)} type="text" className="form-control" placeholder="Starting node" />
              </div>
              <button type="button" className="btn btn-primary" onClick={this.getShortestPath.bind(this)}>Solve</button>
            </div>

            
            
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8" style={{ height: "100%"}}>
            <Graph graph={this.graph} options={this.options} events={this.events}  />
          </div>
        </div>
      </div>      
    );
  };
};

export default App;
