const solutionChecker = {
    checkAnswer: function(answer, solution, type) {
        if (type === 1) return require("./solutionCheckerText.js").textChecker(answer, solution);
        else if (type === 2) return require("./solutionCheckerMultipleChoice.js").multipleChoiceChecker(answer, solution);
        else if (type === 3 || type=== 4) return require("./solutionCheckerBinaryTree.js").BinaryTreeChecker(answer,solution);   //not sure if trees are going to be type 3 or 4, 3 = BinaryTree & 4 = BinarySearchTree||AVLTree
        else return false;
    }
};

module.exports.solutionChecker = solutionChecker;
