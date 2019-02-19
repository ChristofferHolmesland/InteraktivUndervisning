/*
    Interpreter for single file python scripts.

    Instructions:
        Open python.html
        Write code in the text area
        Open webconsole and type "parseCode()"

    Features not supported:
        - List comprehension
        - Inner classes
        - Inner functions (Class functions are ok)
        - The standard library
        - TODO: Lists
*/

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

function assignScope(object) {
    // Address -> Value
    object.data = [];
    // Name -> Address
    object.objects = new Map();
    object.functions = new Map();
    object.classes = new Map();
}

function parse(code) {
    let types = ["Number", "String", "Boolean", "Object"];
    let keyWords = ["def", "return", "class"];
    let operators = ["+", "-", "*", "/"];
    let expressionTypes = ["value", "operation", "function"];

    let getNewStep = function() { 
        let newStep = {};
        assignScope(newStep);
        
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

    let handleKeyWord = function(scope, line, keyWord, lineNumber, lines) {
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
                code: lines.slice(lineNumber + 1, length + 1)
            };
            assignScope(func);

            scope.functions.set(name, func);
            return {
                type: "SkipLines",
                data: length
            };
        } else if (keyWord == "return") {
            return evaluateExpression(scope, line.substring(7));
        }
    };

    let callFunc = function(func, scope, args) {
        // Add arguments as local functions
        for (let i = 0; i < func.args.length; i++) {
            func.objects.set(func.args[i], func.data.length);
            func.data[func.data.length] = args[i];
        }

        // Run function code
        let data = undefined;
        for (let i = 0; i < func.code.length; i++) {
            let r = parseLine(func, func.code[i], i, func.code, false);
            if (r !== undefined) {
                if (r.type !== "SkipLines") {
                    data = r;
                    break;
                }
            }
        }

        // Cleanup
        assignScope(func);
        return data;
    };


    let evaluateExpression = function(scope, expression) {
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

        // Check if its a variable
        if (scope.objects.has(expression)) {
            return scope.data[scope.objects.get(expression)];
        }

        // Both operators and function calls use ( and ).
        // To decide what kind of expression it is, everything before
        // the first ( is assumed to be the function/class name.
        // If the name includes an operator, it is an operation instead.
        let name = "";
        for (let i = 0; i < expression.length; i++) {
            name += expression[i];
            if (expression[i + 1] == "(") break;
        }
        let isOperation = util_checkIfArrayContainsAnyElement(name, operators);

        /*
            Check for function call or object instantiation
            Python doesn't support variables/functions/classes with the same
            name so it doesn't matter which order it is checked in. Scope (Local)
            objects are accessed before global (step) objects.
        */
        if (!isOperation) {
            // Parse and evaluate the arguments
            let startIndex = expression.indexOf("(") + 1;
            let args = expression.slice(startIndex, expression.length - 1).split(",");
            for (let i = 0; i < args.length; i++) {
                args[i] = evaluateExpression(scope, args[i]);
            }

            // This can only be true, if the function is defined inside
            // a class.
            if (scope.functions.has(name)) {
                
            }

            // Global function
            if (step.functions.has(name)) {
                let func = step.functions.get(name);
                return callFunc(func, scope, args);
            }

            // Global class
            if (step.classes.has(name)) {

            }

            return;
        }

        // The only valid expression left is an operation on two expressions
        let info = getOperationInfo(scope, expression);
        if (info.operator == "+") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number" || info.operand1.type == "String") {
                result.data = info.operand1.data + info.operand2.data;
            }

            return result;
        } else if (info.operator == "-") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number") {
                result.data = info.operand1.data - info.operand2.data;
            }

            return result;
        } else if (info.operator == "/") {
            if (info.operand1.type !== info.operand2.type) return;

            let result = {
                type: info.operand1.type
            }

            if (info.operand1.type == "Number") {
                result.data = info.operand1.data / info.operand2.data;
            }

            return result;
        } else if (info.operator == "*") {
            let result = {}

            if (info.operand1.type == "Number" && info.operand2.type == "Number") {
                result.data = info.operand1.data * info.operand2.data;
                result.type = "Number";
            } else if (info.operand1.type == "Number" && info.operand2.type == "String") {
                let data = "";
                for (let i = 0; i < info.operand1.data; i++) {
                    data += info.operand2.data;
                }
                result.data = data;
                result.type = "String";
            } else if (info.operand1.type == "String" && info.operand2.type == "Number") {
                let data = "";
                for (let i = 0; i < info.operand2.data; i++) {
                    data += info.operand1.data;
                }
                result.data = data;
                result.type = "String";
            }

            return result;
        }
    };

    let getOperationInfo = function(scope, expression) {
        // The operator is the first element in the operators array
        // which is outside of ( and ). If the expression is surrouned
        // by (), they can be removed.
        if (expression.startsWith("(") && expression.endsWith(")")) {
            expression = expression.slice(1, expression.length - 1);
        }

        let open = 0;
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] == "(") {
                open++;
            } else if (expression[i] == ")") {
                open--;
            } else if (operators.includes(expression[i]) && open == 0) {
                return {
                    operand1: evaluateExpression(scope, expression.slice(0, i)),
                    operand2: evaluateExpression(scope, expression.slice(i + 1)),
                    operator: expression[i]
                }
            }
        }
    }

    let parseLine = function(scope, line, i, lines, skipIndents) {
        // Check for empty line
        if (line.trim() == "") return;

        // Check if the line starts with spaces, if it does
        // skip the line because it should have been handled by
        // a keyword handler.
        if (line.startsWith(" ") && skipIndents) return;
        line = line.trim();

        // Check if the line is a function or class definition
        for (let k = 0; k < keyWords.length; k++) {
            if (line.startsWith(keyWords[k])) {
                return handleKeyWord(scope, line, keyWords[k], i, lines);
            }
        }

        // Checks if the line is an assignment
        let variableName = "";
        let expr = "";
        for (let j = 0; j < line.length; j++) {
            if (line[j] == "=") {
                variableName = line.substring(0, j).trim();
                expr = line.substring(j + 1).trim();
            }
        }

        // If it's not an assignment, it can still be
        // a valid expression (i.e. function call).
        if (variableName === "") expr = line;

        let evaluated = evaluateExpression(scope, expr);

        // Object property
        if (variableName.includes(".")) {

        }
        // Global object
        else if (variableName !== "") {
            if (scope.objects.has(variableName)) {
                let addr = scope.objects.get(variableName);
                scope.data[addr] = evaluated;
            } else {
                let addr = scope.data.length;
                scope.objects.set(variableName, addr);
                scope.data[addr] = evaluated;
            }
        }
    };

    let lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let r = parseLine(step, line, i, lines, true);
        if (r !== undefined) {
            if (r.type == "SkipLines") {
                i += r.data;
            }
        }
    }

    steps.push(step);
    return steps;
}

function util_checkIfArrayContainsAnyElement(arr, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (arr.indexOf(elements[i]) > -1) {
            return true;
        }
    }

    return false;
}


/*
    Examples of valid code that should run in this version

    def add(a, b):
        c = a + b
        return c + 10 + 10

    a = 2
    b = 3

    f = add((b + 3) / a, 2) 
*/