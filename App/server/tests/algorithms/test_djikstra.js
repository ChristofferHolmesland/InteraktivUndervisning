const assert = require("assert");

let djikstra = require("../../js/algorithms/graphs/djikstra.js");

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

let expectedInitialStep = {
    type: "Initial",
    from: {
        v: 1
    },
    to: {
        v: 5
    }
};

let expectedDistanceSteps = [
    { type: 'Distance', current: 1, node: 2 },
    { type: 'Distance', current: 1, node: 6 },
    { type: 'Distance', current: 1, node: 3 },
    { type: 'Distance', current: 2, node: 1 },
    { type: 'Distance', current: 2, node: 3 },
    { type: 'Distance', current: 2, node: 4 },
    { type: 'Distance', current: 3, node: 1 },
    { type: 'Distance', current: 3, node: 2 },
    { type: 'Distance', current: 3, node: 6 },
    { type: 'Distance', current: 3, node: 4 },
    { type: 'Distance', current: 6, node: 1 },
    { type: 'Distance', current: 6, node: 3 },
    { type: 'Distance', current: 6, node: 5 },
    { type: 'Distance', current: 4, node: 2 },
    { type: 'Distance', current: 4, node: 3 },
    { type: 'Distance', current: 4, node: 5 }
];

let expectedPath = [1, 3, 6, 5];

let stepper = djikstra(graph, n1, n5);

describe("Checking djikstra", function() {
    it("Checking initial step", function() {
        let initialStep = stepper.get();
        assert.equal(initialStep.type, expectedInitialStep.type);
        assert.equal(initialStep.from.v, expectedInitialStep.from.v);
        assert.equal(initialStep.to.v, expectedInitialStep.to.v);
    });

    it("Checking distance steps", function() {
        assert.equal()

        let i = 0;
        let step = stepper.step();
        while (step.type == "Distance") {
            let expectedStep = expectedDistanceSteps[i];

            assert.equal(step.type, expectedStep.type, "Error for step " + i);
            assert.equal(step.current, expectedStep.current, "Error for step " + i);
            assert.equal(step.node, expectedStep.node, "Error for step " + i);
            
            step = stepper.step();
            i++;
        }

        assert.equal(i, expectedDistanceSteps.length);
    });

    it("Checking path", function() {
        let step = stepper.finish();
        for (let i = 0; i < step.length; i++) {
            assert.equal(step[i].v, expectedPath[i]);
        }
    });
});