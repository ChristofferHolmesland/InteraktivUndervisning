const GeneralTreeFunctions = require("./GeneralTreeFunctions.js");

class Tree {
	constructor(rootNode,nodes) {
		this.root = rootNode;
		if (nodes !== undefined) {
			this.nodes = nodes;
		}else {
			this.nodes = [rootNode];
		}
	}

	changeRoot (node) {
		if (node !== this.root) {
			let oldIndex = this.nodes.indexOf(node);
			console.log(oldIndex);
			let tempRoot = this.root;
			this.root = node;
			this.nodes[0] = node;
			if (oldIndex === -1) {
				this.nodes.push(tempRoot);
			} else {
				this.nodes[oldIndex] = tempRoot;
			}
		}
	}

	printTree() {
		console.log("Root: " );
		console.log(this.root);
		for (let n= 0; n<this.nodes.length;n++) {
			console.log(n);
			console.log(this.nodes[n])
		}
	}

	getLowestNode(node) {
		let currentNode;
		if (node === undefined) {
			currentNode = this.root;
		}else {
			currentNode = node;
		}
		while (currentNode.children[0] !== undefined || currentNode.children[1] !== undefined) {
			let leftHeight = 0;
			let rightHeight = 0;
			//console.log(currentNode);
			if (currentNode.children[0] !== undefined) {
				leftHeight = GeneralTreeFunctions.getHeight(currentNode.children[0])
			}
			if (currentNode.children[1] !== undefined) {
				rightHeight = GeneralTreeFunctions.getHeight(currentNode.children[1])
			}
			if (leftHeight > rightHeight) {
				currentNode = currentNode.children[0]
			}
			else if (rightHeight > leftHeight) {
				currentNode = currentNode.children[1]
			}
			else {
				//not sure what to do here
				currentNode = currentNode.children[0]
			}
		}
		return currentNode
	}
}

class BinaryTreeNode {
	constructor(value, parentNode,children) {
		this.value = value;
		this.parent = parentNode;
		if (children !== undefined) {
			this.children = children;	//index 0 leftChild and index 1 rightChild
		} else {
			this.children = []
		}
	}
	addParent(parentNode) {
		this.parent = parentNode;
		//left child
		if (this.value < parentNode.value && parentNode.children[0] === undefined) {
			parentNode.children[0] = this;
			//right child
		} else if (this.value > parentNode.value && parentNode.children[1] === undefined) {
			parentNode.children[1] = this;
		} else {
			console.log("Can not add node to parent node.");
			console.log("Node: ");
			console.log(this);
			console.log("Parent Node: ");
			console.log(parentNode);
			this.parent = undefined;
		}
	}
}

module.exports.Tree = Tree;
module.exports.BinaryTreeNode = BinaryTreeNode;