let dijkstra = require("../algorithms/algorithms").graphs.dijkstra;

module.exports = function(question) {
    let from = undefined;
    let to = undefined;
    for (let i = 0; i < question.objects.graph.nodes.length; i++) {
        let node = question.objects.graph.nodes[i];
        if (node.marked == "Start") from = node;
        else if (node.marked == "End") to = node;
    }

    let stepper = dijkstra(question.objects.graph, from, to);
    question.solution = stepper.getSteps();
    question.objects.steps = [stepper.reset()];
    
    return question;
};