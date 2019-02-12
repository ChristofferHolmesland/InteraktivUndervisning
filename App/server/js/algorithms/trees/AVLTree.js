module.exports.checkAVLTree = function (tree) {
	let leftheight = 0;
	let rightheight = 0;
	if (tree[0].children[0] !== undefined) {
		leftheight = getHeight(tree[0].children[0]);
	}
	if (tree[0].children[1] !== undefined) {
		rightheight = getHeight(tree[0].children[1]);
	}
	let result = true;
	console.log(leftheight);
	console.log(rightheight);
	if (Math.abs(leftheight - rightheight) > 1) {
		result = false;
	}
	return result
};

function getHeight(node) {
	let childrenHeights = [];
	let maxHeight = 0;
	if (node !== undefined) {
		for (let i = 0; i < node.children.length; i++) {
			childrenHeights.push(getHeight(node.children[i]));
		}
		for (let i = 0; i < childrenHeights.length; i++) {
			console.log(childrenHeights);
			if (childrenHeights[i] > maxHeight) {
				maxHeight = childrenHeights[i];
			}
		}
		maxHeight++;
	}
	return maxHeight;
}