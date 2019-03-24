export default class Python {
	_config(config) {
		if (config && config.steps) {
			// Read last step to find the data types defined by the script
			let types = config.steps[config.steps.length - 1].classes;
			types.forEach((t) => this.objectTypes.push(t));
		}

		// TODO: Remove this
		this.objectTypes.push("Navn");
		this.objectTypes.push("Person");

		this.drawStatic();
		let graph0 = this.gd.controllers["Graph0"];
		this.stateHandlers.Move = graph0.moveNode.bind(this);
		this.stateHandlers.Join = graph0.joinNode.bind(this);
		this.stateHandlers.Remove = graph0.removeNode.bind(this);
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
			Join: undefined,
			Remove: undefined,
			Move: undefined,
			Add_Variable: this.addVariableHandler,
			Add_Object: this.addObjectHandler
		};

		this.objectTypes = ["String", "Number", "Boolean"];

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

	addVariableHandler(e) {
		let variableName = "";
		while (variableName == "") {
			variableName = prompt("Enter variable name:", "");
		}

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let variable = {
			name: variableName,
			position: { x: p.x, y: p.y },
			links: []
		};

		this.variables.push(variable);

		this.gd.nodes.push({
			x: variable.position.x,
			y: variable.position.y,
			w: this.gd.R * 1.5, // calculate the width based on variable name length
			h: this.gd.R,
			v: variable.name,
			shape: "Circle"//this.gd.nodeShape
		});

		this.gd.dirty = true;
		return true;
	}

	addObjectHandler(e) {
		let objectType = "";
		while (objectType == "") {
			objectType = prompt("Enter object type:", "");
			// Only accept defined types (TODO: Decide if we want to help the student)
			if (objectType == undefined) return true;
			if (!this.objectTypes.includes(objectType)) objectType = "";
		}

		let p = this.gd.camera.project(e.offsetX, e.offsetY);

		let baseType = this.objectTypes.indexOf(objectType) < 3;

		let objectValue = undefined;
		if (baseType) objectValue = prompt("Enter object value:", "");

		let object = {
			type: objectType,
			baseType: baseType,
			value: objectValue,
			position: { x: p.x, y: p.y },
			links: baseType ? undefined : []
		};

		this.objects.push(object);

		let typeText = "Type: " + object.type;
		let dataText = "Data: " + object.value;

		this.gd.nodes.push({
			x: object.position.x,
			y: object.position.y,
			w: this.gd.R * 2, // Calculate width and height based on text dimensions
			h: this.gd.R * 2,
			v: object.baseType ? typeText + "\n" + dataText : typeText,
			shape: this.gd.nodeShape
		});

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
}
