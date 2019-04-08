export default class Python {
	_config(config) {
		if (config && config.steps) {
			this.steps = config.steps.slice(0, config.steps.length - 1);

			// Read last step to find the data types defined by the script
			this.lastStep = config.steps[config.steps.length - 1];
			let types = this.lastStep.classes;
			let completed = ["String", "Number", "Boolean"];

			for (let t in types) {
				if (!types.hasOwnProperty(t)) continue;
				t = types[t];

				let fields = [];

				if (!completed.includes(t.name)) {
					completed.push(t.name);

					for (let i = 0; i < t.code.length; i++) {
						let code = t.code[i].trim();
						if (code.startsWith("self.")) {
							let objectName = code.split(" ")[0].slice(5);
							fields.push({
								name: objectName
							});
						}
					}
				}

				this.objectTypes.push({
					name: t.name,
					fields: fields
				});
			}

			if (this.gd.operatingMode == "Presentation") {
				this.gd.currentStep = this.steps.length - 1;
				this.gd.addSteppingButtons();
				this.parseSteps();
			}
		}

		if (this.gd.operatingMode == "Interactive") this.drawStatic();
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
		if (this.gd.operatingMode == "Presentation") return false;

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
							let ok = false;
							let field = undefined;
							for (let i = 0; i < n2.object.fields.length; i++) {
								if (n2.object.fields[i].name.startsWith(input)) {
									if (ok) {
										ok = false;
										break;
									}
									ok = true;
									field = n2.object.fields[i];
								}
							}

							if (ok) {
								// If there is already something else linked
								// to the same field, the edge should be removed
								// from the GraphDrawer
								if (field.value != undefined) {
									this.removeEdge(field.value, n2.object.id);
								}

								field.value = n1.object.id;
								this.generateNodeText(n2.object.id);
								done = true;
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
				let n1 = this.findObjectById(this.gd.edges[e].n1.id);
				let n2 = this.findObjectById(this.gd.edges[e].n2.id);

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

	addVariable(v) {
		let variable = {
			name: v.name,
			links: []
		};

		this.variables.push(variable);

		let node = this.gd.addNode({
			x: v.x,
			y: v.y,
			w: this.gd.R * 1.5,
			h: this.gd.R,
			v: "",
			shape: "Circle"
		});

		variable.id = node.id;
		this.generateNodeText(variable.id);
	}

	addVariableHandler(e) {
		let variableName = "";
		while (variableName == "") {
			variableName = prompt("Enter variable name:", "");
		}

		if (variableName == undefined || variableName == null) return true;

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		this.addVariable({
			name: variableName,
			x: p.x,
			y: p.y
		});

		this.gd.dirty = true;
		return true;
	}

	addObjectHandler(e) {
		let objectType = "";
		while (objectType == "") {
			let text = "Enter object type?\n";
			for (let i = 0; i < this.objectTypes.length; i++) {
				text += "\n - " + this.objectTypes[i].name;
			}
			objectType = prompt(text, "");
			if (objectType == undefined || objectType == null) return true;

			// Convert the first letter to uppercase, because the user might not
			// write it correctly
			objectType = objectType.charAt(0).toUpperCase() + objectType.slice(1);

			// Checks if it's a valid type
			let ok = false;
			let properName = "";
			for (let i = 0; i < this.objectTypes.length; i++) {
				let t = this.objectTypes[i];
				if (t.name.startsWith(objectType)) {
					// Prevent the user from entering a shorter version of
					// the type name, which matches more than one type name.
					if (ok) {
						ok = false;
						break;
					}

					ok = true;
					properName = t.name;
				}
			}
			if (!ok) objectType = "";
			else objectType = properName;
		}

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let baseType = this.baseType(objectType);

		let objectValue = undefined;
		if (baseType) objectValue = prompt("Enter object value:", "");

		let node = this.addObject({
			objectType: objectType,
			baseType: baseType,
			objectValue: objectValue,
			x: p.x,
			y: p.y
		}).node;

		// Move the node center to the mouse click
		node.x -= node.w / 2;
		node.y -= node.h / 2;

		this.gd.dirty = true;
		return true;
	}

	/*
		Creates and adds an object, and returns { object, node }.

		o needs to have the followwing properties:
			objectType (String, Number, Boolean, ....)
			baseType
			objectValue (Can be undefined if baseType is false)
			x
			y
	*/
	addObject(o) {
		let object = {
			type: o.objectType,
			baseType: o.baseType,
			value: o.objectValue
		};

		if (!o.baseType) {
			object.fields = [];

			for (let i = 0; i < this.objectTypes.length; i++) {
				let type = this.objectTypes[i];
				if (type.name == o.objectType) {
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
			x: o.x,
			y: o.y,
			w: this.gd.R * 2,
			h: this.gd.R * 2,
			v: "",
			shape: this.gd.nodeShape
		});

		object.id = node.id;
		this.generateNodeText(object.id);
		return {
			object: object,
			node: node
		};
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

	export() {
		return {
			variables: this.variables,
			objects: this.objects,
			_graphdrawer: this.gd.controllers["Graph0"].exportAsGraph()
		};
	}

	parseUserStep(step) {
		this.gd.controllers["Graph0"].steps = [
			Object.assign({ type: "Complete" }, step._graphdrawer)
		];
		this.gd.controllers["Graph0"]._parseGraphSteps();
	}

	parseSteps() {
		this.gd.nodes = [];
		this.gd.edges = [];
		this.variables = [];
		this.objects = [];
		this.gd.nextId = 0;

		let step = this.steps[this.gd.currentStep];
		if (step._graphdrawer) return this.parseUserStep(step);
		// Add variables
		let vars = this.getProps(step.objects);
		let margin = 25;
		let left = this.gd.camera.project(margin, margin);
		let right = this.gd.camera.project(
			this.gd.canvas.width - margin,
			margin
		);
		let width = right.x - left.x;
		let variableWidth = width / vars.length;

		let startX = this.gd.drawBuffer.width / 2;
		let startY = this.gd.drawBuffer.height / 2;

		for (let i = 0; i < vars.length; i++) {
			this.addVariable({
				name: vars[i],
				x: startX + variableWidth / 2 + i * variableWidth,
				y: startY
			});
		}

		const TO_PARENT = 0;
		const TO_CHILD = 1;

		/*
			Array of ui->id mappings,
			where the ui is the _uniqueId from the parser,
			and id is the unique id assigned by the GraphDrawer.

			{
				ui: Number,
				id: Number
			}
		*/
		let uniqueToGraphDrawerId = [];

		let generateAndLinkObjects = (parentNode, obj, direction, parsedParentObject) => {
			let info;
			let newObjectCreated = true;

			// This checks if the steps are too old to read.
			// If they are, the code needs to be parsed again
			// before the GraphDrawer can understand them.
			if (!obj.hasOwnProperty("_uniqueId")) {
				console.error(
					"The python code you are trying to render, " + 
					"was parsed by an older version which didn't support the GraphDrawer. " +
					"Please parse the code again using the newest version."
				);
				return;
			}
			
			let ui = obj._uniqueId;
			for (let i = 0; i < uniqueToGraphDrawerId.length; i++) {
				let mapping = uniqueToGraphDrawerId[i];
				if (mapping.ui == ui) {
					newObjectCreated = false;
					info = {
						object: this.findObjectById(mapping.id),
						node: this.gd.getNode(mapping.id)
					};
					break;
				}
			}

			if (newObjectCreated) {
				// If the parent object has more than one child,
				// they should be evenly spaced below the parent.
				let myX = undefined;
				if (parsedParentObject !== undefined) {
					let myUi = obj._uniqueId;
					let childrenCount = parsedParentObject.data.length
					let myIndex = -1;
					for (let i = 0; i < childrenCount; i++) {
						let c = parsedParentObject.data[i];
						if (c._uniqueId == myUi) {
							myIndex = i;
							break;
						}
					}

					let assumedSize = this.gd.R * 2;
					let padding = this.gd.R;
					let totalChildWidth = childrenCount * (assumedSize + padding);
					let startX = parentNode.x + parentNode.w / 2 - (totalChildWidth / 2);
				
					myX = startX + myIndex * (assumedSize + padding);
				}


				info = this.addObject({
					objectType: obj.type,
					baseType: this.baseType(obj.type),
					objectValue: obj.data,
					x: myX == undefined ? parentNode.x : myX,
					y: parentNode.y + 75 + Math.random() * 50
				});

				// This is not the right amount to move the node by, because it's width
				// isn't correctly set before it has been rendered once.
				// But it is close enough.
				if (myX == undefined) info.node.x -= info.node.w / 2;
				
				uniqueToGraphDrawerId.push({
					ui: ui,
					id: info.node.id
				});
			}

			let parent = this.findObjectById(parentNode.id);

			if (direction == TO_CHILD) {
				// If the direction of the link is towards the child, the
				// parent must be a variable.
				parent.object.links.push(info.object);
				this.gd.edges.push({
					n1: parentNode,
					n2: info.node
				});
			} else if (direction == TO_PARENT) {
				// If the direction of the link is towards the parent,
				// the parent must be an object.

				// Find position of obj in data array
				let dataIndex = -1;
				let data = parsedParentObject.data;
				for (let i = 0; i < data.length; i++) {
					if (data[i].type == obj.type && data[i].data == obj.data) {
						dataIndex = i;
						break;
					}
				}
				
				// Find variable name
				let variableName = "";
				let possibleNames = this.getProps(parsedParentObject.objects);
				for (let i = 0; i < possibleNames.length; i++) {
					let name = possibleNames[i];
					if (parsedParentObject.objects[name] == dataIndex) {
						variableName = name;
						break;
					}
				}

				// Link id of info.node to the parent.fields object
				for (let i = 0; i < parent.object.fields.length; i++) {
					let field = parent.object.fields[i];
					if (field.name == variableName) {
						field.value = info.node.id;
						break;
					}
				}

				this.gd.edges.push({
					n1: info.node,
					n2: parentNode
				});

				this.generateNodeText(parent.object.id);
			}

			// If the object is not a basetype, then it is an object
			// which can contain objects.
			if (!info.object.baseType && newObjectCreated) {
				let subObjectNames = this.getProps(obj.objects);
				for (let i = 0; i < subObjectNames.length; i++) {
					let subObjectIndex = obj.objects[subObjectNames[i]];
					let subObject = obj.data[subObjectIndex];
					generateAndLinkObjects(info.node, subObject, TO_PARENT, obj);
				}
			}
		};

		for (let i = 0; i < this.variables.length; i++) {
			let variable = this.variables[i];
			let node = this.gd.getNode(variable.id);

			generateAndLinkObjects(
				node, 
				step.data[step.objects[variable.name]], 
				TO_CHILD
			);
		}

		this.gd.centerCameraOnGraph();
	}

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
				v.links.splice(i, 1);
				this.generateNodeText(v.id);
				break;
			}
		}
	}

	removeFieldReference(o, id) {
		if (!o.fields) return;

		for (let i = 0; i < o.fields.length; i++) {
			let f = o.fields[i];
			if (f.value == id) {
				f.value = undefined;
				this.generateNodeText(o.id);
			}
		}
	}

	getProps(object) {
		let props = [];
		for (let prop in object) {
			if (object.hasOwnProperty(prop)) props.push(prop);
		}
		return props;
	}
}
