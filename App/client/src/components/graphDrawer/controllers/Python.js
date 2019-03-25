export default class Python {
	_config(config) {
		if (config && config.steps) {
			// Read last step to find the data types defined by the script
			let lastStep = config.steps[config.steps.length - 1];
			let types = lastStep.classes;
			let completed = ["String", "Number", "Boolean"];

			types.forEach((t) => {
				let fields = [];

				if (!completed.includes(t.name)) {
					completed.push(t.name);

					let fieldNames = [...t.objects.keys()];
					for (let i = 0; i < fieldNames.length; i++) {
						fields.push({
							name: fieldNames[i],
							type: t.data[t.objects.get(fieldNames[i])].type
						});
					}
				}

				this.objectTypes.push({
					name: t.name,
					fields: fields
				});
			});
		}

		// TODO: Remove this
		this.objectTypes.push({
			name: "Navn",
			fields: [
				{
					name: "fornavn",
					type: "String"
				},
				{
					name: "etternavn",
					type: "String"
				}
			]
		});
		this.objectTypes.push({
			name: "Person",
			fields: [
				{
					name: "navn",
					type: "Navn"
				},
				{
					name: "alder",
					type: "Number"
				}
			]
		});

		this.drawStatic();
	}

	configure() {
		this._config(this.config);
	}

	constructor(graphDrawer, config) {
		this.gd = graphDrawer;
		this.config = config;

		this.variables = [];
		this.objects = [];

		this.currentState = "Join";
		this.buttons = ["Join", "Remove", "Move", "Add_Variable", "Add_Object"];
		this.stateHandlers = {
			Join: this.joinHandler,
			Remove: this.removeHandler,
			Move: this.moveHandler,
			Add_Variable: this.addVariableHandler,
			Add_Object: this.addObjectHandler
		};

		this.objectTypes = [
			{
				name: "String",
				fields: [
					{
						name: "Data",
						type: "Value"
					}
				]
			},
			{
				name: "Number",
				fields: [
					{
						name: "Data",
						type: "Value"
					}
				]
			},
			{
				name: "Boolean",
				fields: [
					{
						name: "Data",
						type: "Value"
					}
				]
			}
		];

		for (let key in this.stateHandlers) {
			if (!this.stateHandlers.hasOwnProperty(key)) continue;
			if (this.stateHandlers[key] == undefined) continue;
			this.stateHandlers[key] = this.stateHandlers[key].bind(this);
		}
	}

	mouseDownHandler(e) {
		let consumed = this.detectUIInput(e);
		if (consumed) return;

		consumed = this.stateHandlers[this.currentState](e);
		return consumed;
	}

	joinHandler(e) {
		e.preventDefault();
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let handler = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			let node2 = this.gd.getNodeAtCursor(newE).node;

			if (node2 != undefined) {
				if (node != node2) {
					// Check if the edge is object -> object
					// or variable -> object
					let n1 = this.findObjectById(node.id);
					let n2 = this.findObjectById(node2.id);

					if (
						n1.type == "Object" &&
						n2.type == "Object" &&
						n2.object.fields
					) {
						// Ask user which property of the object they want linked
						let done = false;
						while (!done) {
							let text = "Which property do you want to link to?\n";
							for (let i = 0; i < n2.object.fields.length; i++) {
								text += "\n - " + n2.object.fields[i].name;
							}
							let input = prompt(text, "");

							for (let i = 0; i < n2.object.fields.length; i++) {
								if (n2.object.fields[i].name == input) {
									// If there is already something else linked
									// to the same field, the edge should be removed
									// from the GraphDrawer
									if (n2.object.fields[i].value != undefined) {
										this.removeEdge(
											n2.object.fields[i].value,
											n2.object.id
										);
									}

									n2.object.fields[i].value = n1.object.id;
									this.generateNodeText(n2.object.id);
									done = true;
									break;
								}
							}
						}
					} else if (n1.type == "Variable" && n2.type == "Object") {
						// Make the variable reference the object
						n1.object.links.push(n2.object);
					}

					this.gd.edges.push({
						n1: node,
						n2: node2
					});

					this.gd.dirty = true;
				}
			}

			this.gd.canvas.removeEventListener("mouseup", handler);
			this.gd.canvas.removeEventListener("touchend", handler);
			this.gd.canvas.removeEventListener("touchcancel", handler);
		}.bind(this);
		this.gd.canvas.addEventListener("mouseup", handler);
		this.gd.canvas.addEventListener("touchend", handler);
		this.gd.canvas.addEventListener("touchcancel", handler);
		return true;
	}

	removeHandler(e) {
		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		// Searches for the clicked node.
		for (let i = 0; i < this.gd.nodes.length; i++) {
			if (this.gd.isPointInNode(p.x, p.y, this.gd.nodes[i])) {
				// Checks if the node is connected to anything with edges.
				for (let j = 0; j < this.gd.edges.length; j++) {
					// Removes the edges.
					if (this.gd.edges[j].n1 == this.gd.nodes[i] 
						|| this.gd.edges[j].n2 == this.gd.nodes[i]) {
							this.gd.edges.splice(j, 1);
						j--;
					}
				}

				// Find and remove the the variable/object
				let node = this.gd.nodes[i];
				let removed = false;
				for (let j = 0; j < this.variables.length; j++) {
					let v = this.variables[j];
					if (v.id == node.id) {
						this.variables.splice(j, 1);
						removed = true;
						break;
					}
				}
				// If no variable was removed, it must be an object.
				if (!removed) {
					for (let j = 0; j < this.objects.length; j++) {
						let o = this.objects[j];
						if (o.id == node.id) {
							// Any object which contain a reference to this
							// object, should have the reference removed.
							for (let k = 0; k < this.objects.length; k++) {
								let oo = this.objects[k];
								if (oo.fields) {
									for (let g = 0; g < oo.fields.length; g++) {
										let f = oo.fields[g];
										if (f.value == o.id) {
											f.value = undefined;
											this.generateNodeText(oo.id);
										}
									}
								}
							}

							this.objects.splice(j, 1);
							removed = true;
							break;
						}
					}
				}

				if (!removed) {
					console.error(
						"GraphDrawer node was removed," +
							"but no variable/object was found in the controller"
					);
				}

				this.gd.nodes.splice(i, 1);
				this.gd.dirty = true;
				return true;
			}
		}

		// If no node was clicked, check if the cursor is close
		// to an edge
		let pickThreshold = 8;
		for (let e = 0; e < this.gd.edges.length; e++) {
			let d = this.gd.distanceFromEdgeToPoint(this.gd.edges[e], p.x, p.y);
			if (d < pickThreshold) {
				let n1 = this.findObjectById(e.n1.id);
				let n2 = this.findObjectById(e.n2.id);

				if (n1.type == "Variable")
					this.removeLink(n1.object, n2.object.id);
				else if (n1.type == "Object")
					this.removeFieldReference(n1.object, n2.object.id);

				if (n2.type == "Variable")
					this.removeLink(n2.object, n1.object.id);
				else if (n2.type == "Object")
					this.removeFieldReference(n2.object, n1.object.id);

				this.gd.edges.splice(e, 1);
				this.gd.dirty = true;
				return true;
			}
		}

		return false;
	}

	moveHandler(e) {
		e.preventDefault();
		let node = this.gd.getNodeAtCursor(e).node;
		if (node == undefined) return false;

		let moveHandler = function(newE) {
			if (node == undefined) return;

			newE.preventDefault();
			this.gd.setEventOffset(newE);
			let p = this.gd.camera.project(newE.offsetX, newE.offsetY);
			node.x = p.x - node.w / 2;
			node.y = p.y - node.h / 2;
			this.gd.dirty = true;
		}.bind(this);

		let upHandler = function(newE) {
			newE.preventDefault();
			this.gd.setEventOffset(newE);
			node = undefined;
			this.gd.canvas.removeEventListener("mousemove", moveHandler);
			this.gd.canvas.removeEventListener("mouseup", upHandler);
			this.gd.canvas.removeEventListener("touchmove", moveHandler);
			this.gd.canvas.removeEventListener("touchend", upHandler);
			this.gd.canvas.removeEventListener("touchcancel", upHandler);
		}.bind(this);

		this.gd.canvas.addEventListener("mousemove", moveHandler);
		this.gd.canvas.addEventListener("mouseup", upHandler);
		this.gd.canvas.addEventListener("touchmove", moveHandler);
		this.gd.canvas.addEventListener("touchend", upHandler);
		this.gd.canvas.addEventListener("touchcancel", upHandler);
		return true;
	}

	addVariableHandler(e) {
		let variableName = "";
		while (variableName == "") {
			variableName = prompt("Enter variable name:", "");
		}

		if (variableName == undefined || variableName == null) return true;

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let variable = {
			name: variableName,
			links: []
		};

		this.variables.push(variable);

		let node = this.gd.addNode({
			x: p.x,
			y: p.y,
			w: this.gd.R * 1.5,
			h: this.gd.R,
			v: "",
			shape: "Circle"
		});

		variable.id = node.id;
		this.generateNodeText(variable.id);

		this.gd.dirty = true;
		return true;
	}

	addObjectHandler(e) {
		let objectType = "";
		while (objectType == "") {
			objectType = prompt("Enter object type:", "");
			if (objectType == undefined || objectType == null) return true;
			if (!this.typeExists(objectType)) objectType = "";
		}

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let baseType = this.baseType(objectType);

		let objectValue = undefined;
		if (baseType) objectValue = prompt("Enter object value:", "");

		let object = {
			type: objectType,
			baseType: baseType,
			value: objectValue,
			links: baseType ? undefined : []
		};

		if (!baseType) {
			object.fields = [];

			for (let i = 0; i < this.objectTypes.length; i++) {
				let type = this.objectTypes[i];
				if (type.name == objectType) {
					for (let j = 0; j < type.fields.length; j++) {
						object.fields.push({
							name: type.fields[j].name,
							value: undefined
						});
					}
					break;
				}
			}
		}

		this.objects.push(object);

		let node = this.gd.addNode({
			x: p.x,
			y: p.y,
			w: this.gd.R * 2,
			h: this.gd.R * 2,
			v: "",
			shape: this.gd.nodeShape
		});

		// Move the node center to the mouse click
		node.x -= node.w / 2;
		node.y -= node.h / 2;

		object.id = node.id;
		this.generateNodeText(object.id);

		this.gd.dirty = true;
		return true;
	}

	detectUIInput(e) {
		if (e.offsetY < this.gd.canvas.height * 0.9) return false;

		let buttonIndex = Math.floor(e.offsetX / (this.gd.canvas.width / this.buttons.length));
		this.setCurrentState(this.buttons[buttonIndex]);
		return true;
	}

	setCurrentState(state) {
		this.currentState = state;
		this.drawStatic();
		this.gd.dirty = true;
	}

	drawStatic() {
		this.gd.staticContext.clearRect(0, 0, 
			this.gd.staticBuffer.width, this.gd.staticBuffer.height);

		let buttonWidth = this.gd.staticBuffer.width / this.buttons.length;
		let buttonHeight = this.gd.staticBuffer.height / 10;

		this.gd.staticContext.beginPath();
		for (let i = 0; i < this.buttons.length; i++) {
			this.gd.staticContext.fillStyle = "white";
			if (this.currentState == this.buttons[i]) {
				this.gd.staticContext.fillStyle = "lavender";
			}

			this.gd.staticContext.fillRect(
				i * buttonWidth,
				this.gd.staticBuffer.height - buttonHeight,
				buttonWidth,
				buttonHeight
			);
			this.gd.staticContext.rect(
				i * buttonWidth,
				this.gd.staticBuffer.height - buttonHeight,
				buttonWidth,
				buttonHeight
			);
			this.gd.staticContext.fillStyle = "black";
			let textWidth = this.gd.staticContext.measureText(this.buttons[i]).width;
			this.gd.staticContext.fillText(
				this.buttons[i],
				i * buttonWidth - (textWidth / 2) + buttonWidth / 2,
				this.gd.canvas.height - buttonHeight / 2 + (this.gd.fontHeight / 2));
		}
		this.gd.staticContext.stroke();
		this.gd.staticContext.closePath();
	}

	export() {}

	typeExists(typeName) {
		for (let i = 0; i < this.objectTypes.length; i++) {
			if (this.objectTypes[i].name == typeName) return true;
		}

		return false;
	}

	baseType(typeName) {
		for (let i = 0; i < 3; i++) {
			if (this.objectTypes[i].name == typeName) return true;
		}

		return false;
	}

	findObjectById(id) {
		for (let i = 0; i < this.variables.length; i++) {
			let v = this.variables[i];
			if (v.id == id) {
				return {
					type: "Variable",
					object: v
				};
			}
		}

		for (let i = 0; i < this.objects.length; i++) {
			let o = this.objects[i];
			if (o.id == id) {
				return {
					type: "Object",
					object: o
				};
			}
		}

		return {
			type: undefined,
			object: undefined
		}
	}

	generateNodeText(id) {
		let info = this.findObjectById(id);
		let node = this.gd.getNode(id);
		node.v = "ID: " + info.object.id + "\n";

		if (info.type == "Variable") {
			node.v += info.object.name;
			return;
		}

		// If it's not a variable, then the node is an object
		let typeText = "Type: " + info.object.type;
		let dataText = "";
		if (info.object.fields) {
			for (let i = 0; i < info.object.fields.length; i++) {
				let field = info.object.fields[i];
				dataText += field.name + ": ";
				dataText += field.value == undefined ? "not assigned" : field.value;
				if (i !== info.object.fields.length - 1) dataText += "\n";
			}
		} else dataText = "Data: " + info.object.value;

		node.v += typeText + "\n" + dataText;
	}

	removeEdge(id1, id2) {
		for (let i = 0; i < this.gd.edges.length; i++) {
			let e = this.gd.edges[i];
			if (e.n1.id == id1 && e.n2.id == id2) {
				this.gd.edges.splice(i, 1);
			} else if (e.n1.id == id2 && e.n2 == id1) {
				this.gd.edges.splice(i, 1);
			}
		}
	}

	removeLink(v, id) {
		for (let i = 0; i < v.links.length; i++) {
			let link = v.links[i];
			if (link.id == id) {
				v.object.links.splice(i, 1);
				break;
			}
		}
	}

	removeFieldReference(o, id) {
		if (!o.fields) return;

		for (let i = 0; i < o.fields.length; i++) {
			let f = o.fields[i];
			
		}
	}
}
