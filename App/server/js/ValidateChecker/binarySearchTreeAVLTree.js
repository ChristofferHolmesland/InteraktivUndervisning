const BinaryTreeFunctions = require("../algorithms/trees/BinaryTree.js");
const BinarySearchTreeFunctions = require("../algorithms/trees/BinarySearchTree.js");
const AVLTreeFunctions = require("../algorithms/trees/AVLTree.js");
const GeneralTreeFunctions = require("../algorithms/trees/GeneralTreeFunctions.js");

const check = function (solutionInfo) {
	let result = {
        passed: true,
        errors: []
    }

    let treeAction = solutionInfo.treeAction;
    let questionType = solutionInfo.questionType;
    let treeElements =  solutionInfo.treeElements;
    let givenStartTree = solutionInfo.givenStartTree;

    let startTree = [];
    let treeArray = [];

    if (treeAction === "Add") {
        if((givenStartTree === undefined || givenStartTree.roots.length === 0) && (treeElements === undefined || treeElements === "")) {
            result.passed = false;
            result.errors.push("BSTAVLAddMissingFields");
        }
        else {
            if(givenStartTree !== undefined && givenStartTree.roots.length !== 0) {
                startTree = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(givenStartTree);
                if(startTree.length > 1) {
                    result.passed = false;
                    result.errors.push("BSTAVLRootCountError");
                }
                if(!BinaryTreeFunctions.checkTreeCriteria(startTree[0])) {
                    result.passed = false;
                    result.errors.push("BSTAVLInvalidBinaryTreeError");
                }
                if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(startTree[0])) {
                    result.passed = false;
                    result.errors.push("BSTAVLInvalidBinarySearchTreeError");
                }
            }
            if(treeElements !== undefined && !(treeElements === "")) {
                treeArray = treeElements.split(",");
                for (let i = 0; i < treeArray.length; i++) {
                    if(isNaN(treeArray[i])){
                        result.passed = false;
                        result.errors.push("treeElementTypeError");
                        break;
                    }
                }
            }
            if(result.passed){
                let treeObject;
                if (startTree.length === 1 && treeArray.length > 1) {
                    for (let a = 0; a < treeArray.length; a++) {
                        let index = startTree[0].findNodeInNodesUsingValue(treeArray[a]);
                        if (index > -1) {
                            result.passed = false;
                            result.errors.push("BSTAVLAddDuplicateElementError");
                            break;
                        }
                    }
                }
                if(questionType === 7 && result.passed) {
                    if (startTree.length > 0) treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray, true, startTree[0]);
                    else treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray, true);
                    treeObject[0].printTree();
                    if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[0])){
                        result.passed = false;
                        result.errors.push("BSTAVLAddInvalidResultBinarySearchTreeError");
                    }
                }
                if(questionType === 8 && result.passed) {
                    //startTree[0].printTree();
                    startTree[0].printTree();
                    if (startTree.length > 0) treeObject = AVLTreeFunctions.createAVLTree(treeArray, true, startTree[0]);
                    else treeObject = AVLTreeFunctions.createAVLTree(treeArray, true);
                    if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[0]) || !AVLTreeFunctions.checkBalance(treeObject[0].root)) {
                        result.passed = false;
                        result.errors.push("BSTAVLAddInvalidResultAVLTreeError");
                    }
                }
            }
        }
    }
    else if (treeAction === "Remove") {
        if ((givenStartTree === undefined || givenStartTree.roots.length === 0) || treeElements === undefined || treeElements === "") {
            result.passed = false;
            result.errors.push("BSTAVLRemoveMissingFieldsError");
        }
        else {
            treeArray = treeElements.split(",");
            if(treeArray.length === 0) {
                result.passed = false;
                result.passed.errors.push("binaryTreeWrongFormatError");
            }
            for (let i=0;i<treeArray.length;i++) {
                if(isNaN(treeArray[i])){
                    result.passed = false;
                    result.errors.push("treeElementTypeError");
                    break;
                }
            }
            startTree = GeneralTreeFunctions.createTreeObjectFromCanvasObjectver1(givenStartTree);
            if(startTree.length > 1) {
                result.passed = false;
                result.errors.push("BSTAVLRootCountError");
            }
            if(!BinaryTreeFunctions.checkTreeCriteria(startTree[0])) {
                result.passed = false;
                result.errors.push("BSTAVLInvalidBinaryTreeError");
            }
            if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(startTree[0])) {
                result.passed = false;
                result.errors.push("BSTAVLInvalidBinarySearchTreeError");
            }
            if(!startTree[0].areValuesInTree(treeArray)){
                result.passed = false;
                result.errors("BSTAVLRemoveMissingElementError");
            }
            startTree[0].printTree();
            if(questionType === 7 && result.passed) {
                let treeObject = BinarySearchTreeFunctions.createBinarySearchTree(treeArray,false,startTree[0]);
                for(let i=0;i<treeObject.length;i++) {
                    console.log("treeObject i:" + i);
                    treeObject[i].printTree();
                    if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[i])) {
                        result.passed = false;
                        result.errors("BSTAVLRemoveInvalidResultBinarySearchTreeError");
                    }
                    if (!result.passed) break;
                }
            }
            if(questionType === 8 && result.passed) {
                let treeObject = AVLTreeFunctions.createAVLTree(treeArray,false,startTree[0]);
                for(let i=0;i<treeObject.length;i++) {
                    console.log("treeObject i:" + i);
                    treeObject[i].printTree();
                    if(!BinarySearchTreeFunctions.checkBinarySearchTreeCriteria(treeObject[i]) || !AVLTreeFunctions.checkBalance(treeObject[i].root)) {
                        result.passed = false;
                        result.errors("BSTAVLRemoveInvalidResultAVLTreeError");
                    }
                    if (!result.passed) break;
                }
            }
        }
    }else {
        result.passed = false;
        result.errors.push("BSTAVLInvalidTreeActionError");
    }

    return result;
};

module.exports.check = check;