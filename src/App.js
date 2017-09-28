import Graph from "react-graph-vis";
import React, {Component} from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.getData(this.setGraph);
  }

  getData(callback) {
    var response;
    var xhttp = new XMLHttpRequest();
    xhttp.onload  = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200)
        {
            response = xhttp.responseText;
            this.setGraph(response);
        }
    }.bind(this);
    xhttp.open("GET", "http://localhost:8080/api/generate/10", false);
    xhttp.send();
  }

  setGraph(graph) {
    graph = JSON.parse(graph);

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

  render() {
    return (
      <div style={{ height: "100%" }}> 
        <div className="row" style={{ height: "100%" }}>
          <div className="col-lg-3" style={{ height: "100%" }}>
            <button>hi</button>
          </div>
          <div className="col-lg-8" style={{ height: "100%"}}>
            <Graph graph={this.graph} options={this.options} events={this.events}  />
          </div>
        </div>
      </div>      
    );
  };
};

export default App;
