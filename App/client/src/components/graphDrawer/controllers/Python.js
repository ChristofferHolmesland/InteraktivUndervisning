export default class Python {
	_config(config) {
		if (config && config.steps) {
			// Read last step to find the data types defined by the script
			let types = config.steps[config.steps.length - 1].classes;
			types.forEach((t) => this.objectTypes.push(t));
		}

		this.drawStatic();
		this.stateHandlers.Move = this.gd.controllers["Graph0"].moveNode.bind(this);
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

	joinHandler(e) {

	}

	removeHandler(e) {

	}

	addVariableHandler(e) {
		let variableName = "";
		while (variableName == "") {
			variableName = prompt("Enter variable name:", "");
			if (variableName == undefined) variableName = "";
		}

		

		/*
		let yPadding = 10 + this.gd.R * 2;
		let margin = 10;
		*/

		let variable = {
			name: variableName,
			position: { x: e.offsetX, y: e.offsetY },
			links: []
		};

		this.variables.push(variable);

		/*
		if (this.variables.length == 1) {
			let p = this.gd.camera.project(margin, margin);
			variable.position.x = p.x + this.gd.R;
			variable.position.y = p.y + this.gd.R;
		} else {
			let last = this.variables[this.variables.length - 2];
			variable.position.x = last.position.x;
			variable.position.y = last.position.y + yPadding;
		}
		*/

		this.gd.nodes.push({
			x: variable.position.x,
			y: variable.position.y,
			r: this.gd.R,
			v: variable.name
		});

		this.gd.dirty = true;
		return true;
	}

	addObjectHandler(e) {
		let objectType = "";
		while (objectType == "") {
			objectType = prompt("Enter object type:", "");
			if (objectType == undefined) objectType = "";
			// Only accept defined types (TODO: Decide if we want to help the student)
			if (!this.objectTypes.includes(objectType)) objectType = "";
		}

		let baseType = this.objectTypes.indexOf(objectType) < 3;

		let objectValue = undefined;
		if (baseType) objectValue = prompt("Enter object value:", "");

		/*
		let yPadding = 10 + this.gd.R * 2;
		let margin = 10 * this.gd.R;
		*/
		let object = {
			type: objectType,
			baseType: baseType,
			value: objectValue,
			position: { x: e.offsetX, y: e.offsetY },
			links: baseType ? undefined : []
		};

		this.objects.push(object);

		/*
		if (this.objects.length == 1) {
			let p = this.gd.camera.project(margin, margin / this.gd.R);
			object.position.x = p.x + this.gd.R;
			object.position.y = p.y + this.gd.R;
		} else {
			let last = this.objects[this.objects.length - 2];
			object.position.x = last.position.x;
			object.position.y = last.position.y + yPadding;
		}
		*/

		this.gd.nodes.push({
			x: object.position.x,
			y: object.position.y,
			r: this.gd.R,
			v: object.baseType ? object.type + ": " + object.value : object.type
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