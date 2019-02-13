let codeInput = document.getElementById("code");

codeInput.addEventListener("keydown", function(e) {
    // Only accept the Tab key
    if (e.key !== "Tab" && e.which !== "9") return;

    // Prevent shifting focus from the element
    e.preventDefault();

    // Add 4 spaces
    let tabSize = 4;
    let tabPosition = codeInput.selectionStart;
    let textWithSpaces = codeInput.value.substring(0, tabPosition);
    for (let i = 0; i < tabSize; i++) textWithSpaces += " ";
    textWithSpaces += codeInput.value.substring(tabPosition);

    codeInput.value = textWithSpaces;
    // Move cursor to the right position
    codeInput.selectionStart = tabPosition + tabSize;
    codeInput.selectionEnd = tabPosition + tabSize;
});

function parseCode() {
    return parse(codeInput.value);
}

function parse(code) {
    let types = ["Number", "String", "Boolean", "Object"];
    let keyWords = ["def", "return"];
    let operators = ["+", "-"];
    let expressionTypes = ["value", "operation", "function"];

    let getNewStep = function() { 
        let newStep = {
            // Address -> Value
            data: [],
            // Name -> Address
            objects: new Map(),
            functions: new Map()
        };
        
        if (steps.length > 0) {
            let previousStep = steps[steps.length - 1];
            Array.prototype.push.apply(newStep.data, previousStep.data);
            for (let i = 0; i < previousStep.objects.keys().length; i++) {
                newStep.objects.set(
                    previousStep.objects.keys()[i],
                    previousStep.objects.get(previousStep.objects.keys()[i])
                );
            }
            for (let i = 0; i < previousStep.functions.keys().length; i++) {
                newStep.functions.set(
                    previousStep.functions.keys()[i],
                    previousStep.functions.get(previousStep.functions.keys()[i])
                );
            }
        }

        return newStep;
    };


    let steps = [];
    let step = getNewStep();

    let handleKeyWord = function(line, keyWord, lineNumber, lines) {
        if (keyWord == "def") {
            line = line.substring(4).split("(");
            let name = line[0];
            let args = line[1].substring(0, line[1].length - 2).split(",");
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
            }

            let length = 0;
            for (let i = lineNumber + 1; i < lines.length; i++) {
                if (lines[i].startsWith("    ")) length += 1;
                else break;
            }

            let func = {
                name: name,
                args: args,
                codeStart: lineNumber,
                codeEnd: length 
            };

            step.functions.set(name, func);
            return length;
        }
    };


    let evaluateExpression = function(expression) {
        expression = expression.trim();

        // Check for base types
        if (!isNaN(Number(expression))) {
            return { 
                data: Number(expression), 
                type: "Number" 
            };
        } else if (expression.startsWith("\"") && expression.endsWith("\"")) {
            return {
                data: expression.substring(1, expression.length - 1),
                type: "String"
            };
        } else if (expression == "True") {
            return {
                data: true,
                type: "Boolean"
            };
        } else if (expression == "False") {
            return {
                data: false,
                type: "Boolean"
            };
        }

        // Check for function call or object instantiation


        // Check for operation
    };

    let parseLine = function(line, i, lines) {
        // Check for empty line
        if (line.trim() == "") return;

        // Check if the line is a function or class definition
        let keyWord = false;
        for (let k = 0; k < keyWords.length; k++) {
            if (line.startsWith(keyWords[k])) {
                let length = handleKeyWord(line, keyWords[k], i, lines);
                i += length;
                keyWord = true;
                break;
            }
        }
        if (keyWord) return;

        // Check if the line starts with spaces, if it does
        // skip the line because it should have been handled by
        // a keyword handler.
        if (line.startsWith(" ")) return;


        let variableName = "";
        let expr = "";
        for (let j = 0; j < line.length; j++) {
            if (line[j] == "=") {
                variableName = line.substring(0, j).trim();
                expr = line.substring(j + 1).trim();
            }
        }

        // Object property
        if (variableName.includes(".")) {

        }
        // Global object
        else {
            if (step.objects.has(variableName)) {
                let addr = step.objects.get(variableName);
                let evaluated = evaluateExpression(expr);
                step.data[addr] = evaluated;
            } else {
                let addr = step.data.length;
                step.objects.set(variableName, addr);
                let evaluated = evaluateExpression(expr);
                step.data[addr] = evaluated;
            }
        }

    };

    let lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        parseLine(line, i, lines);
    }

    steps.push(step);
    return steps;
}