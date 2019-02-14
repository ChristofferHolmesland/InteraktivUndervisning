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