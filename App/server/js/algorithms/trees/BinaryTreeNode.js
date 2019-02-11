class BinaryTreeNode {
	constructor(value,parentNode) {
		this.value = value;
		this.parent = parentNode;
		this.children = [];	//index 0 leftChild and index 1 rightChild
	}

	addParent(parentNode) {
		this.parent = parentNode;
		if(this.value < parentNode.value) {
			parentNode.children[0] = this;
		}else if(this.value > parentNode.value) {
			parentNode.children[1] = this;
		}else {
			console.log("NO DUPLICATES ALLOWED :(");
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

module.exports.BinaryTreeNode = BinaryTreeNode;