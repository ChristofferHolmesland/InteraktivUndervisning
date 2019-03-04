//const GeneralTreeFunctions = require("./GeneralTreeFunctions.js");

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
			//console.log(oldIndex);
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
		for (let n= 0; n<this.nodes.length; n++) {
			console.log(n);
			console.log(this.nodes[n])
		}
	}

	createDuplicateTree() {
		let duplicateTree = new Tree();
		let valueList = [];
		for (let f=0;f<this.nodes.length;f++) {
			valueList.push(this.nodes[f].value);
		}
		let nodeList = [];
		for (let e=0;e<valueList.length;e++) {
			let newBinaryNodeCopy = new BinaryTreeNode(valueList[e]);
			nodeList.push(newBinaryNodeCopy);
		}
		for (let d=0; d<this.nodes.length; d++) {
			let orignalNode = this.nodes[d];
			let currentNode = nodeList[valueList.indexOf(orignalNode.value)];
			if (orignalNode.parent !== undefined) currentNode.parent = nodeList[valueList.indexOf(orignalNode.parent.value)];
			else currentNode.parent = undefined;
			if (orignalNode.children[0] !== undefined){
				currentNode.children[0] = nodeList[valueList.indexOf(orignalNode.children[0].value)]
			}
			if (orignalNode.children[1] !== undefined){
				currentNode.children[1] = nodeList[valueList.indexOf(orignalNode.children[1].value)]
			}
		}
		duplicateTree.nodes = nodeList;
		duplicateTree.root = nodeList[0];
		return duplicateTree;
	}

	findNodeInNodesUsingNode(node){
		let nodeValue = node.value;
		let index = -1;
		for(let l=0;l<this.nodes.length;l++){
			if (this.nodes[l].value === nodeValue) index = l;
		}
		return index
	}

	findNodeInNodesUsingValue(value) {
		let index = -1;
		for(let l=0;l<this.nodes.length;l++){
			if (this.nodes[l].value === value) index = l;
		}
		return index
	}

	getNodeWithValue(value) {
		let binaryNode = undefined;
		for (let t =0;t<this.nodes.length;t++) {
			if (this.nodes[t].value === value) binaryNode = this.nodes[t];
		}
		return binaryNode
	}
}

class BinaryTreeNode {
	constructor(value, parentNode, children) {
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

	get childrenAmount() {
		let amount = 0;
		let leftChild = this.children[0];
		let rightChild = this.children[1];
		if (this.children.length === 1 || this.children.length === 2) {
			//console.log(this.children);
			if (leftChild !== undefined) amount++;
			if (rightChild !== undefined) amount++
		}
		else {
			amount = this.children.length;
		}
		//console.log(amount);
		return amount;
	}

	compareNodes(node) {
		let parent = undefined;
		//check that the nodes have the same value
		if (node.value !== this.value) return false;
		//check that the parents have the same value
		if (node.parent !== undefined) parent = node.parent;
		if ((parent !== undefined && this.parent === undefined) || (parent === undefined && this.parent !== undefined)) return false;
		if (parent !== undefined && this.parent !== undefined) if (parent.value !== this.parent.value) return false;

		//check that the nodes have the same children
		if (node.childrenAmount !== this.childrenAmount) return false;
		else {
			let children = node.children;
			for (let c = 0; c < this.childrenAmount; c++) {
				if (children[c] !== undefined && this.children[c] !== undefined) {
					if (children[c].value !== this.children[c].value) return false;
				} else if (children[c] === undefined && this.children[c] === undefined) {
				} else return false
			}
		}
		return true
	}

}

module.exports.Tree = Tree;
module.exports.BinaryTreeNode = BinaryTreeNode;