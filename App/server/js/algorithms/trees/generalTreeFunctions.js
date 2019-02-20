const BinaryTreeNode = require("./Tree.js").BinaryTreeNode;
const Tree = require("./Tree.js").Tree;

//Converts object given by the graphDrawer to a tree object, has not been fully tested.
//the trees should be checked if they are valid after this function is finished
module.exports.createTreeObjectFromCanvasObjectver1 = function(treeCanvas) {
	let listofTrees = [];
	for (let l=0;l<treeCanvas.roots.length;l++) {
		let rootNode = new BinaryTreeNode(treeCanvas.roots[l].value,undefined,treeCanvas.roots[l].children);
		let tree = new Tree(rootNode);
		let parentNode = rootNode;
		for (let c=0;c<treeCanvas.roots[l].children.length;c++) {
			let node = new BinaryTreeNode(treeCanvas.roots[l].children[c].value,
				parentNode,
				treeCanvas.roots[l].children);	//will not work
			parentNode = node;
			tree.push(node);
		}
		listofTrees.push(tree);
	}
	return listofTrees
};

