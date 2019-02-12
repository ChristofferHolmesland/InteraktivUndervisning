class Tree {
	constructor(rootnode,nodes) {
		this.root = rootnode;
		if (nodes !== undefined) {
			this.nodes = nodes;
		}else {
			this.nodes = [rootnode];
		}
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
			this.parent = undefined;
		}
	}
	/*
	get leftChild() {
		return this.#leftChild;
	}

	get rightChild() {
		return this.#rightChild;
	}

	get parent() {
		return this.#parent
	}
	*/
}

module.exports.Tree = Tree;
module.exports.BinaryTreeNode = BinaryTreeNode;