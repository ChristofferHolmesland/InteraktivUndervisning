/*
    Stepping implementation of the djikstra algorithm.

    Step definitions:
        - Giving a node a new distance.
        - The shortest path from "from" to "to".
*/
module.exports.djikstra = function(graph, from, to) {
    let currentStep = 0;
    let steps = [
        {
            type: "Initial",
            graph: graph,
            from: from,
            to: to
        }
    ];

    let djikstra = () => {
        let unvisited = [];

        for (let i = 0; i < graph.nodes.length; i++) {
            let node = graph.nodes[i];
            node.visited = false;
            node.distance = Infinity;
            unvisited.push(node);
        }

        let current = from;
        current.distance = undefined;

        do {
            if (current == to) {
                let path = [];
                path.push(current);
                
                current = current.previous;
                while (current !== undefined) {
                    path.unshift(current);
                    current = current.previous;
                }

                steps.push({
                    type: "Path",
                    path: path
                });

                break;
            }

            for (let i = 0; i < graph.edges.length; i++) {
                let edge = graph.edges[i];
                if (edge.n1 == current) {
                    if (edge.n1.visited) continue;

                    let distance = edge.v;
                    if (current.distance) distance += current.distance;

                    if (distance < edge.n2.distance) {
                        edge.n2.distance = distance;
                        edge.n2.previous = current;
                        steps.push({
                            type: "Distance",
                            current: current,
                            node: edge.n2
                        });
                    }
                } else if (edge.n2 == current && !graph.directed) {
                    if (edge.n2.visited) continue;

                    let distance = edge.v;
                    if (current.distance) distance += current.distance;

                    if (distance < edge.n1.distance) {
                        edge.n1.distance = distance;
                        edge.n1.previous = current;
                        steps.push({
                            type: "Distance",
                            current: current,
                            node: edge.n1
                        });
                    }
                }
            }

            current.visited = true;
            unvisited.splice(unvisited.indexOf(current), 1);
            
            let nodeIndex = 0
            let minDistance = unvisited[0].distance; 
            for (let i = 1; i < unvisited.length; i++) {
                if (unvisited[i].distance < minDistance) {
                    nodeIndex = i;
                    minDistance = unvisited[i].distance;
                }
            }
            current = unvisited[nodeIndex];
        } while (unvisited.length > 0);
    }

    djikstra();

    return {
        isDone: function() {
            return currentStep == steps.length - 1;
        },
        get: function() {
            return steps[currentStep];
        },
        step: function() {
            if (currentStep < steps.length - 1)
                currentStep++;
            return steps[currentStep];
        },
        back: function() {
            if (currentStep > 0)
                currentStep++;
            return steps[currentStep];
        },
        finish: function() {
            currentStep = steps.length - 1;
            return steps[currentStep];
        },
        reset: function() {
            currentStep = 0;
            return steps[currentStep];
        },
        getSteps: function() {
            return steps;
        }
    }
};


/* Test data
let n1 = { v: 1 };
let n2 = { v: 2 };
let n3 = { v: 3 };
let n4 = { v: 4 };
let n5 = { v: 5 };
let n6 = { v: 6 };

let edges = [
    {
        n1: n1,
        n2: n2,
        v: 7
    },
    {
        n1: n1,
        n2: n6,
        v: 14
    },
    {
        n1: n1,
        n2: n3,
        v: 9
    },
    {
        n1: n2,
        n2: n3,
        v: 10
    },
    {
        n1: n2,
        n2: n4,
        v: 15
    },
    {
        n1: n3,
        n2: n6,
        v: 2
    },
    {
        n1: n3,
        n2: n4,
        v: 11
    },
    {
        n1: n6,
        n2: n5,
        v: 9
    },
    {
        n1: n4,
        n2: n5,
        v: 6
    }
]

let graph = {
    directed: false,
    nodes: [n1, n2, n3, n4, n5, n6],
    edges: edges
};

let stepper = d(graph, n1, n5);
console.log(stepper.get());

while (!stepper.isDone()) {
    console.log(stepper.step());
} */