const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions");
const AVLTreeFunctions = require("../algorithms/trees/AVLTree");
const BinarySearchTreeFunctions = require("../algorithms/trees/BinarySearchTree");

module.exports = function(question) {
    let solutionType = question.solutionType;
    let elements = question.objects.treeElements;
    let startCanvasTree = question.objects.startTree;
    let startTree = [];
    let arrayOfElements = [];
    let solutionArray = [];

    if (elements !== "" && elements !== undefined) {
        arrayOfElements = elements.split(",");
    }
    
    if (startCanvasTree !== undefined && startCanvasTree.roots.length !== 0) {
        startTree =
            GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(startCanvasTree);
    }

    if (solutionType === 7) {
        if (question.objects.solutionTreeType === "Add") {
            solutionArray = 
                BinarySearchTreeFunctions.createBinarySearchTreeSolution(
                    arrayOfElements,
                    true,
                    startTree[0]
                );
        } else {
            solutionArray = 
                BinarySearchTreeFunctions.createBinarySearchTreeSolution(
                    arrayOfElements,
                    false,
                    startTree[0]
                );
        }
    } else {
        if (question.objects.solutionTreeType === "Add") {
            solutionArray = 
                AVLTreeFunctions.createAVLTreeSolution(
                    arrayOfElements,
                    true,
                    startTree[0]
                );
        } else { 
            solutionArray = 
                AVLTreeFunctions.createAVLTreeSolution(
                    arrayOfElements,
                    false,
                    startTree[0]
                );
        }
    }

    for (let s = 0; s < solutionArray.length; s++){
        for (let t = 0; t < solutionArray[s].treeInfo.length; t++){
            solutionArray[s].treeInfo[t].makeTreeReadyForExport();
        }
    }

    question.solution = solutionArray;
    question.objects.steps = [solutionArray[0]];
    
    return question;
};